import { profile } from '../content/profile'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer__seal">
        <span aria-hidden="true">⚜</span> {profile.chronicle.marque} — escrito à mão por{' '}
        {profile.name} <span className="footer__handle">@{profile.handle}</span>
      </p>
      <p className="footer__note">A fênix renasce a cada deploy. Obrigado por caminhar até aqui.</p>
    </footer>
  )
}
