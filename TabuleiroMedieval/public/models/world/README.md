# /models/world/

Coloque aqui o mundo exportado do Blender:

- `world.glb`

Ainda não é carregado automaticamente — o mundo continua 100% procedural
(ver `src/world/*.js`). Quando este arquivo existir, o próximo passo é
plugar `loadGameModel` em `Experience.buildWorld()` para substituir (ou
complementar) o terreno/castelos/estradas procedurais.

Convenções esperadas na cena do Blender, para quando isso acontecer:

- `PLAYER_SPAWN` ou `GAME_PlayerSpawn` — posição inicial do jogador.
- `COL_*` (ex.: `COL_Mountain01`, `COL_Bridge01`) — colisores (podem ficar invisíveis).
- `userData.walkable === true` — superfícies caminháveis (estradas, pontes, pátios).
- `ZONE_*` ou `userData.zone === true` — zonas/regiões dos reinos.
