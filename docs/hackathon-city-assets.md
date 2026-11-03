# Hackathon City — assets da cena cinematográfica

A cena (`assets/js/hackathon-city-scene.js`) lê tudo de `assets/js/data/hackathonCityConfig.js`.

## O que existe hoje
Só a arte **composta** (`assets/img/Portais/Captulo IV/hackathon-arena.jpg`, 1672×941): dragão, fênix, arena e avatar na mesma imagem.
Sem recorte, a cena anima somente o que não exige separar personagens:

- câmera (aproximação, retorno, tremor amortecido na colisão) e parallax sutil do mouse;
- tochas, névoa, lua e brilho da arena;
- rajadas de fogo frio (dragão) e quente (fênix) em partículas, guiadas pelas âncoras `dragonMouth`, `phoenixBeak` e `collision`;
- clarão único e suave na colisão, ondas de choque, brasas;
- luz refletida sobre o avatar (reação ao ataque e ao impacto), sem mover nem deformar o desenho.

**O dragão e a fênix ainda não se movem**: isso depende dos sprites abaixo.

## Sprites a produzir
Todos em PNG/WebP com alpha, **no mesmo canvas 1672×941 da composição**, mesmo enquadramento e mesma luz.

| Camada | Arquivo sugerido | Config |
|---|---|---|
| 0 Céu e lua | `hc-sky.webp` | `assets.layers.sky` |
| 1 Montanhas e castelos distantes | `hc-far-city.webp` | `assets.layers.farCity` |
| 2 Torres e arquitetura da arena | `hc-towers.webp` | `assets.layers.towers` |
| 6 Arena e estruturas próximas, **sem personagens** | `hc-arena-empty.webp` | `assets.layers.arenaEmpty` |
| 7 Varanda frontal | `hc-balcony.webp` | `assets.layers.balcony` |
| 8 Avatar observando | `hc-avatar.webp` | `assets.layers.avatar` |
| 8 Avatar reagindo (ataque/impacto) | `hc-avatar-react.webp` | `assets.layers.avatarReact` |
| Dragão, asas abertas | `hc-dragon-wings-open.webp` | `assets.actors.dragon.wingsOpen` |
| Dragão, asas recolhidas | `hc-dragon-wings-folded.webp` | `assets.actors.dragon.wingsFolded` |
| Dragão, atacando (mandíbula aberta) | `hc-dragon-attack.webp` | `assets.actors.dragon.attacking` |
| Dragão, pose base | `hc-dragon-idle.webp` | `assets.actors.dragon.idle` |
| Fênix voando | `hc-phoenix-fly.webp` | `assets.actors.phoenix.flying` |
| Fênix mergulhando | `hc-phoenix-dive.webp` | `assets.actors.phoenix.diving` |
| Fênix atacando | `hc-phoenix-attack.webp` | `assets.actors.phoenix.attacking` |
| Fogo branco-azulado | `hc-fire-dragon.webp` | `assets.actors.fx.dragonFire` |
| Fogo vermelho-dourado | `hc-fire-phoenix.webp` | `assets.actors.fx.phoenixFire` |

Para animação de asas e cauda, idealmente asas, cabeça, mandíbula e cauda em camadas separadas (não deformar a imagem inteira).

## Como ativar
1. Coloque os arquivos em `assets/img/Portais/hackathon/` e preencha os caminhos em `assets.layers` / `assets.actors`.
2. Defina `actors.<id>.path` (trajetória em pontos do canvas). Sem sprite não há trajetória.
3. Camada preenchida passa a ser renderizada; os estados dos atores (`idleFlight`, `approach`, `banking`, `preparingAttack`, `fireBreath`, `evasive`, `recovery`, `retreat`; fênix: `ascend`, `dive`, `counterAttack`, `flare`) já são atribuídos pela timeline em `data-state`.

## Áudio
Preencha `audio.cues.<sinal>.src` com arquivos próprios (licença apropriada) em `assets/audio/`: `ambience`, `wings`, `dragonRoar`, `phoenixCry`, `fire`, `impact`. Sem nenhum arquivo, os controles de som não aparecem. Nada toca antes do clique em "Iniciar".

## Destino
O botão final "Ver no LinkedIn" usa `story.linkedin` (`label` e `href`) em `hackathonCityConfig.js`. Para apontar para uma publicação específica, troque o `href`.
