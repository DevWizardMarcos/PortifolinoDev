# /models/props/

Coloque aqui props reutilizáveis, por exemplo:

- `crystal.glb`
- `grimoire.glb`
- `lantern.glb`
- `altar.glb`
- `statue.glb`
- `bridge.glb`
- `ruins.glb`
- `memory-shard.glb`

Já tentam carregar (com fallback procedural enquanto o arquivo não existir):
- `src/world/props/Crystal.js` -> `crystal.glb`
- `src/world/props/Ruin.js` -> `ruins.glb`
- `src/world/WorldMapAltar.js` -> `altar.glb`
- `src/world/MemoryShard.js` -> `memory-shard.glb`
