
<p align="center">
  <img src="bannerPrincipalDev.png" alt="Banner" />
</p>

# 🧙 PortifolinoDev

![PortifolinoDev Hero](./readme/banner-principal.png)

A personal portfolio developed to showcase my professional journey, projects, technical skills, and experience as a Front-End Developer through an immersive interface inspired by medieval fantasy and interactive 3D environments.

## 🚀 Technologies

* ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
* ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)
* ![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge\&logo=javascript\&logoColor=F7DF1E)
* ![SASS](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge\&logo=sass\&logoColor=white)
* ![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge\&logo=threedotjs\&logoColor=white)
* ![React Three Fiber](https://img.shields.io/badge/React%20Three%20Fiber-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
* ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge\&logo=git\&logoColor=white)
* ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge\&logo=github\&logoColor=white)

## 📦 How to Run Locally

### Clone the repository

```bash
git clone https://github.com/DevWizardMarcos/PortifolinoDev.git
```

### Access the project

```bash
cd PortifolinoDev
```

### Rodar o site e o backend do formulário

O portfólio principal é estático (HTML/CSS/JavaScript). O formulário envia os
dados para `http://127.0.0.1:8000/contato`, usando o backend Python/FastAPI.
Para enviar emails, mantenha os dois servidores abaixo em execução.

**Pré-requisitos:** Python 3.12 ou superior (necessário para a sintaxe atual de
`backend/app.py`), pip e uma conta Gmail com senha de app para autenticação SMTP.

#### 1. Instalar as dependências

Na raiz do repositório:

```powershell
python -m pip install -r backend/requirements.txt
```

O Chromium do Playwright só é necessário para os testes visuais; não é necessário
instalá-lo para rodar o formulário.

#### 2. Configurar o envio de email

No PowerShell, copie o exemplo **somente se ainda não existir** `backend/.env`:

```powershell
if (!(Test-Path backend/.env)) { Copy-Item backend/.env.example backend/.env }
```

Preencha `backend/.env` com os dados da conta que enviará e receberá as mensagens:

```dotenv
SMTP_USER=seuemail@gmail.com
SMTP_PASSWORD=sua_senha_de_app_do_google
```

Use uma senha de app do Google no lugar da senha normal da conta.
O backend usa `smtp.gmail.com`, porta `465`, com SSL, e envia as mensagens
para o próprio `SMTP_USER`. O arquivo `.env` está ignorado pelo Git; mantenha
suas credenciais somente nele. Reinicie o backend depois de alterar esse arquivo.

#### 3. Iniciar o backend

No primeiro terminal, na raiz do repositório:

```powershell
python -m uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000
```

Ou use a forma curta, entrando na pasta `backend`:

```powershell
cd backend
uvicorn app:app --reload
```

Se o terminal já estiver na pasta `backend`, basta o segundo comando.
Por padrão, o Uvicorn usa `http://127.0.0.1:8000`.

Abra <http://127.0.0.1:8000/>. A resposta esperada é:

```json
{"mensagem":"Pergaminho funcionando"}
```

A documentação da API fica em <http://127.0.0.1:8000/docs>.
Essa resposta confirma que a API está ativa; o envio de email é verificado ao
submeter o formulário.

#### 4. Iniciar o site

No segundo terminal, também na raiz do repositório:

```powershell
python -m http.server 5501 --bind 127.0.0.1
```

Acesse <http://127.0.0.1:5501> e envie uma mensagem pelo formulário de contato.
Confira a caixa de entrada e o spam da conta configurada em `SMTP_USER`.
Também é possível usar o Live Server na porta **5501**.

O CORS do backend permite `http://127.0.0.1:5501` e `http://localhost:5501`.
Use uma dessas origens para abrir o site.

#### Problemas comuns

- **Sem conexão com o serviço de envio:** confira se o backend está rodando na porta 8000 e se o site foi aberto na porta 5501.
- **Envio de Email não configurado (503):** preencha `SMTP_USER` e `SMTP_PASSWORD` em `backend/.env` e reinicie o backend.
- **Não foi possível enviar o email (502):** confira as credenciais, a senha de app e a conexão com o servidor SMTP do Gmail.

Essas instruções são para uso local. Para o formulário funcionar no site publicado,
será necessário hospedar a API, configurar as variáveis de ambiente no servidor,
atualizar a URL em `assets/js/contact/form.js` e permitir o domínio do site no
CORS de `backend/app.py`.

O projeto Vite separado fica em `TabuleiroMedieval/`; os comandos `npm install`
e `npm run dev` devem ser executados nessa pasta quando for trabalhar nele.

## 📂 Project Structure

```text
PortifolinoDev/
│
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
│
├── readme/
│   └── banner-principal.png
│
├── package.json
└── README.md
```

## ✨ Features

* Interactive portfolio
* Medieval-inspired interface
* 3D environment
* Responsive design
* Project showcase
* Professional timeline
* Contact section

## 🌐 Live Demo

Coming soon...

## Google Maps — Tour 360° da Infinity School

O Capítulo III da seção **Minha Jornada** usa a Maps Embed API no modo
`streetview` para abrir a foto esférica original da Infinity School. O panorama
identificado no link original é `CIHM0ogKEICAgIC56YaWVg`.

Para habilitar a incorporação, ative a **Maps Embed API** em um projeto do
Google Cloud e preencha a meta tag abaixo no `<head>` de `index.html`:

```html
<meta name="google-maps-embed-key" content="SUA_CHAVE_PUBLICA_RESTRITA">
```

A chave usada pelo iframe fica visível no navegador por definição, portanto ela
não deve ter acesso a outras APIs. No Google Cloud Console:

1. Restrinja a chave à **Maps Embed API**.
2. Adicione uma restrição de aplicativo do tipo **Sites** (HTTP referrers).
3. Autorize apenas os domínios de produção e, se necessário, as origens locais
   usadas no desenvolvimento, como `http://127.0.0.1:5501/*`.

Sem a chave, o modal mostra uma explicação e mantém disponível o link para abrir
a foto esférica original diretamente no Google Maps. Nenhuma chave privada deve
ser adicionada ao repositório.
