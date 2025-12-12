import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { API_BASE_URL, copilotAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CopilotContext = createContext(null);

const createMessageId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `copilot-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const CopilotProvider = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const [sessionId, setSessionId] = useState(null);
  const [status, setStatus] = useState('idle');
  const [messages, setMessages] = useState([]);
  const [activeAgents, setActiveAgents] = useState([]);
  const [lastError, setLastError] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const pendingEvents = useRef([]);
  const abortController = useRef(null);

  const dispatchEvent = useCallback(async (session, event) => {
    try {
      await copilotAPI.publishEvent({ sessionId: session, ...event });
    } catch (error) {
      console.error('Copilot event error', error);
      setLastError(error.message || 'Failed to publish telemetry');
      throw error;
    }
  }, []);

  const publishEvent = useCallback(
    (type, payload = {}, options = {}) => {
      if (!isAuthenticated) {
        return Promise.resolve();
      }
      const event = {
        type,
        payload,
        highPriority: Boolean(options.highPriority),
      };
      if (!sessionId) {
        pendingEvents.current.push(event);
        return Promise.resolve();
      }
      return dispatchEvent(sessionId, event).catch(() => {});
    },
    [dispatchEvent, isAuthenticated, sessionId],
  );

  const bootstrapSession = useCallback(async () => {
    if (!isAuthenticated) {
      setSessionId(null);
      setStatus('unauthorized');
      return;
    }
    setStatus('connecting');
    setMessages([]);
    setActiveAgents([]);
    setLastError(null);
    try {
      const response = await copilotAPI.createSession({
        userId: user?.username,
        metadata: {
          userId: user?.id,
          username: user?.username,
          level: user?.level,
          fullName: user?.fullName,
        },
      });
      setSessionId(response.data.sessionId);
      setStatus('ready');
    } catch (error) {
      console.error('Copilot session error', error);
      setStatus('error');
      setLastError(error.response?.data || error.message);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (loading) return;
    bootstrapSession();
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [bootstrapSession, loading]);

  useEffect(() => {
    if (!sessionId || pendingEvents.current.length === 0) return;
    const queue = [...pendingEvents.current];
    pendingEvents.current = [];
    queue.forEach((event) => dispatchEvent(sessionId, event).catch(() => {}));
  }, [dispatchEvent, sessionId]);

  const handleAgentPulse = useCallback((agentName) => {
    if (!agentName) return;
    setActiveAgents((prev) => {
      const next = [agentName, ...prev.filter((name) => name !== agentName)];
      return next.slice(0, 4);
    });
  }, []);

  const handleDelta = useCallback((delta, assistantId) => {
    if (!delta) return;
    if (delta.type === 'action' && delta.action) {
      setPendingAction({
        id: createMessageId(),
        type: delta.action.type,
        payload: delta.action.payload || {},
        agent: delta.agent || 'orchestrator',
      });
      return;
    }
    if (!assistantId) return;
    if (delta.agent) {
      handleAgentPulse(delta.agent);
    }
    setMessages((prev) =>
      prev.map((message) => {
        if (message.id !== assistantId) return message;
        if (delta.finalMessage) {
          return {
            ...message,
            content: delta.content || message.content,
            streaming: false,
            completed: true,
          };
        }
        return {
          ...message,
          content: `${message.content || ''}${delta.content || ''}`,
          streaming: true,
        };
      }),
    );
  }, [handleAgentPulse]);

  const sendMessage = useCallback(
    async (text, options = {}) => {
      if (!sessionId || status !== 'ready') {
        throw new Error('Copilot is not ready yet.');
      }
      const trimmed = text?.trim();
      if (!trimmed) return;
      const userMessage = {
        id: createMessageId(),
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
      };
      const assistantId = createMessageId();
      setMessages((prev) => [
        ...prev,
        userMessage,
        {
          id: assistantId,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
          streaming: true,
        },
      ]);
      setLastError(null);
      publishEvent('USER_MESSAGE', { text: trimmed, mode: options.mode || 'chat' });

      const controller = new AbortController();
      abortController.current = controller;
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${API_BASE_URL}/copilot/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            sessionId,
            message: trimmed,
            mode: options.mode,
            context: options.context,
          }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error('Failed to reach the Copilot service.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const segments = buffer.split('\n');
          buffer = segments.pop();
          segments.forEach((segment) => {
            if (!segment?.trim()) return;
            try {
              const delta = JSON.parse(segment);
              handleDelta(delta, assistantId);
            } catch (error) {
              console.warn('Copilot delta parse error', segment, error);
            }
          });
        }
        if (buffer.trim()) {
          try {
            const delta = JSON.parse(buffer);
            handleDelta(delta, assistantId);
          } catch (error) {
            console.warn('Copilot delta parse error (final chunk)', buffer, error);
          }
        }
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error('Copilot chat error', error);
        setLastError(error.message || 'Copilot request failed');
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId
              ? {
                  ...message,
                  streaming: false,
                  error: true,
                  content: error.message || 'Copilot could not respond.',
                }
              : message,
          ),
        );
        throw error;
      } finally {
        abortController.current = null;
      }
    },
    [handleDelta, publishEvent, sessionId, status],
  );

  const cancelStreaming = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
    }
  }, []);

  const acknowledgeAction = useCallback(() => {
    setPendingAction(null);
  }, []);

  const value = useMemo(
    () => ({
      sessionId,
      status,
      messages,
      activeAgents,
      lastError,
      pendingAction,
      sendMessage,
      publishEvent,
      cancelStreaming,
      acknowledgeAction,
    }),
    [activeAgents, acknowledgeAction, cancelStreaming, lastError, messages, pendingAction, publishEvent, sendMessage, sessionId, status],
  );

  return <CopilotContext.Provider value={value}>{children}</CopilotContext.Provider>;
};

CopilotProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCopilot = () => {
  const context = useContext(CopilotContext);
  if (!context) {
    throw new Error('useCopilot must be used within a CopilotProvider');
  }
  return context;
};
