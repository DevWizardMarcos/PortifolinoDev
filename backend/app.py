from fastapi import FastAPI,HTTPException
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
import os
import smtplib
import ssl
from email.message import EmailMessage

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = [
        "http://127.0.0.1:5501",
        "http://localhost:5501",
    ],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)




@app.get('/')

def inicio():
    return {"mensagem" : 'Pergaminho funcionando'}

class MensagemContato(BaseModel):
    name : str = Field(min_length=2, max_length= 150) 
    email : str = Field(min_length=3, max_length= 254)
    subject : str = Field(default='', max_length= 150)
    message : str = Field(min_length=10,max_length=5000 )

def enviarEmail(dados: MensagemContato):
    usuario = os.getenv("SMTP_USER")
    senha = os.getenv("SMTP_PASSWORD")

    if not usuario or not senha:
        raise HTTPException(
            status_code= 503,
            detail= 'Envio de Email não configurado',
        )
    carta = EmailMessage()
    carta['From'] = usuario
    carta['To']= usuario
    carta['Subject'] = 'Novo contato pelo portfólio'

    carta.set_content(
        f'Nome: {dados.name}\n'
        f'Email: {dados.email}\n'
        f'Assunto: {dados.subject or 'Não informado'}\n\n'
        f'{dados.message}'
        )

    try:
        with smtplib.SMTP_SSL(
            "smtp.gmail.com",
            465, 
            context=ssl.create_default_context(),
            timeout=20, 
            ) as servidor:
                servidor.login(usuario, senha)
                servidor.send_message(carta)
    except(smtplib.SMTPException, OSError) as erro:
         print(f'falha no envio da mensagem : {type(erro).__name__}')
    
         raise HTTPException(
                status_code=502,
                detail="Não foi possível enviar o email.",
            ) from erro



@app.post('/contato')

def receberContato(dados: MensagemContato):
    enviarEmail(dados)

    return {
        "mensagem": "Mensagem aceita pelo servidor de email.",
        "nome": dados.name,
    }

