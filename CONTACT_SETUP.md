# Mesa do Mensageiro — interface e demonstração local

Esta versão usa somente HTML, CSS e JavaScript do portfólio. Não possui API,
fetch, banco, email ou service. O envio é uma demonstração visual identificada
na seção. Os textos preenchidos permanecem ao fechar/reabrir e após a demonstração.

## Assets reais
Todos estão em `assets/img/formulario/`, sem renomear ou editar os PNGs:
- `pergaminho.png`: botão central fechado, 740px no desktop, pulsação de 2,8s.
- `pergaminhoAberto.png`: base do formulário em CSS; no mobile border-image
  aproveita o centro do mesmo arquivo e preserva melhor as bordas.
- `owl-idle.png`: ao abrir; `owl-watching.png`: ao focar/preencher.
- `owl-sending.png`: durante a demonstração; `owl-success.png`: ao concluir.
- `pena.png`: repouso inicial; `penaTinta.png`: após molhar a ponta.
- `tinteiro.png`: repouso; `tinteiroAberto.png`: sequência de tinta/escrita.

`assets/js/contact/config.js` contém os caminhos dos personagens.
Os pergaminhos são referenciados também no HTML (fechado) e CSS (aberto).
Não há placeholders, downloads ou versões alternativas. O selo é CSS.

## Estados e movimento
`scroll.js` separa closed/opening/open/closing do status do formulário.
Abrir revela a carta e campos, depois objetos, coruja e links, em 900ms.
Fechar leva 650ms, preserva os inputs e devolve foco ao botão. Enter e Space
funcionam nativamente. Reduced-motion remove animações sem remover personagens.

`scene.js` usa camadas de imagens reais com transições de opacity.
A primeira interação executa: aproximação (0–250ms), abrir tinteiro (250ms),
encostar a ponta na abertura (350ms), penaTinta (500ms), viajar ao campo
(600–900ms). O destino acompanha o campo atual mesmo se o foco mudar durante
a sequência. A pena não acompanha letras; `featherPositions` define âncoras.
O primeiro foco de cada reabertura repete a sequência. Blur fecha o tinteiro;
a pena com tinta permanece até fechar. Resize mantém a pena dentro da cena.
O foco troca a coruja para watching; submitting/success usam suas artes próprias.

## Onde você conectará o backend
Arquivo: `assets/js/contact/form.js`.
- `handleSubmit(event)`: valida, bloqueia submits repetidos e atualiza a interface.
- **`simulateContactSubmit(payload)`**: substitua essa função/chamada pelo seu
  envio real. O comentário **TODO: conectar backend real aqui.** marca o ponto.
- Hoje ela aguarda 1800ms, sem rede, para mostrar sending → success.
- Feedback: “Mensagem preparada com sucesso.” / “A coruja está pronta para levá-la.”
- No futuro, confirme a resposta real antes de success e ajuste os textos.
  O catch já preserva os valores para uma tentativa posterior.

## Arquivos alterados
`index.html`, `assets/css/contact.css`,
`assets/js/contact/config.js`, `scene.js`, `form.js`, `scroll.js`,
`backend/tests/contact_test.py`, `assets/contact/README.md`,
`docs/contact.md`, `.gitignore`.
`backend/README.md` foi restaurado ao conteúdo anterior à adição da API.
`CONTACT_SETUP.md` documenta a entrega atual.

## Removidos da tentativa anterior
- `backend/contact_api.py`
- `backend/tests/contact_api_test.py`
- `backend/tools/configure_contact.py`
- `assets/js/services/contactService.js`
- `assets/js/contact/environment.js`
- `.env.example` (continha somente configurações da API de contato)

A infraestrutura preexistente de testes Python/Playwright foi preservada.
O teste de contato foi refeito para conferir a demonstração, sem mocks de API.
Nenhum banco de mensagens foi criado ou removido nesta revisão.

## Testar
Sirva o portfólio com `python -m http.server 8000 --bind 127.0.0.1`.
Abra localhost:8000 e vá à Mesa do Mensageiro.
Abra por teclado, observe os personagens, foque um campo, acompanhe a tinta,
troque de campo, feche/reabra e confira o texto. Preencha dados válidos e clique
Selar e enviar: sending dura 1,8s, depois success. Não há envio real.

`python backend/tests/contact_test.py` testa os assets carregados, animação,
teclado, sequência da tinta, variantes de coruja, preservação, ausência de
requisições de contato, validação e telas 320/390/768/1400px com reduced-motion.
Capturas em `backend/output/contact-*.png` (ignorado no Git).

O site principal é estático e não tem build. O build disponível no projeto
separado foi executado: `cd TabuleiroMedieval; npm run build`.
Passou, com aviso de chunk JavaScript acima de 500 kB no mapa 3D.

