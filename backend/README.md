# backend — bastidores do portfólio

O portfólio principal é estático (HTML/CSS/JS na raiz). Esta pasta contém a
API FastAPI de envio de email (`app.py`) e as ferramentas de testes visuais.

## API do formulário

Veja o [passo a passo no README principal](../README.md#rodar-o-site-e-o-backend-do-formulário)
para instalar as dependências, configurar `backend/.env` e iniciar o site e a API.

Com as dependências e credenciais configuradas, execute na raiz do repositório:

```powershell
python -m uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000
```

Ou, dentro da pasta `backend`, use o comando curto:

```powershell
uvicorn app:app --reload
```

Por padrão, o Uvicorn usa `http://127.0.0.1:8000`.

O formulário usa `POST /contato`. O backend envia emails pelo Gmail para a conta
configurada em `SMTP_USER`. O site local deve estar na porta 5501, conforme o CORS.

## Ferramentas de testes visuais

As ferramentas abaixo usam Chromium headless via Playwright.

```
backend/
├── harness.py          # sobe o site local + abre o navegador (compartilhado)
├── tools/
│   ├── screenshot.py   # captura uma seção em qualquer viewport
│   └── measure.py      # mede posição/tamanho de elementos
├── tests/
│   └── eyes_test.py    # valida o "olhar" da arte de Minha Origem
├── output/             # capturas e relatórios (ignorado pelo git)
└── requirements.txt
```

## Instalação (uma vez)

```bash
pip install -r backend/requirements.txt
python -m playwright install chromium
```

## Uso (sempre a partir da raiz do repositório)

```bash
# capturas
python backend/tools/screenshot.py                                  # #sobre-mim em 1400px
python backend/tools/screenshot.py -s "#arsenal-skills" -w 800      # biblioteca em tablet
python backend/tools/screenshot.py -s "#arsenal-skills" --open full-stack
python backend/tools/screenshot.py -s "#sobre-mim" -w 420 --mobile
python backend/tools/screenshot.py -s "#sobre-mim" --reduced-motion

# medições (primeiro seletor = referência)
python backend/tools/measure.py ".spell-library__chamber" ".spell-book" ".spell-library__guardians"
python backend/tools/measure.py ".spell-library__chamber" ".spell-grimoire" --open full-stack

# teste do olhar (sai com código 1 se algo falhar)
python backend/tests/eyes_test.py
```

## O que o `eyes_test.py` garante

A arte de *Minha Origem* ganha vida por recortes mascarados da própria
ilustração (`.author-art-life` no `index.html`, estilos em
`assets/css/about-author.css`, lógica em `assets/js/about-author.js`). O teste
abre a página e confere:

1. **Amplitude** — íris até ±3.5px (horizontal) / ±1.6px (vertical); arte até 3/2px.
   Os olhos reagem mais que a arte, e com o cursor sobre o rosto o olhar é o original.
2. **Retorno** — ao sair da arte, o olhar volta suavemente (< 1s, sem salto).
3. **Fênix** — o brilho respira (opacidade varia no tempo, 5.2s azul / 6.1s vermelha).
4. **Isolamento** — forçando só `--eye-x/--eye-y`, apenas os pixels dentro das
   elipses dos olhos mudam; pálpebras e sobrancelha ficam intactas.
5. **Reduced-motion** — olhos e partículas ocultos, sem animação, JS inerte.
6. **Console** — nenhum erro de JavaScript.

Gera `output/eyes-positions.png` (olho ampliado por posição do cursor) e
`output/eyes-isolated.png` (deslocamento puro da íris) para inspeção visual.

### Calibrando as caixas dos olhos

As frações `--x/--y/--w/--h` de cada `.author-layer` no `index.html` são
relativas à arte de 1086×1448px (`assets/img/user/foto_perfil.png`). Se a arte
mudar, recalcule: `--x = esquerda/1086`, `--y = topo/1448`, `--w = largura/1086`,
`--h = altura/1448`. A zona sólida da máscara é ~57% da caixa; o restante é
degradê — mantenha-a dentro da abertura do olho.
