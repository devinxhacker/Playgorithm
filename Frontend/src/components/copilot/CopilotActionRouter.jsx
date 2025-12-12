import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCopilot } from '../../context/CopilotContext';

const ROUTE_ALIASES = {
  dashboard: '/dashboard',
  home: '/dashboard',
  landing: '/',
  hub: '/dashboard',
  'sorting-showdown': '/game/sorting-showdown',
  sorting: '/game/sorting-showdown',
  'sorting-game': '/game/sorting-showdown',
  'bubble-sort': '/game/sorting-showdown',
  'flexbox-arena': '/game/flexbox-arena',
  flexbox: '/game/flexbox-arena',
  'tic-tac-toe': '/game/tictactoe-arena',
  tictactoe: '/game/tictactoe-arena',
  'tictactoe-arena': '/game/tictactoe-arena',
  'queens-arena': '/game/queens-arena',
  queens: '/game/queens-arena',
  'n-queens': '/game/queens-arena',
  'zip-game': '/game/zip-game',
  zip: '/game/zip-game',
  'grid-arena': '/game/grid-arena',
  grid: '/game/grid-arena',
  'speed-debugging': '/game/speed-debugging',
  'speed-debug': '/game/speed-debugging',
  'missionaries-arena': '/game/missionaries-arena',
  missionaries: '/game/missionaries-arena',
  'chess-arena': '/game/chess-arena',
  chess: '/game/chess-arena',
  visualizer: '/visualizer',
  visualizers: '/visualizer',
  'algorithm-visualizer': '/visualizer',
  leaderboard: '/leaderboard',
  'leaderboard-charts': '/leaderboard',
  challenges: '/challenges',
  'coding-challenges': '/challenges',
};

const normalizeAlias = (value) => {
  if (typeof value !== 'string') return null;
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9/\s_-]/g, '')
    .replace(/([a-z])([0-9])/g, '$1-$2')
    .replace(/([0-9])([a-z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-');
};

const CopilotActionRouter = () => {
  const navigate = useNavigate();
  const { pendingAction, acknowledgeAction, publishEvent } = useCopilot();

  useEffect(() => {
    if (!pendingAction) return;
    const { type, payload = {} } = pendingAction;

    const executeNavigate = () => {
      const explicitPath = typeof payload.path === 'string' ? payload.path : null;
      const aliasHints = [
        payload.alias,
        payload.target,
        payload.game,
        payload.mode,
        payload.challenge,
        payload.feature,
      ];

      const derivedPath = explicitPath || aliasHints.reduce((match, hint) => {
        if (match || !hint) return match;
        const normalized = normalizeAlias(hint);
        if (normalized && ROUTE_ALIASES[normalized]) {
          return ROUTE_ALIASES[normalized];
        }
        if (typeof hint === 'string' && hint.startsWith('/')) {
          const segments = hint.split('/').filter(Boolean);
          if (segments.length >= 2 && segments[0] === 'game') {
            const fallback = normalizeAlias(segments[1]);
            if (fallback && ROUTE_ALIASES[fallback]) {
              return ROUTE_ALIASES[fallback];
            }
          }
        }
        return match;
      }, null);

      if (derivedPath) {
        navigate(derivedPath, { state: payload.state || payload.meta || null });
        publishEvent('COPILOT_ACTION', {
          name: 'NAVIGATE',
          path: derivedPath,
          payload,
        });
      } else {
        publishEvent('COPILOT_ACTION', {
          name: 'NAVIGATE_UNRESOLVED',
          payload,
        });
      }
    };

    switch ((type || '').toUpperCase()) {
      case 'NAVIGATE':
        executeNavigate();
        break;
      default:
        break;
    }

    acknowledgeAction();
  }, [acknowledgeAction, navigate, pendingAction, publishEvent]);

  return null;
};

export default CopilotActionRouter;
