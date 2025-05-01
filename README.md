# DizAí

**Plataforma inovadora para aplicação e gestão de questionários corporativos.**

O DizAí facilita a coleta de informações e transforma respostas em insights estratégicos. Gestores podem escolher entre questionários estruturados, personalizar suas aplicações e acompanhar resultados em tempo real.

## Funcionalidades

- Seleção e personalização de questionários
- Processo de aplicação com pagamento integrado
- Importação de listas de funcionários
- Distribuição automatizada de formulários
- Envio de lembretes automáticos via e-mail
- Visualização de dados em gráficos dinâmicos
- Relatórios detalhados para tomada de decisão

## Tecnologias Utilizadas

- **Frontend (Vanilla JS)**
  - HTML5, CSS3, JavaScript
- **Backend (Node.js)**
  - Express.js, PostgreSQL
- **Ferramentas de desenvolvimento**
  - npm, dotenv

## Estrutura do Projeto

```bash
dizai/
├── .gitignore
├── README.md
├── backend/
│   ├── .env_example
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── config/
│       ├── controllers/
│       ├── models/
│       ├── repositories/
│       ├── routes/
│       └── services/
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── main.js
        ├── router.js
        ├── assets/
        │   ├── css/
        │   └── img/
        └── pages/
```

## Começando

### Pré-requisitos

- Node.js v14 ou superior
- npm v6 ou superior
- PostgreSQL

### Configuração

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/dizai.git
   ```
2. Backend:
   ```bash
   cd dizai/backend
   cp .env_example .env
   # Edite .env com suas credenciais e configurações
   npm install
   ```

1) Inicie o servidor backend:
   ```bash
   cd dizai/backend
   npm start
   ```

