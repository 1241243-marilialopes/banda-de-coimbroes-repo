# Banda de Coimbrões - Sociedade Musical 1º de Agosto

Plataforma Web institucional e sistema integrado de gestão associativa para a **Sociedade Musical 1º de Agosto (Banda de Coimbrões)**. O sistema inclui um portal público para divulgação da associação e da sua escola de música, bem como uma área reservada com controlo de acessos por perfil (Direção/Administração, Músicos e Sócios).

---

## 📌 Funcionalidades Principais

### 🌐 Portal Público
- **Apresentação Institucional:** Secções informativas sobre a história da banda ("Quem Somos"), Escola de Música, Órgãos Sociais ("Direção") e contactos.
- **Inscrição Online:** Formulário de candidatura de novos membros/alunos com envio automático de e-mail de confirmação.
- **Área Reservada (Login):** Autenticação segura com verificação de credenciais e redirecionamento de acordo com o perfil de utilizador.
- **Recuperação de Password:** Envio de links temporários por e-mail para reposição ou primeira definição de palavra-passe.

### 👥 Perfis e Áreas Reservadas
O sistema possui 4 níveis de privilégios (`cargo_id`):

1. **Administrador (`cargo = 0`):**
   - Gestão de Utilizadores e Sócios (inserção, edição, remoção e atribuição de cargos).
   - Controlo e registo do pagamento de quotas mensais e anuais.
   - Gestão de Serviços (ensaios, concertos, procissões e atuações) e controlo de presenças/pagamentos aos músicos.
   - Arquivo Digital de Partituras (carregamento e categorização por instrumento musical).
   - Gestão do inventário de instrumentos musicais.
   - Backoffice de personalização da página pública (edição de textos e imagens).

2. **Músico / Sócio (`cargo = 1`):**
   - Caderneta digital e consulta de dados pessoais.
   - Acesso e download de partituras do seu respetivo instrumento musical.
   - Marcação e consulta de presenças nos serviços/ensaios agendados.
   - Consulta do estado das suas quotas de sócio.
   - Calendário geral de eventos e atividades da banda.

3. **Administrador / Músico / Sócio (`cargo = 2`):**
   - Perfil híbrido que conjuga todos os privilégios administrativos com as funcionalidades de músico executante (acesso a partituras e presenças).

4. **Sócio (`cargo = 3`):**
   - Consulta de dados de associado.
   - Histórico e situação de pagamento de quotas.
   - Acesso ao calendário de eventos da associação.

---

## 🛠️ Tecnologias Utilizadas

- **Backend:** PHP (com extensões `mysqli` e `session`)
- **Base de Dados:** MySQL / MariaDB
- **Frontend:** HTML5, CSS3, JavaScript (ES6+), jQuery
- **Framework de Estilos & UI:** Bootstrap 5, SB Admin 2 (Start Bootstrap)
- **Componentes & Bibliotecas Adicionais:**
  - [PHPMailer](https://github.com/PHPMailer/PHPMailer) (envio transacional de e-mails via SMTP com suporte a imagens embutidas)
  - FullCalendar (gestão e visualização de calendários)
  - DataTables (tabelas interativas com pesquisa e paginação)
  - iziToast (notificações visuais)
  - FontAwesome (ícones da interface)

---

## 📁 Estrutura do Projeto

```text
banda-de-coimbroes-repo/
├── admin/                     # Módulos e páginas exclusivas de Administração
├── admin_musico_socio/        # Módulos para o perfil híbrido Admin + Músico
├── musicos_socios/            # Área reservada para Músicos/Sócios
├── socios/                    # Área reservada para Sócios
├── assets/                    # Imagens, logótipos e recursos estáticos do portal
├── css/                       # Folhas de estilo (personalizadas e de bibliotecas)
├── js/                        # Scripts JavaScript do cliente
├── vendor/                    # Dependências e assets de interface (Bootstrap, jQuery, FontAwesome, DataTables)
├── phpmailer/                 # Biblioteca PHPMailer
├── config.php                 # Configuração da ligação à base de dados MySQL e sessões
├── elogin.php                 # Processamento de autenticação e redirecionamento de perfis
├── index.php                  # Página principal (portal público da banda)
├── inscricao.php              # Processamento de inscrições de novos associados/alunos
├── esqueceu_password.php      # Formulário de pedido de recuperação de password
├── reset_password.php         # Definição de nova password via token
├── defenir_pass_uti.php       # Primeiro acesso e definição de password para novos utilizadores
└── README.md                  # Documentação do projeto
```

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- Um ambiente com servidor Apache e MySQL instalado (ex.: [XAMPP](https://www.apachefriends.org/), [WampServer](https://www.wampserver.com/) ou [MAMP](https://www.mamp.info/)).
- PHP versão 7.4 ou superior.
- Base de dados MySQL ativa.

### Passos de Instalação:
1. **Clonar ou copiar o projeto** para o diretório raiz do servidor web:
   - No XAMPP: `htdocs/banda-de-coimbroes`
   - No WampServer: `www/banda-de-coimbroes`
2. **Importar a Base de Dados:**
   - Criar uma base de dados no MySQL (ex.: `bd_pap`).
   - Importar o esquema e tabelas necessárias (`tb_utilizadores`, `tb_servicos`, `tb_presencas`, `tb_cota_mes`, `tb_partituras`, `tb_backoffice`, etc.).
3. **Configurar a Ligação (`config.php`):**
   - Verificar as credenciais do MySQL em `config.php`:
     ```php
     $bd_host = "localhost";
     $bd_user = "root";
     $bd_password = "";
     $bd_database = "bd_pap";
     ```
4. **Aceder no Navegador:**
   - Abrir o browser e aceder a: `http://localhost/banda-de-coimbroes/` (ou caminho correspondente no seu servidor local).

---

## 🔒 Boas Práticas e Segurança

- **Credenciais e Passwords:** Recomenda-se não partilhar palavras-passe de servidores de produção ou senhas de aplicação SMTP em repositórios públicos.
- **Sessões:** A plataforma utiliza sessões PHP com regeneração de identificador (`session_regenerate_id()`) e hashing de palavras-passe com `password_hash()` (algoritmo padrão BCRYPT).

---

## 📄 Licença e Créditos

Desenvolvido para a **Sociedade Musical 1º de Agosto (Banda de Coimbrões)**.  
Todos os direitos reservados à instituição.