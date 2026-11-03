// Configuração central do Guardião Leão (O Estandarte Vivo). Os sprites e as coordenadas vêm de
// lionManifest.js, gerado por scripts/prepare-lion-assets.py; aqui ficam só os ajustes de movimento e áudio.
window.lionConfig = {
  assetBase: 'assets/img/guardiao/',

  // Tempos em segundos, deslocamentos em pixels do canvas nativo (1024 px) — escalam com o tamanho do leão.
  animation: {
    breath: { scale: 1.012, lift: 3, duration: 2.8 },        // respiração (só a base, sem inflar toda a cena)
    sway: { rotateY: 2.2, rotateX: 1.2, rotateZ: 0.9, x: 3, y: 2, min: 2.4, max: 4.4 },
    mane: { rotation: 0.9, x: 3.2, y: 2.4, min: 2.8, max: 5.2, followRotation: 1.1, followDuration: 0.9 },
    head: { rotateY: 7, rotateX: 5, rotateZ: 1.6, shift: 6, followDuration: 0.7 },
    gaze: { max: 6, followDuration: 0.35, radius: 1.5 },     // radius: alcance do olhar, em múltiplos do tamanho do leão
    touchGlance: { min: 2.4, max: 5.2 },                     // olhares autônomos em telas de toque
    blink: { enabled: true, min: 2.6, max: 6.2, close: 0.07, hold: 0.05, open: 0.12 },
    roar: {
      frontPose: true,   // true: encara o visitante e ruge de frente; false: ruge na pose 3/4 (mesma paleta do repouso)
      recoil: 0.34, stare: 0.12, hold: 1.05, recover: 1.1,
      flash: 0.5,        // intensidade máxima do clarão que esconde as trocas de pose (0 desliga)
    },
    impact: { amplitude: 7, frameAmplitude: 2.5, duration: 0.45 }, // tremor do palco e da moldura da seção
    entrance: { duration: 0.9, silentRoar: true },
  },

  // Áudio: gravação em assets/audio/guardiao-rugido.mp3 (efeitos-sonoros-rugido-de-leao.mp3). Se o arquivo faltar, cai no rugido
  // sintetizado (`synth`). Com `src: null` e `synth: false` o rugido é só visual e o botão de som não aparece.
  audio: {
    src: 'assets/audio/guardiao-rugido.mp3',
    synth: true,               // reserva: rugido gerado por código quando não há arquivo
    start: 0,                  // início do trecho usado, em segundos (a gravação tem 2 rugidos; este é o primeiro)
    duration: 2.5,             // duração do trecho
    fadeOut: 0.8,              // saída suave no fim do trecho
    gain: 2.4,                 // normalização (a gravação é baixa: pico 0,31)
    reverb: 0.16,              // reverberação de salão gótico por cima da gravação (0 desliga)
    volume: 0.6,               // volume geral
    attackAt: 0.28,            // segundo do trecho em que o rugido "estoura" — alinhado ao instante em que a boca abre
    storageKey: 'guardiao-som',
  },
};
