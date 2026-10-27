// Santuário da Conquista — xadrez clássico medieval com regras via chess.js.
(() => {
  if (!window.React) return;
  const h = window.React.createElement;
  const { useCallback, useEffect, useMemo, useRef, useState } = window.React;
  const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const CHALLENGE_FEN = '7k/8/5KQ1/8/8/8/8/8 w - - 0 1';
  const CHALLENGE_MOVE = Object.freeze({ from: 'g6', to: 'g7' });
  const ASSETS = Object.freeze({
    background: 'assets/img/Portais/Captulo IV/santuario-catedral.png',
    aline: 'assets/img/Portais/Capitulo V/Aline do Xeque em Energia Azul.png',
    alice: 'assets/img/Portais/Capitulo V/Alice do Xeque em Energia Azul.png',
    alineVictory: 'assets/img/Portais/Captulo IV/aline-victory-ceremony.png',
    aliceVictory: 'assets/img/Portais/Captulo IV/alice-victory-ceremony.png',
    chessPieces: 'assets/img/chess/cm-chessboard-standard.svg',
  });
  const PIECE_NAMES = { p: 'peão', n: 'cavalo', b: 'bispo', r: 'torre', q: 'dama', k: 'rei' };

  function pieceSvg(type, color = 'w') {
    return h('svg', { viewBox: '0 0 40 40', 'aria-hidden': 'true', focusable: 'false' },
      h('use', { href: `${ASSETS.chessPieces}#${color}${type}` })
    );
  }

  function ChessPiece({ piece, arriving }) {
    return h('span', { className: `chess-piece chess-piece--${piece.color === 'w' ? 'light' : 'shadow'}${arriving ? ' is-arriving' : ''}`, 'aria-hidden': 'true' }, pieceSvg(piece.type, piece.color));
  }

  function PlayerProfile({ side, active }) {
    const light = side === 'light';
    return h('figure', { className: `chess-profile chess-profile--${side}${active ? ' is-active' : ''}` },
      h('header', { className: 'chess-profile__title' },
        h('span', { className: 'chess-profile__emblem', 'aria-hidden': 'true' }, light ? '☀' : '☾'),
        h('strong', null, light ? 'Aline' : 'Alice'),
        h('small', null, light ? 'Guardiã da Luz' : 'Guardiã da Sombra')
      ),
      h('div', { className: 'chess-profile__portrait' }, h('img', { src: light ? ASSETS.aline : ASSETS.alice, alt: light ? 'Aline, Guardiã da Luz' : 'Alice, Guardiã da Sombra', decoding: 'async' })),
      h('blockquote', { className: 'chess-profile__quote' }, light ? '“Disciplina transforma potencial em conquista.”' : '“Equilíbrio não é escolha. É visão.”'),
      h('figcaption', null,
        h('span', { 'aria-hidden': 'true' }, light ? '☀' : '◆'),
        h('div', null, h('strong', null, active ? 'Em jogo' : 'Aguardando'), h('small', null, light ? 'Lado da Luz' : 'Lado da Sombra'))
      )
    );
  }

  function ChessBoard({ game, selected, legalMoves, lastMove, locked, onSquare }) {
    const legalMap = new Map(legalMoves.map(move => [move.to, move]));
    return h('div', { className: `medieval-board${locked ? ' is-locked' : ''}`, role: 'grid', 'aria-label': 'Tabuleiro de xadrez, oito por oito' },
      game.board().flatMap((rank, row) => rank.map((piece, col) => {
        const square = `${FILES[col]}${8 - row}`;
        const move = legalMap.get(square);
        const isLast = lastMove && (lastMove.from === square || lastMove.to === square);
        const label = piece ? `${PIECE_NAMES[piece.type]} ${piece.color === 'w' ? 'da Luz' : 'da Sombra'} em ${square}` : `Casa ${square} vazia`;
        return h('button', {
          key: square, type: 'button', role: 'gridcell', disabled: locked,
          className: `chess-square ${(row + col) % 2 ? 'is-dark' : 'is-light'}${selected === square ? ' is-selected' : ''}${move ? ' is-legal' : ''}${move?.captured ? ' is-capture' : ''}${isLast ? ' is-last' : ''}`,
          onClick: () => onSquare(square), 'aria-label': `${label}${move ? ', movimento permitido' : ''}`, 'aria-pressed': selected === square,
        },
          col === 0 && h('span', { className: 'chess-coordinate chess-coordinate--rank', 'aria-hidden': 'true' }, 8 - row),
          row === 7 && h('span', { className: 'chess-coordinate chess-coordinate--file', 'aria-hidden': 'true' }, FILES[col]),
          piece && h(ChessPiece, { piece, arriving: lastMove?.to === square }), move && h('i', { className: 'chess-move-marker', 'aria-hidden': 'true' })
        );
      }))
    );
  }

  function resultText(game) {
    if (game.in_checkmate()) return `Xeque-mate — ${game.turn() === 'w' ? 'Sombra' : 'Luz'} venceu.`;
    if (game.in_stalemate()) return 'Empate por afogamento.';
    if (game.in_threefold_repetition()) return 'Empate por repetição tripla.';
    if (game.insufficient_material()) return 'Empate por material insuficiente.';
    if (game.in_draw()) return 'A partida terminou empatada.';
    if (game.in_check()) return `${game.turn() === 'w' ? 'Luz' : 'Sombra'} está em xeque.`;
    return `Vez de ${game.turn() === 'w' ? 'Luz' : 'Sombra'}.`;
  }

  function SanctuaryScene({ onBack }) {
    const makeGame = useCallback(mode => !window.Chess ? null : new window.Chess(), []);
    const [mode, setMode] = useState('challenge');
    const gameRef = useRef(makeGame('challenge'));
    const [revision, setRevision] = useState(0);
    const [selected, setSelected] = useState(null);
    const [legalMoves, setLegalMoves] = useState([]);
    const [lastMove, setLastMove] = useState(null);
    const [feedback, setFeedback] = useState('Desafio final — vez da Luz. Conduza o equilíbrio até o xeque-mate.');
    const [promotion, setPromotion] = useState(null);
    const [victory, setVictory] = useState(null);
    const [locked, setLocked] = useState(false);
    const [restartConfirmed, setRestartConfirmed] = useState(false);
    const [tutorial, setTutorial] = useState(false);
    const [opponent, setOpponent] = useState('aline');
    const timers = useRef([]);
    const game = gameRef.current;
    const history = useMemo(() => game?.history() || [], [game, revision]);
    const clearTimers = useCallback(() => { timers.current.forEach(window.clearTimeout); timers.current = []; }, []);
    useEffect(() => clearTimers, [clearTimers]);

    const reset = useCallback((nextMode = mode) => {
      clearTimers(); gameRef.current = makeGame(nextMode); setMode(nextMode); setSelected(null); setLegalMoves([]); setLastMove(null); setPromotion(null); setVictory(null); setLocked(false); setRestartConfirmed(false);
      setFeedback(nextMode === 'challenge' ? 'Desafio final — vez da Luz. Conduza o equilíbrio até o xeque-mate.' : 'Partida local para dois jogadores — vez da Luz.');
      setRevision(value => value + 1);
    }, [clearTimers, makeGame, mode]);

    const restartGame = useCallback(event => {
      event?.preventDefault();
      event?.stopPropagation();
      const nextMode = mode;
      reset(nextMode);
      setRestartConfirmed(true);
      setFeedback(nextMode === 'challenge' ? 'Desafio reiniciado — todas as peças voltaram à posição de partida.' : 'Nova partida iniciada — vez da Luz.');
      timers.current.push(window.setTimeout(() => {
        setRestartConfirmed(false);
        setFeedback(nextMode === 'challenge' ? 'Desafio final — vez da Luz. Conduza o equilíbrio até o xeque-mate.' : 'Partida local para dois jogadores — vez da Luz.');
      }, 1400));
    }, [mode, reset]);

    const completeVictory = useCallback(winner => {
      setLocked(true); setFeedback('Xeque-mate. O Santuário reconheceu o equilíbrio.');
      const delay = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 0 : 650;
      timers.current.push(window.setTimeout(() => { setVictory(winner); setLocked(false); }, delay));
    }, []);

    const performMove = useCallback(moveInput => {
      if (!gameRef.current || locked) return;
      let move;
      try { move = gameRef.current.move(moveInput); } catch (_) { move = null; }
      if (!move) return;
      setLastMove(move); setSelected(null); setLegalMoves([]); setRevision(value => value + 1);
      if (gameRef.current.in_checkmate()) {
        completeVictory(move.color === 'w' ? 'aline' : 'alice');
        return;
      }
      setFeedback(resultText(gameRef.current));
    }, [completeVictory, locked]);

    const onSquare = square => {
      if (!game || locked || victory) return;
      const destination = legalMoves.find(move => move.to === square);
      if (selected && destination) {
        if (destination.flags.includes('p')) setPromotion({ from: selected, to: square });
        else performMove({ from: selected, to: square });
        return;
      }
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelected(square); setLegalMoves(game.moves({ square, verbose: true })); setFeedback(`${PIECE_NAMES[piece.type]} selecionado em ${square}.`);
      } else { setSelected(null); setLegalMoves([]); }
    };

    const undo = () => {
      if (mode !== 'classic' || locked || !game?.history().length) return;
      game.undo(); setLastMove(null); setSelected(null); setLegalMoves([]); setFeedback(resultText(game)); setRevision(value => value + 1);
    };
    const explore = () => document.getElementById('atlas-chronicle-title')?.focus({ preventScroll: false });
    if (!game) return h('section', { className: 'sanctuary-scene sanctuary-error', role: 'alert' }, h('h4', null, 'O tabuleiro não pôde ser iniciado'), h('p', null, 'A biblioteca de regras não foi carregada. Verifique a conexão e recarregue a página.'));

    return h('section', { className: `sanctuary-scene is-${mode}${victory ? ' is-victory' : ''}`, 'aria-label': 'O Jogo do Equilíbrio — xadrez medieval' },
      h('img', { className: 'sanctuary-scene__background', src: ASSETS.background, alt: '', 'aria-hidden': 'true' }),
      h('div', { className: 'sanctuary-scene__scroll' },
      h('header', { className: 'chess-sanctuary__header' },
        h('button', { type: 'button', onClick: onBack }, '← Região'),
        h('div', null, h('p', null, 'Santuário da Conquista'), h('h4', null, 'O Jogo do Equilíbrio')),
        h('nav', null, h('button', { type: 'button', onClick: () => setTutorial(true) }, 'Como jogar'), h('button', { type: 'button', onClick: explore }, 'Pular experiência'))
      ),
      h('div', { className: 'chess-mode-selector', role: 'tablist', 'aria-label': 'Modo de jogo' },
        h('button', { type: 'button', role: 'tab', 'aria-selected': mode === 'challenge', onClick: () => reset('challenge') }, 'Desafio final'),
        h('button', { type: 'button', role: 'tab', 'aria-selected': mode === 'classic', onClick: () => reset('classic') }, 'Partida clássica')
      ),
      mode === 'classic' && h('div', { className: 'chess-opponent', role: 'group', 'aria-label': 'Ambientação da partida local' },
        h('span', null, 'Mesa temática:'), h('button', { type: 'button', 'aria-pressed': opponent === 'aline', onClick: () => setOpponent('aline') }, 'Aline · Luz'), h('button', { type: 'button', 'aria-pressed': opponent === 'alice', onClick: () => setOpponent('alice') }, 'Alice · Sombra'), h('small', null, 'Dois jogadores locais — sem IA adversária.')
      ),
      h('div', { className: 'chess-sanctuary__arena' },
        h(PlayerProfile, { side: 'light', active: game.turn() === 'w' && !victory }),
        h('div', { className: 'chess-game', role: 'region', 'aria-label': 'Partida de xadrez' },
          h('div', { className: 'chess-status', role: 'status', 'aria-live': 'polite' }, h('strong', null, mode === 'challenge' ? 'Desafio final' : `Lance ${Math.floor(history.length / 2) + 1}`), h('span', null, victory ? 'O equilíbrio foi alcançado' : feedback)),
          h(ChessBoard, { game, selected, legalMoves, lastMove, locked, onSquare }),
          h('div', { className: 'chess-game__actions' },
            h('button', { type: 'button', className: restartConfirmed ? 'is-confirmed' : '', onClick: restartGame }, restartConfirmed ? (mode === 'challenge' ? 'Desafio reiniciado ✓' : 'Partida reiniciada ✓') : (mode === 'challenge' ? 'Reiniciar desafio' : 'Nova partida')),
            mode === 'classic' && h('button', { type: 'button', onClick: undo, disabled: !history.length }, 'Desfazer jogada'),
            mode === 'challenge' && h('button', { type: 'button', onClick: () => setFeedback('Dica: desenvolva as peças, proteja o rei e coordene a dama com os bispos.') }, 'Mostrar dica'),
            h('button', { type: 'button', onClick: () => setTutorial(true) }, 'Instruções')
          )
        ),
        h(PlayerProfile, { side: 'shadow', active: game.turn() === 'b' && !victory })
      ),
      h('aside', { className: 'chess-history', 'aria-label': 'Histórico de jogadas' }, h('strong', null, 'Histórico'), history.length ? h('ol', null, history.map((move, index) => h('li', { key: `${move}-${index}` }, move))) : h('p', null, 'Nenhum lance realizado.'))
      ),
      victory &&h('div', { className: `chess-victory is-${victory}`, role: 'dialog', 'aria-modal': 'false', 'aria-labelledby': 'chess-victory-title' },
        h('div', { className: 'chess-victory__aura', 'aria-hidden': 'true' }),
        h('img', { className: 'chess-victory__art', src: victory === 'aline' ? ASSETS.alineVictory : ASSETS.aliceVictory, alt: '', 'aria-hidden': 'true' }),
        h('div', { className: 'chess-victory__inscription' },
          h('p', null, 'Vitória'),
          h('h4', { id: 'chess-victory-title' }, victory === 'aline' ? 'Aline venceu' : 'Alice venceu'),
          h('strong', null, victory === 'aline' ? 'A luz consagra o equilíbrio' : 'A sombra revela o equilíbrio'),
          h('blockquote', null, '“A verdadeira conquista não pertence à luz ou à sombra, mas àquilo que conseguimos construir quando ambas se encontram.”'),
          h('div', { className: 'chess-victory__actions' },
            h('button', { type: 'button', className: 'chess-victory__replay', onClick: () => reset('challenge') }, h('span', { 'aria-hidden': 'true' }, '↻'), 'Jogar novamente'),
            h('button', { type: 'button', className: 'chess-victory__explore', onClick: explore }, 'Explorar minha conquista', h('span', { 'aria-hidden': 'true' }, '→'))
          )
        )
      ),
      promotion && h('div', { className: 'chess-promotion', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Promover peão' }, h('strong', null, 'Escolha a promoção'), h('div', null, ['q', 'r', 'b', 'n'].map(type => h('button', { key: type, type: 'button', onClick: () => { performMove({ ...promotion, promotion: type }); setPromotion(null); }, 'aria-label': `Promover para ${PIECE_NAMES[type]}` }, pieceSvg(type, game.turn()))))),
      tutorial && h('div', { className: 'chess-tutorial', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'chess-tutorial-title' }, h('div', null, h('button', { type: 'button', onClick: () => setTutorial(false), 'aria-label': 'Fechar instruções' }, '×'), h('p', null, 'Regras do Santuário'), h('h4', { id: 'chess-tutorial-title' }, 'Como jogar'), h('ol', null, h('li', null, 'Selecione uma peça da força que está em jogo.'), h('li', null, 'As casas disponíveis serão marcadas no tabuleiro.'), h('li', null, 'Escolha o destino. Capturas recebem um anel.'), h('li', null, 'No Desafio Final, jogue a partida completa e conduza o equilíbrio até o xeque-mate.')), h('button', { type: 'button', onClick: () => setTutorial(false) }, 'Voltar ao tabuleiro')))
    );
  }

  window.SanctuaryAssets = ASSETS;
  window.SanctuaryChallenge = Object.freeze({ fen: CHALLENGE_FEN, solution: 'Qg7#' });
  window.SanctuaryScene = SanctuaryScene;
})();
