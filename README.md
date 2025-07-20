Backend + Frontend de Autenticação

📌 Descrição
Sistema completo de cadastro, login e acesso protegido via token JWT. Desenvolvido com Node.js + Express no backend e HTML + JS puro no frontend.
Permite:
- Registro de usuários com criptografia de senha
- Login com geração de token JWT
- Rota protegida que retorna os dados do perfil autenticado
- Interface moderna e estilizada para cadastro e login


🏗️ Arquitetura do Projeto
backend-autenticacao/
├── config/
│   └── database.js       # Conexão com Sequelize/PostgreSQL
├── models/
│   └── Usuario.js        # Modelo do usuário
├── src/
│   ├── server.js         # Arquivo principal do servidor
│   ├── userRoutes.js     # Definição de rotas
│   ├── userController.js # Lógica das rotas
├── frontend/
│   ├── cadastro.html     # Tela de cadastro
│   ├── login.html        # Tela de login



🧭 Rotas Criadas
| Método | Endpoint | Protegida | Descrição | 
| POST | /api/user | ❌ | Cadastra novo usuário | 
| POST | /api/login | ❌ | Autentica e retorna token JWT | 
| GET | /api/me | ✅ | Retorna dados do usuário logado | 
| GET | /api/ping | ❌ | Rota de teste (opcional) | 


A rota /api/me exige envio de token no header:

Authorization: Bearer seu_token_jwt


⚙️ Stack Tecnológica
- Backend
- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt para criptografia
- Frontend
- HTML5
- CSS3 (embutido nos arquivos)
- JavaScript puro (fetch, localStorage)


🛠️ Instruções de Instalação e Execução
Pré-requisitos:
- Node.js instalado
- PostgreSQL rodando localmente
- VS Code recomendado
- 
Instalação do backend:
git clone https://github.com/seu-usuario/backend-autenticacao.git
cd backend-autenticacao
npm install

Crie um arquivo .env com:

PORT=3000
DB_NAME=seu_banco
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_HOST=localhost
JWT_SECRET=sua_chave_secreta


Inicie o servidor:

node src/server.js




  



