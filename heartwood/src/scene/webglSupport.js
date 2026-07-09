/**
 * Checagem silenciosa de capacidade. Se WebGL não existir, o herói
 * renderiza o fallback em gradiente — o visitante nunca vê um erro
 * nem descobre que "perdeu" algo. (design doc §13.6)
 */
export function webglAvailable() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    )
  } catch {
    return false
  }
}
