// Hackathon City — O Confronto das Lendas. Configuração central da cena (assets, âncoras, tempos, áudio e conteúdo).
// O componente (hackathon-city-scene.js) só lê este arquivo.
//
// COMO FUNCIONA HOJE
//   Só existe a arte COMPOSTA (dragão, fênix, arena e avatar numa imagem). Por isso a cena anima o que é legítimo sem recortar
//   personagens: câmera, luz das tochas, névoa, brasas, as rajadas de fogo (partículas guiadas pelas âncoras abaixo), o clarão da
//   colisão, o tremor da câmera e a reação de luz sobre o avatar. Dragão e fênix ainda NÃO se movem: precisam dos sprites abaixo.
//
// COMO ATIVAR OS SPRITES (quando existirem)
//   1. Exporte cada peça em PNG/WebP com alpha, no MESMO canvas 1672x941 da composição (mesmo enquadramento).
//   2. Preencha o caminho em `assets.layers` / `assets.actors`. Peça preenchida passa a ser renderizada na camada correta.
//   3. Defina o trajeto de cada criatura em `actors.<id>.path` (pontos em % do canvas). Sem sprite não há trajeto: não se move nada.
//   A lista completa do que produzir está em docs/hackathon-city-assets.md.
//
// Coordenadas: pixels da arte composta (1672x941). O componente converte para % e acompanha qualquer tamanho.
(() => {
  const W = 1672;
  const H = 941;
  window.hackathonCityConfig = {
    stage: { width: W, height: H },

    assets: {
      composite: 'assets/img/Portais/Captulo IV/hackathon-arena.jpg',
      // Camadas independentes (null = ainda não produzida). Ordem de baixo para cima.
      layers: {
        sky: null,            // Layer 0 — céu e lua
        farCity: null,        // Layer 1 — montanhas e castelos distantes
        towers: null,         // Layer 2 — torres e arquitetura da arena
        arenaEmpty: null,     // Layer 6 — arena e estruturas próximas, sem personagens
        balcony: null,        // Layer 7 — varanda frontal
        avatar: null,         // Layer 8 — avatar observando
        avatarReact: null,    // Layer 8 — avatar reagindo ao primeiro ataque / impacto
      },
      actors: {
        dragon: { idle: null, wingsOpen: null, wingsFolded: null, attacking: null },
        phoenix: { flying: null, diving: null, attacking: null },
        fx: { dragonFire: null, phoenixFire: null },
      },
    },

    // Pontos importantes na arte composta, em px. Guiam rajadas, brilhos e a colisão.
    anchors: {
      // dentro das bocas (garganta do dragão; cavidade do bico da fênix), medidas na arte ampliada
      dragonMouth: [872, 248],
      phoenixBeak: [1166, 264],
      collision: [1072, 330],
      dragonBreathControl: [960, 282],
      phoenixFireControl: [1125, 302],
      moon: [1010, 55],
      arena: [900, 590],
      focus: { avatar: [250, 600], arena: [900, 480], battle: [960, 300] },
      torches: [[692, 495], [838, 482], [992, 482], [622, 528], [1198, 578], [1105, 630], [38, 650], [760, 848], [1617, 808]],
      // silhueta do avatar (só recebe luz refletida; a imagem dele não é movida nem deformada)
      avatarPolygon: [[150, 740], [165, 622], [215, 545], [255, 492], [300, 458], [352, 466], [376, 502], [430, 546], [482, 602], [497, 662], [470, 762], [420, 802], [340, 792], [250, 782]],
    },

    // Atores: criaturas. `meaning` é narrativa; `team` só é preenchido quando houver confirmação (nunca atribuir por conta própria).
    actors: {
      dragon: {
        label: 'Dragão branco', box: [6, 0, 51, 42], path: null, team: null,
        meaning: 'O dragão de luz fria simboliza a estratégia e a precisão. É um símbolo da narrativa visual, não um mascote oficial de nenhuma equipe.',
      },
      phoenix: {
        label: 'Fênix', box: [63, 0, 99, 48], path: null, team: null,
        meaning: 'A fênix simboliza a criatividade que renasce a cada tentativa. É um símbolo da narrativa visual, não um mascote oficial de nenhuma equipe.',
      },
    },

    // Duração dos atos, em segundos (soma ≈ 20 s). Edite à vontade.
    timeline: { act1: 6, act2: 5, act3: 6.5, act4: 4, shake: { amplitude: 6, duration: 0.5 }, maxFlashOpacity: 0.42 },

    // Áudio: preencha `src` de cada sinal com um arquivo seu (licença apropriada) em assets/audio/. Sem nenhum arquivo, os controles
    // de som nem aparecem e a cena é silenciosa. Nada toca antes do clique em "Iniciar".
    audio: {
      volume: 0.5,
      storageKey: 'hackathon-som',
      cues: {
        ambience: { src: null, loop: true, gain: 0.35 },
        wings: { src: null, gain: 0.5 },
        dragonRoar: { src: null, gain: 0.7 },
        phoenixCry: { src: null, gain: 0.7 },
        fire: { src: null, gain: 0.6 },
        impact: { src: null, gain: 0.8 },
      },
    },

    // Destino da experiência: o botão final leva o visitante ao LinkedIn.
    story: {
      title: 'Hackathon City',
      tagline: 'Duas equipes. Um desafio. Uma jornada de inovação e colaboração.',
      disclaimer: 'Representação artística do Hackathon City: o dragão e a fênix são símbolos narrativos e não documentam o evento de forma literal.',
      linkedin: { label: 'Ver no LinkedIn', href: 'https://www.linkedin.com/in/marcos-simoes-ms/' },
    },
  };
})();
