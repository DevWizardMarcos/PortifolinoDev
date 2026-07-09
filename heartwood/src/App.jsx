import NavBar from './components/NavBar'
import JourneyBackdrop from './components/JourneyBackdrop'
import EmberLayer from './components/EmberLayer'
import WaypointRail from './components/WaypointRail'
import Threshold from './components/Threshold'
import Hero from './components/Hero'
import AboutCharacter from './components/AboutCharacter'
import PortalGate from './components/PortalGate'
import InteractiveBoard from './components/InteractiveBoard'
import HallOfLegacies from './components/HallOfLegacies'
import Chronicles from './components/Chronicles'
import Oracle from './components/Oracle'
import Contact from './components/Contact'
import Footer from './components/Footer'

/**
 * DevWizard Chronicles — o mundo do DevWizardMarcos, contínuo de
 * ponta a ponta: Banner → Personagem → Portal → Tabuleiro Medieval →
 * Salão dos Legados (projetos) → Crônicas da Guilda (aulas/eventos) →
 * Oráculo → A Fênix (contato).
 *
 * Camadas de continuidade: JourneyBackdrop (o céu que muda de região),
 * EmberLayer (brasas), WaypointRail (o Fio Dourado) e Thresholds
 * (passagens narrativas — as seções nunca se encostam).
 */
export default function App() {
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>

      <JourneyBackdrop />
      <EmberLayer />
      <WaypointRail />
      <NavBar />

      <main id="conteudo">
        <Hero />

        <Threshold whisper="Toda lenda começa com alguém. Adiante, o personagem." />
        <AboutCharacter />

        <Threshold whisper="Ao fundo da biblioteca, um anel de pedra cintila…" />
        <PortalGate />
        <InteractiveBoard />

        <Threshold whisper="Além da câmara, colunas de pedra guardam as relíquias do legado." />
        <HallOfLegacies />

        <Threshold whisper="E nem só de código se faz um legado: os escribas registraram as aulas, os eventos, as lideranças." />
        <Chronicles />

        <Threshold whisper="No ponto mais fundo da torre, algo aguarda a sua pergunta." />
        <Oracle />

        <Threshold whisper="A fênix já pressente a sua mensagem. O horizonte esquenta." />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
