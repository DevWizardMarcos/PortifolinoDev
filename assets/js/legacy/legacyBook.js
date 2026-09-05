(function () {
  const tabs = [
    ['identity', 'Identidade'],
    ['concept', 'Conceito'],
    ['stack', 'Stack'],
    ['architecture', 'Arquitetura'],
    ['features', 'Capacidades'],
    ['contributors', 'Criadores'],
    ['files', 'Arquivos']
  ];

  const statusLabels = {
    development: 'Em desenvolvimento',
    completed: 'Projeto concluído',
    'coming-soon': 'Em preparação'
  };

  const escapeHtml = value => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const safeUrl = value => {
    if (!value) return null;
    try {
      const url = new URL(value, window.location.href);
      return ['http:', 'https:'].includes(url.protocol) ? escapeHtml(value) : null;
    } catch (_) {
      return null;
    }
  };

  function normalizeProject(source) {
    const detailed = window.legacyProjects?.find(item => item.id === source.id) || {};
    const technologies = source.technologies || [];
    const fallbackTechGroups = technologies.length ? [{
      title: 'Tecnologias registradas',
      items: technologies.map(name => ({ name, description: 'Detalhes de uso em documentação.' }))
    }] : [];
    const fallbackFeatures = (source.technicalHighlights || source.contributions || []).map(title => ({
      title,
      description: 'Capacidade registrada no projeto.'
    }));
    const links = detailed.links || [
      source.github && { type: 'GitHub', label: 'Consultar código', url: source.github },
      source.demo && { type: 'Deploy', label: 'Acessar projeto', url: source.demo }
    ].filter(Boolean);

    return {
      ...source,
      ...detailed,
      slug: detailed.slug || source.id,
      subtitle: detailed.subtitle || source.role,
      slogan: detailed.slogan || source.shortDescription,
      summary: detailed.summary || source.shortDescription,
      problem: detailed.problem || source.challenge,
      purpose: detailed.purpose || source.legacy || source.solution,
      objective: detailed.objective || source.construction || source.solution,
      accentColor: detailed.accentColor || source.accentColor || '#9b7845',
      techGroups: detailed.techGroups || fallbackTechGroups,
      features: detailed.features || fallbackFeatures,
      architecture: detailed.architecture || { nodes: [], edges: [] },
      contributors: detailed.contributors || [],
      links,
      arts: {
        coverArt: null,
        conceptArt: null,
        studySketches: [],
        symbolArt: null,
        interfacePreview: null,
        gallery: [],
        ...(detailed.arts || {})
      }
    };
  }

  function ArtFrame({ src, alt, title, variant = 'concept', ratio = '4 / 3' }) {
    const cleanSrc = safeUrl(src);
    return `<figure class="book-art-frame book-art-frame--${escapeHtml(variant)}" style="--art-ratio:${escapeHtml(ratio)}">
      ${cleanSrc
        ? `<img src="${cleanSrc}" alt="${escapeHtml(alt)}" loading="lazy" data-book-art><div class="book-art-fallback" hidden><span>${escapeHtml(title)}</span><small>arte em produção</small></div>`
        : `<div class="book-art-fallback"><span>${escapeHtml(title)}</span><small>arte em produção</small></div>`}
      <figcaption>${escapeHtml(title)}</figcaption>
    </figure>`;
  }

  function BookPage(side, eyebrow, title, content) {
    return `<article class="book-page book-page--${side}">
      <span class="book-page__eyebrow">${escapeHtml(eyebrow)}</span>
      <h2>${escapeHtml(title)}</h2>
      <div class="book-page__rule" aria-hidden="true"><i></i><span>◇</span><i></i></div>
      <div class="book-page__content">${content}</div>
      <span class="book-page__number" aria-hidden="true">${side === 'left' ? 'I' : 'II'}</span>
    </article>`;
  }

  function EmptyRecord(message) {
    return `<div class="book-empty-record"><span aria-hidden="true">◇</span><p>${escapeHtml(message)}</p></div>`;
  }

  function Field(label, value) {
    return `<div class="relic-field"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value || 'Não informado')}</dd></div>`;
  }

  function ProjectIdentityPage(project, relicNumber) {
    const left = `${ArtFrame({ src: project.arts.coverArt, alt: `Arte de capa de ${project.title}`, title: 'Arte de capa', variant: 'cover', ratio: '3 / 4' })}
      <div class="identity-inscription"><strong>${escapeHtml(project.title)}</strong><q>${escapeHtml(project.slogan)}</q></div>`;
    const right = `<dl class="relic-sheet">
        ${Field('Categoria', project.categoryLabel || project.category)}
        ${Field('Status', statusLabels[project.status] || project.status)}
        ${Field('Ano', project.year)}
        ${Field('Classificação', project.classification)}
      </dl>
      <section class="ink-note"><h3>Resumo do registro</h3><p>${escapeHtml(project.summary)}</p></section>
      <div class="relic-signature"><span>Relíquia</span><strong>${String(relicNumber).padStart(2, '0')}</strong>${project.arts.symbolArt ? ArtFrame({ src: project.arts.symbolArt, alt: `Símbolo de ${project.title}`, title: 'Símbolo', variant: 'symbol', ratio: '1 / 1' }) : '<i aria-hidden="true">◈</i>'}</div>`;
    return BookSpread(
      BookPage('left', 'Gravura da relíquia', 'Identidade', left),
      BookPage('right', 'Registro catalogado', 'Ficha da relíquia', right)
    );
  }

  function ProjectConceptPage(project) {
    const sketches = project.arts.studySketches?.slice(0, 2).map((src, index) => ArtFrame({ src, alt: `Estudo ${index + 1} de ${project.title}`, title: `Estudo ${index + 1}`, variant: 'sketch', ratio: '1 / 1' })).join('') || '';
    const left = `${ArtFrame({ src: project.arts.conceptArt, alt: `Arte conceitual de ${project.title}`, title: 'Arte conceitual', variant: 'concept', ratio: '4 / 3' })}<div class="study-sketches">${sketches}</div><p class="margin-note">Estudo visual reservado para a próxima etapa.</p>`;
    const sections = [
      ['Por que foi criado', project.purpose],
      ['Problema', project.problem],
      ['Objetivo', project.objective]
    ].map(([title, text]) => `<section class="concept-entry"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text || 'Registro ainda não documentado.')}</p></section>`).join('');
    return BookSpread(BookPage('left', 'Prancha de estudo', 'Conceito', left), BookPage('right', 'Notas do criador', 'Origem da relíquia', sections));
  }

  function TechGroup(group) {
    return `<section class="tech-group"><h3>${escapeHtml(group.title)}</h3><div>${(group.items || []).map(item => `<article class="tech-entry"><span aria-hidden="true">✦</span><p><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.description)}</small></p></article>`).join('')}</div></section>`;
  }

  function ProjectStackPage(project) {
    const groups = project.techGroups || [];
    const midpoint = Math.ceil(groups.length / 2);
    const renderGroups = list => list.length ? list.map(TechGroup).join('') : EmptyRecord('Stack ainda não documentada.');
    return BookSpread(BookPage('left', 'Instrumentos I', 'Stack técnica', renderGroups(groups.slice(0, midpoint))), BookPage('right', 'Instrumentos II', 'Razões de uso', renderGroups(groups.slice(midpoint))));
  }

  function architectureLayout(architecture) {
    const nodes = architecture.nodes || [];
    const edges = architecture.edges || [];
    if (!nodes.length) return null;
    const incoming = Object.fromEntries(nodes.map(node => [node.id, 0]));
    edges.forEach(edge => { if (edge.to in incoming) incoming[edge.to] += 1; });
    const levels = {};
    let frontier = nodes.filter(node => incoming[node.id] === 0).map(node => node.id);
    let level = 0;
    const remaining = new Set(nodes.map(node => node.id));
    while (frontier.length) {
      const next = [];
      frontier.forEach(id => {
        levels[id] = level;
        remaining.delete(id);
        edges.filter(edge => edge.from === id).forEach(edge => {
          incoming[edge.to] -= 1;
          if (incoming[edge.to] === 0) next.push(edge.to);
        });
      });
      frontier = [...new Set(next)];
      level += 1;
    }
    remaining.forEach(id => { levels[id] = level; });
    const maxLevel = Math.max(...Object.values(levels), 0);
    const positions = {};
    for (let current = 0; current <= maxLevel; current += 1) {
      const row = nodes.filter(node => levels[node.id] === current);
      row.forEach((node, index) => {
        positions[node.id] = { x: ((index + 1) * 1000) / (row.length + 1), y: 65 + current * (370 / Math.max(maxLevel, 1)) };
      });
    }
    return { nodes, edges, positions };
  }

  function ArchitectureDiagram(architecture) {
    const layout = architectureLayout(architecture);
    if (!layout) return EmptyRecord('Diagrama de arquitetura ainda não documentado.');
    const paths = layout.edges.map(edge => {
      const from = layout.positions[edge.from];
      const to = layout.positions[edge.to];
      if (!from || !to) return '';
      const middle = (from.y + to.y) / 2;
      return `<path d="M ${from.x} ${from.y + 30} C ${from.x} ${middle}, ${to.x} ${middle}, ${to.x} ${to.y - 30}" marker-end="url(#book-arrow)" />`;
    }).join('');
    const nodes = layout.nodes.map(node => {
      const position = layout.positions[node.id];
      return `<g class="architecture-node" transform="translate(${position.x} ${position.y})"><rect x="-105" y="-28" width="210" height="56" rx="5"/><text text-anchor="middle" dominant-baseline="middle">${escapeHtml(node.label)}</text></g>`;
    }).join('');
    return `<div class="architecture-diagram" role="img" aria-label="Diagrama da arquitetura de ${escapeHtml(layout.nodes.map(node => node.label).join(', '))}"><svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet"><defs><marker id="book-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>${paths}${nodes}</svg></div>`;
  }

  function ProjectArchitecturePage(project) {
    const diagram = ArchitectureDiagram(project.architecture);
    const legend = project.architecture.nodes?.length ? `<ol class="architecture-legend">${project.architecture.nodes.map((node, index) => `<li><span>${String(index + 1).padStart(2, '0')}</span>${escapeHtml(node.label)}</li>`).join('')}</ol>` : EmptyRecord('Nós ainda não registrados.');
    return BookSpread(BookPage('left', 'Mapa de fluxo', 'Arquitetura', diagram), BookPage('right', 'Índice técnico', 'Componentes', `${legend}<p class="margin-note">As linhas representam o fluxo entre as partes documentadas.</p>`));
  }

  function ProjectFeaturesPage(project) {
    const features = project.features || [];
    const midpoint = Math.ceil(features.length / 2);
    const records = list => list.length ? `<div class="feature-register">${list.map((feature, index) => `<article><span>${String(index + 1).padStart(2, '0')}</span><div><h3>${escapeHtml(feature.title)}</h3><p>${escapeHtml(feature.description)}</p></div></article>`).join('')}</div>` : EmptyRecord('Capacidades ainda não documentadas.');
    return BookSpread(BookPage('left', 'Inventário I', 'Capacidades', records(features.slice(0, midpoint))), BookPage('right', 'Inventário II', 'Funções da relíquia', records(features.slice(midpoint))));
  }

  function ContributorRecord(person) {
    const github = safeUrl(person.github);
    return `<article class="contributor-record">
      <div class="contributor-seal">${person.avatar ? `<img src="${escapeHtml(person.avatar)}" alt="">` : '<span aria-hidden="true">◇</span>'}</div>
      <div><h3>${escapeHtml(person.name)}</h3><strong>${escapeHtml(person.role || 'Função não informada')}</strong>${person.contribution ? `<p>${escapeHtml(person.contribution)}</p>` : ''}
      ${person.responsibilities?.length ? `<ul>${person.responsibilities.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}
      ${github ? `<a href="${github}" target="_blank" rel="noopener noreferrer">Visitar GitHub <span aria-hidden="true">↗</span></a>` : ''}</div>
    </article>`;
  }

  function ProjectCollaboratorsPage(project) {
    const contributors = project.contributors || [];
    const introduction = `<div class="contributors-introduction">
      <span aria-hidden="true">◇</span>
      <strong>${contributors.length ? `${contributors.length} ${contributors.length === 1 ? 'criador registrado' : 'criadores registrados'}` : 'Registro em preparação'}</strong>
      <p>As assinaturas e contribuições desta relíquia são preservadas juntas no mesmo registro.</p>
    </div>`;
    const records = contributors.length
      ? `<div class="contributors-list">${contributors.map(ContributorRecord).join('')}</div>`
      : EmptyRecord('Colaboradores ainda não registrados.');
    return BookSpread(
      BookPage('left', 'Registro de autoria', 'Criadores da relíquia', introduction),
      BookPage('right', 'Contribuições', 'Créditos preservados', records)
    );
  }

  function fileRecords(project) {
    const links = (project.links || []).map(link => ({ ...link, url: safeUrl(link.url) })).filter(link => link.url);
    return links.length ? `<div class="file-register">${links.map(link => `<a href="${link.url}" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">▱</span><p><strong>${escapeHtml(link.type || 'Arquivo')}</strong><small>${escapeHtml(link.label || 'Abrir registro')}</small></p><i aria-hidden="true">↗</i></a>`).join('')}</div>` : EmptyRecord('Nenhum link público disponível no momento.');
  }

  function ProjectFilesPage(project) {
    const galleryCount = project.arts.gallery?.length || 0;
    const left = fileRecords(project);
    const right = `${ArtFrame({ src: project.arts.interfacePreview, alt: `Prévia da interface de ${project.title}`, title: 'Prévia da interface', variant: 'preview', ratio: '16 / 10' })}<p class="gallery-count">${galleryCount ? `${galleryCount} imagem(ns) na galeria` : 'Galeria em preparação'}</p>`;
    return BookSpread(BookPage('left', 'Documentos vinculados', 'Arquivos', left), BookPage('right', 'Registro visual', 'Interface', right));
  }

  function BookSpread(left, right) {
    return `<section class="book-spread" data-book-spread>${left}${right}<span class="book-spine" aria-hidden="true"></span></section>`;
  }

  function renderPage(project, page, relicNumber) {
    const pages = {
      identity: () => ProjectIdentityPage(project, relicNumber),
      concept: () => ProjectConceptPage(project),
      stack: () => ProjectStackPage(project),
      architecture: () => ProjectArchitecturePage(project),
      features: () => ProjectFeaturesPage(project),
      contributors: () => ProjectCollaboratorsPage(project),
      files: () => ProjectFilesPage(project)
    };
    return (pages[page] || pages.identity)();
  }

  function BookHeader(project, relicNumber) {
    return `<header class="bestiary-book__header">
      <div><span>Bestiário técnico · Relíquia ${String(relicNumber).padStart(2, '0')}</span><h1 id="dialog-title">${escapeHtml(project.title)}</h1></div>
      <p><strong>${escapeHtml(project.categoryLabel || project.category)}</strong><i aria-hidden="true">·</i>${escapeHtml(statusLabels[project.status] || project.status)}</p>
    </header>`;
  }

  function BookTabs(activePage) {
    return `<nav class="book-tabs" role="tablist" aria-label="Capítulos do projeto">${tabs.map(([id, label], index) => `<button type="button" role="tab" id="book-tab-${id}" aria-controls="book-panel" aria-selected="${id === activePage}" tabindex="${id === activePage ? '0' : '-1'}" data-book-tab="${id}" style="--tab-index:${index}"><span>${String(index + 1).padStart(2, '0')}</span>${label}</button>`).join('')}</nav>`;
  }

  function render(source, relicNumber, activePage = 'identity') {
    const project = normalizeProject(source);
    return `<section class="bestiary-book" data-bestiary-book data-project-id="${escapeHtml(project.id)}" data-relic-number="${escapeHtml(relicNumber)}" style="--book-accent:${escapeHtml(project.accentColor)}">
      ${BookHeader(project, relicNumber)}
      <div class="bestiary-book__stage">
        <div class="book-cover" aria-hidden="true"></div>
        <div id="book-panel" class="book-panel" role="tabpanel" aria-live="polite" aria-labelledby="book-tab-${activePage}" data-book-panel>${renderPage(project, activePage, relicNumber)}</div>
        ${BookTabs(activePage)}
      </div>
      <footer class="bestiary-book__footer"><span>Registro preservado no Salão dos Legados</span></footer>
    </section>`;
  }

  function activate(root, source, page, focusTab = false) {
    const project = normalizeProject(source);
    const relicNumber = Number(root.dataset.relicNumber);
    root.querySelector('[data-book-panel]').innerHTML = renderPage(project, page, relicNumber);
    const panel = root.querySelector('[data-book-panel]');
    panel.setAttribute('aria-labelledby', `book-tab-${page}`);
    panel.classList.remove('is-turning');
    void panel.offsetWidth;
    panel.classList.add('is-turning');
    root.querySelectorAll('[data-book-tab]').forEach(tab => {
      const active = tab.dataset.bookTab === page;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focusTab) tab.focus();
    });
  }

  function handleClick(event, source) {
    const tab = event.target.closest('[data-book-tab]');
    const root = event.target.closest('[data-bestiary-book]');
    if (tab && root) activate(root, source, tab.dataset.bookTab);
  }

  function handleKeydown(event, source) {
    const tab = event.target.closest('[data-book-tab]');
    const root = event.target.closest('[data-bestiary-book]');
    if (!tab || !root || !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const items = [...root.querySelectorAll('[data-book-tab]')];
    const current = items.indexOf(tab);
    const forward = ['ArrowDown', 'ArrowRight'].includes(event.key);
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (current + (forward ? 1 : -1) + items.length) % items.length;
    event.preventDefault();
    activate(root, source, items[index].dataset.bookTab, true);
  }

  function handleImageError(event) {
    const image = event.target.closest('[data-book-art]');
    if (!image) return;
    image.hidden = true;
    image.nextElementSibling.hidden = false;
  }

  window.LegacyBook = { render, handleClick, handleKeydown, handleImageError };
}());
