# ⚔ DevWizard Chronicles

> **Uma experiência interativa de engenharia de software.**
> O visitante não rola uma página — atravessa o reino do DevWizard:
> da biblioteca arcana ao Tabuleiro Medieval, do Salão dos Legados
> aos portões onde a fênix aguarda sua mensagem.

Portfólio de **Marcos Paulo Simões (@DevWizardMarcos)** — Full-Stack Developer,
Professor e Líder Técnico. Identidade original do DevWizard: biblioteca mágica,
fênix azul e vermelha, roxo profundo + carmesim + dourado, Cinzel & Lora.

---

## ✦ A jornada

| Região | O que é |
|---|---|
| **Banner Principal** | A arte original do DevWizard: o mago, as fênix, nível 26 e a barra de XP |
| **Sobre o Personagem** | Classe · História · Guilda Atual · Formação · **Arsenal** (stacks por escola) |
| **O Portal** | Um anel de pedra; "Atravessar o portal" leva ao Tabuleiro com um lampejo |
| **Tabuleiro Medieval** | Mapa interativo do reino: 6 runas revelam cada domínio da carreira |
| **~ Salão dos Legados ~** | Projetos como Relíquias, com filtros, selos de impacto e Impacto Gerado |
| **Crônicas da Guilda** | Aulas, eventos, workshops e liderança em manuscrito iluminado |
| **O Oráculo** | Perguntas e respostas encantadas (preparadas — e honestas quanto a isso) |
| **A Fênix** | Contato: e-mail copiável, links, resposta em 48h |

### As quatro camadas de continuidade

1. **JourneyBackdrop** — um único céu fixo que muda de região em cross-fades lentos.
2. **EmberLayer** — brasas douradas subindo por todo o mundo.
3. **WaypointRail (o Fio Dourado)** — progresso, metáfora e navegação por runas.
4. **Threshold** — passagens narrativas entre lugares; seções nunca se encostam.

## ⚙️ Stack

React 18 + Vite · CSS puro com design tokens (`src/styles/tokens.css`) ·
Cinzel / Lora / JetBrains Mono · (cena 3D R3F aposentada em `src/scene/`,
pronta para um futuro Tabuleiro 3D — fora do bundle atual)

## 🚀 Rodando

```bash
cd heartwood
npm install
npm run dev        # http://localhost:5173
npm run build      # produção em dist/
```

## 📁 Estrutura

```
src/
├── content/        ← FONTE ÚNICA DE VERDADE: edite seus dados aqui
│   ├── profile.js      identidade, história, guilda, formação, nível/XP
│   ├── projects.js     relíquias, categorias, impacto, estatísticas
│   ├── skills.js       o Arsenal (stacks por escola)
│   ├── chronicles.js   aulas, eventos, workshops, liderança
│   ├── board.js        assentos do Tabuleiro Medieval
│   └── oracle.js       perguntas e respostas do Oráculo
├── components/     ← regiões do mundo + camadas de continuidade
├── scene/          ← cena 3D aposentada (não entra no bundle)
├── hooks/          ← useInView, usePrefersReducedMotion
└── styles/         ← tokens.css + base.css
public/img/         ← bannerPrincipal, bannerSalao, foto_perfil, avatar
```

## ⚡ Notas de engenharia

- JS total: ~55KB gz (React + app). As artes PNG (~8MB) são o maior custo —
  converter para WebP/AVIF é a otimização nº 1 pendente.
- `prefers-reduced-motion`: brasas apagadas, portal sem lampejo, oráculo sem
  máquina de escrever — conteúdo 100% preservado.
- Acessibilidade: skip-link, foco visível, tabuleiro e oráculo por teclado,
  respostas em `aria-live`.

## 🌿 Git workflow

`main` sempre deployável · branches `feat/…`, `content/…`, `fix/…` ·
Conventional Commits · merge via PR · releases SemVer com tags.

---

*A fênix renasce a cada deploy. Excelsior!* ⚔
