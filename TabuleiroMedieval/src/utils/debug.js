// =============================================================
// debug.js
// -------------------------------------------------------------
// Flag global de debug do modo exploração. Ative navegando com
// ?debug=1 na URL (ex.: http://localhost:5173/?debug=1).
// Quando true: colliders, spawn e HUD de debug ficam visíveis.
// =============================================================

export const DEBUG_EXPLORATION = new URLSearchParams(window.location.search).get('debug') === '1'
