import { useRef } from 'react'
import { useInView } from '../hooks/useInView'

/**
 * Revela o conteúdo ao entrar no viewport. O conteúdo sempre existe no
 * DOM — a animação é cosmética e desligada com prefers-reduced-motion.
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children }) {
  const ref = useRef(null)
  const visible = useInView(ref)

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
