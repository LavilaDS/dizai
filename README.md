# DizAí

**Plataforma inovadora para aplicação e gestão de questionários corporativos.**

O DizAí facilita a coleta de informações e transforma respostas em insights estratégicos. Gestores podem escolher entre questionários estruturados, personalizar suas aplicações e acompanhar resultados em tempo real.

## Funcionalidades

* Seleção e personalização de questionários
* Processo de aplicação com pagamento integrado
* Importação de listas de funcionários
* Distribuição automatizada de formulários
* Envio de lembretes automáticos via e-mail
* Visualização de dados em gráficos dinâmicos
* Relatórios detalhados para tomada de decisão

## Tecnologias Utilizadas

* **Frontend (Vanilla JS)**
  HTML5, CSS3, JavaScript
* **Backend (Node.js)**
  Express.js, PostgreSQL
* **Ferramentas de desenvolvimento**
  npm, dotenv

## Estrutura do Projeto

```bash
dizai/
├── .gitignore
├── README.md
├── database/
│   └── schema.sql
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

* Node.js v14 ou superior
* npm v6 ou superior
* PostgreSQL

### Configuração

1. **Clonar projeto na pasta pessoal e copiar arquivos para o diretório público**

   * **Clonar o repositório na sua home:**

     ```bash
     cd ~
     git clone https://github.com/seu-usuario/dizai.git
     ```
   * **Criar diretório público do Nginx e copiar arquivos estáticos:**

     ```bash
     sudo mkdir -p /var/www/dizai/frontend
     sudo cp -r ~/dizai/frontend/public/* /var/www/dizai/frontend/
     ```

2. **Instalar PostgreSQL**

   * **Ubuntu/Debian:**

     ```bash
     sudo apt update
     sudo apt install -y postgresql postgresql-contrib
     ```
   * **CentOS/RHEL:**

     ```bash
     sudo yum install -y postgresql-server postgresql-contrib
     sudo postgresql-setup initdb
     ```
   * Após a instalação, verifique o status do serviço:

     ```bash
     sudo systemctl status postgresql
     ```

3. **Instalar e configurar o Nginx**

   * **Instalar:**

     ```bash
     # Ubuntu/Debian
     sudo apt install -y nginx

     # CentOS/RHEL
     sudo yum install -y nginx
     ```

   * **Editar o bloco de servidor**:

     ```bash
     # Abrir o arquivo de configuração
     sudo nano /etc/nginx/sites-available/dizai
     ```

     Edite o conteúdo para:

     ```nginx
     server {
         listen 80;
         server_name localhost;

         # Proxy para rotas da API
         location /api/ {
             proxy_pass http://127.0.0.1:3000;
             proxy_http_version 1.1;
             proxy_set_header Upgrade $http_upgrade;
             proxy_set_header Connection 'upgrade';
             proxy_set_header Host $host;
             proxy_cache_bypass $http_upgrade;
         }

         # Servir arquivos estáticos do frontend
         location / {
            root /var/www/dizai/frontend;
            try_files $uri $uri/ /index.html;
         }
     }
     ```

     Salve (`Ctrl+O`), saia (`Ctrl+X`).

  * **Ajustar permissões para que o Nginx possa acessar os arquivos**
    ```bash
    # Alterar o dono dos arquivos para o usuário/grupo do Nginx (geralmente 'www-data')
    sudo chown -R www-data:www-data /var/www/dizai/frontend

    # Definir permissões para garantir que o Nginx tenha acesso
    sudo chmod -R 755 /var/www/dizai/frontend
    ```

   * **Habilitar e reiniciar o Nginx:**

     ```bash
     # Testar configuração
     sudo nginx -t

     # Reiniciar serviço    
     sudo systemctl restart nginx
     ```


4. **Configurar PostgreSQL antes de executar o schema** 

   * **Editar com editor de texto**:

     ```bash
     sudo nano /etc/postgresql/<versão>/main/pg_hba.conf
     ```

     Em seguida, adicione as linhas abaixo ao final do arquivo:

     ```conf
     # Permitir autenticação MD5
     host    all             all             127.0.0.1/32            md5
     host    all             all             ::1/128                 md5
     ```

     Salve (`Ctrl+O`), saia (`Ctrl+X`).

   * **Reiniciar o PostgreSQL:**

     ```bash
     sudo systemctl restart postgresql
     ```

5. **Criar o schema no banco de dados**

  * Abra seu terminal e execute:
    ```bash
    sudo -u postgres psql
    ```
    Você será conectado ao prompt interativo do PostgreSQL (psql), que deve se parecer com algo como postgres=#.

  * Execute o comando:
    ```psql
    CREATE USER seu_novo_usuario WITH PASSWORD 'senha_forte_aqui' CREATEDB;
    ```
    * Substitua `seu_novo_usuario` por um nome de usuário adequado e `senha_forte_aqui` por uma senha segura.

  * Saia do psql com `\q`
    ```bash
    \q
    ```

  * Agora execute o comando:

    ```bash
    createdb -U seu_novo_usuario nome_do_seu_banco
    ```


  * Execute o script SQL **após** as configurações acima:

    ```bash
    psql -U seu_usuario -d nome_do_seu_banco -f database/schema.sql
    ```

    * Substitua `seu_usuario` pelo seu usuário PostgreSQL local.
    * Substitua `nome_do_seu_banco` pelo seu banco de dados PostgreSQL local.

6. **Iniciar o servidor backend**

   ```bash
   npm start
   ```
