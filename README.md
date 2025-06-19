# Sistema de Visualização de Indicadores Econômicos

Projeto desenvolvido para a disciplina de Programação III - AV3 (Substituição)

## Descrição
Sistema web completo para visualização, cadastro, edição e exclusão de indicadores econômicos, com integração à API pública do Banco Central para exibir a taxa Selic mais recente.

- **Back-end:** Django REST Framework (API REST)
- **Front-end:** HTML, CSS e JavaScript puro (consumindo a API)
- **Integração externa:** API Banco Central (Selic)
- **Deploy:** Back-end e front-end publicados separadamente

---

## Tecnologias Utilizadas
- Django 4+ / Django REST Framework
- HTML5, CSS3, JavaScript (ES6+)
- Fetch API
- [API Banco Central - Selic](https://api.bcb.gov.br/dados/serie/bcdata.sgs.1178/dados?formato=json)

---

## Como rodar localmente

### 1. Clone o repositório
```bash
# Clone este repositório
https://github.com/SEU_USUARIO/indicadores_api.git
cd indicadores_api
```

### 2. Instale as dependências do back-end
```bash
pip install -r requirements.txt
```

### 3. Realize as migrações e inicie o servidor Django
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```
A API estará disponível em: http://127.0.0.1:8000/api/indicadores/

### 4. Rode o front-end
Abra a pasta `frontend` e rode um servidor local (exemplo com Python):
```bash
cd frontend
python -m http.server 5500
```
Acesse: http://localhost:5500/index.html

> **Importante:**
> No arquivo `frontend/script.js`, altere a constante `API_URL` para a URL do seu back-end (local ou de produção).

---

## Deploy

- **Back-end:** [https://SEU-BACKEND.onrender.com/api/indicadores/](https://SEU-BACKEND.onrender.com/api/indicadores/)
- **Front-end:** [https://SEU-FRONTEND.netlify.app/](https://SEU-FRONTEND.netlify.app/)

> Lembre-se de atualizar a URL da API no front-end após o deploy!

---

## Exemplo de Consumo da API da Selic
```js
fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.1178/dados?formato=json&dataInicial=01/01/2020")
  .then(res => res.json())
  .then(dados => {
    const ultimo = dados[dados.length - 1];
    document.getElementById("selic").innerText =
      `Selic: ${ultimo.valor}% em ${ultimo.data}`;
  });
```

---

## Funcionalidades
- Exibição em tabela dos indicadores cadastrados
- Cadastro de novo indicador
- Edição e exclusão de indicadores
- Exibição do valor mais recente da Selic
- Layout responsivo e amigável

---

## Prints das telas
> (Adicione prints do sistema funcionando aqui)

---

## Vídeo explicativo
- [Link para o vídeo explicativo (YouTube ou Google Drive)](https://SEU-LINK-DO-VIDEO)

---

## Autor
Gustavo Ventura – ADS – 5ª Fase 