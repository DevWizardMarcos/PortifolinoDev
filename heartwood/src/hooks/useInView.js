import { useEffect, useState } from 'react'

/**
 * Marca um elemento como visível quando entra no viewport (uma única vez).
 * Sem IntersectionObserver disponível, tudo fica visível — conteúdo nunca
 * depende de animação para existir.
 */
export function useInView(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, threshold])

  return visible
}
