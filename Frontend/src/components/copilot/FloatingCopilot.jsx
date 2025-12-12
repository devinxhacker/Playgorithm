import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { FiMessageCircle, FiMinimize2, FiMaximize2 } from 'react-icons/fi';
import { useCopilot } from '../../context/CopilotContext';
import './CopilotWidget.css';

const SIZE_PRESETS = {
  compact: { width: 320, height: 420, label: 'Compact' },
  comfort: { width: 420, height: 540, label: 'Comfort' },
  immersive: { width: 520, height: 640, label: 'Immersive' },
};

const statusCopy = {
  idle: 'Waiting',
  connecting: 'Connecting…',
  ready: 'Live',
  error: 'Offline',
  unauthorized: 'Sign in to chat',
};

const FloatingCopilot = () => {
  const { messages, status, sendMessage, activeAgents, lastError } = useCopilot();
  const [isOpen, setIsOpen] = useState(false);
  const [panelSize, setPanelSize] = useState('comfort');
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [messages, isOpen]);

  const dimensions = SIZE_PRESETS[panelSize];

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!draft.trim() || status !== 'ready') return;
    setIsSending(true);
    try {
      await sendMessage(draft);
      setDraft('');
    } catch (error) {
      // Error already surfaced via context state
    } finally {
      setIsSending(false);
    }
  };

  const renderStatus = useMemo(() => statusCopy[status] || 'Live', [status]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSubmit(event);
    }
  };

  return (
    <div className="copilot-container">
      {!isOpen && (
        <button
          type="button"
          className="copilot-launch"
          onClick={() => setIsOpen(true)}
          aria-label="Open Playgorithm Copilot"
        >
          <FiMessageCircle size={20} />
        </button>
      )}

      {isOpen && (
        <div
          className="copilot-panel"
          style={{
            width: `min(${dimensions.width}px, 90vw)`,
            height: `min(${dimensions.height}px, 85vh)`,
          }}
        >
          <header className="copilot-header">
            <div>
              <p className="copilot-label">Playgorithm Copilot</p>
              <p className={clsx('copilot-status', `copilot-status-${status}`)}>{renderStatus}</p>
            </div>
            <div className="copilot-controls">
              <select
                aria-label="Copilot panel size"
                value={panelSize}
                onChange={(event) => setPanelSize(event.target.value)}
              >
                {Object.entries(SIZE_PRESETS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="copilot-header-btn"
                onClick={() => setPanelSize((prev) => (prev === 'immersive' ? 'comfort' : 'immersive'))}
                aria-label="Toggle immersive mode"
              >
                <FiMaximize2 />
              </button>
              <button
                type="button"
                className="copilot-header-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Minimize copilot"
              >
                <FiMinimize2 />
              </button>
            </div>
          </header>

          <section className="copilot-agents">
            {activeAgents.length === 0 && <span className="copilot-agent-pill">Agents warming up…</span>}
            {activeAgents.map((agent) => (
              <span key={agent} className="copilot-agent-pill">
                {agent}
              </span>
            ))}
          </section>

          <section className="copilot-messages" ref={scrollRef}>
            {messages.length === 0 && (
              <p className="copilot-placeholder">
                Ask for strategy tips, leaderboard data, or explain what you are trying to solve. Copilot watches your
                current screen and guides you in real-time.
              </p>
            )}
            {messages.map((message) => (
              <article key={message.id} className={clsx('copilot-message', `copilot-message-${message.role}`)}>
                <div className="copilot-message-text">
                  {message.content}
                  {message.streaming && <span className="copilot-cursor" />}
                </div>
              </article>
            ))}
          </section>

          <footer className="copilot-input">
            {lastError && <p className="copilot-error">{lastError}</p>}
            <form onSubmit={handleSubmit}>
              <textarea
                rows={2}
                placeholder={
                  status === 'unauthorized'
                    ? 'Sign in to use Copilot'
                    : 'Explain what you need or describe what you are attempting…'
                }
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                disabled={status !== 'ready' || isSending}
              />
              <button type="submit" disabled={status !== 'ready' || isSending}>
                {isSending ? 'Sending…' : 'Send'}
              </button>
            </form>
          </footer>
        </div>
      )}
    </div>
  );
};

export default FloatingCopilot;
