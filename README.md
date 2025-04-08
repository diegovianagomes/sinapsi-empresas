# Estudo Vivências e Saúde Mental do Estudante de Arquitetura

Um sistema web moderno para conduzir pesquisa sobre arquitetura, desenvolvido com Next.js, TypeScript e Supabase. O projeto permite coletar respostas de forma segura e apresentar análises detalhadas dos resultados.

## 🚀 Tecnologias

- [Next.js 14](https://nextjs.org/) - Framework React com renderização híbrida
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática para JavaScript
- [Supabase](https://supabase.com/) - Backend as a Service para autenticação e banco de dados
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário
- [Shadcn/ui](https://ui.shadcn.com/) - Componentes React reutilizáveis

## 📋 Funcionalidades

- **Autenticação por Email**: Sistema seguro de verificação de email único por resposta
- **Formulário de Pesquisa**: Interface intuitiva para coleta de respostas
- **Painel Administrativo**: Visualização e exportação dos resultados
- **Análise de Dados**: Gráficos e estatísticas das respostas
- **Proteção contra Duplicatas**: Criptografia de emails para privacidade

## 🚀 Arquitetura
```
flowchart TD
    %% Frontend - Pages
    subgraph "Frontend - Pages"
        FE_Home["Home Page (Next.js)"]:::frontend
        FE_Survey["Survey Page (Next.js)"]:::frontend
        FE_Research["Researcher Login (Next.js)"]:::frontend
        FE_Admin["Admin Page (Next.js)"]:::frontend
    end

    %% Frontend - UI Components
    subgraph "Frontend - UI Components"
        UI_EmailCheck["Email Check Form (React)"]:::frontend
        UI_Button["Button Component (shadcn/ui)"]:::frontend
        UI_Advanced["Advanced Analysis Component (Charts)"]:::frontend
    end

    %% Frontend - Styling
    subgraph "Frontend - Styling"
        GS_Global["Global CSS (Tailwind)"]:::frontend
        GS_Tailwind["Tailwind Config (Tailwind)"]:::frontend
    end

    %% API Layer
    subgraph "API Layer"
        API_Check["Check Email API (REST)"]:::api
        API_Register["Register Email API (REST)"]:::api
        API_Submit["Submit Survey API (REST)"]:::api
    end

    %% Backend / Data Services
    subgraph "Backend / Data Services"
        SUPA["Supabase Core (Auth & DB)"]:::backend
        SUP_Admin["Supabase Admin"]:::backend
        SUP_Client["Supabase Client"]:::backend
        UT_EmailCrypto["Email Encryption Utility"]:::utility
    end

    %% Administration & Analytics
    subgraph "Administration & Analytics"
        AD_Panel["Admin Dashboard"]:::admin
        CH_Charts["Data Analysis & Charts"]:::admin
    end

    %% Connections: Frontend Pages and API
    FE_Survey -->|"submit"| API_Submit
    UI_EmailCheck -->|"check"| API_Check
    UI_EmailCheck -->|"register"| API_Register

    %% Connections: API Layer to Backend / Utilities
    API_Submit -->|"storeData"| SUPA
    API_Check -->|"validateEmail"| UT_EmailCrypto
    API_Register -->|"encryptEmail"| UT_EmailCrypto
    API_Check -->|"dbQuery"| SUPA
    API_Register -->|"dbUpdate"| SUPA

    %% Connections: Supabase internal flows
    SUPA -->|"adminOps"| SUP_Admin
    SUPA -->|"clientOps"| SUP_Client

    %% Connections: Backend to Administration & Analytics
    SUPA -->|"provideData"| AD_Panel
    SUPA -->|"analyticsData"| CH_Charts
    UI_Advanced -->|"renderCharts"| CH_Charts

    %% Connections: Frontend Styling applied to Pages
    GS_Global --- FE_Home
    GS_Global --- FE_Survey
    GS_Global --- FE_Research
    GS_Global --- FE_Admin
    GS_Tailwind --- GS_Global

    %% Navigation connection from Researcher Login to Admin Page
    FE_Research -->|"access"| FE_Admin

    %% Optional connection: UI Components used within Pages
    FE_Survey --- UI_EmailCheck
    FE_Survey --- UI_Button

    %% Click Events for Frontend Pages
    click FE_Home "https://github.com/diegovianagomes/architecture-survey/blob/master/app/page.tsx"
    click FE_Survey "https://github.com/diegovianagomes/architecture-survey/blob/master/app/survey/page.tsx"
    click FE_Research "https://github.com/diegovianagomes/architecture-survey/blob/master/app/researcher-login/page.tsx"
    click FE_Admin "https://github.com/diegovianagomes/architecture-survey/blob/master/app/admin/page.tsx"

    %% Click Events for UI Components
    click UI_EmailCheck "https://github.com/diegovianagomes/architecture-survey/blob/master/components/email-check-form.tsx"
    click UI_Button "https://github.com/diegovianagomes/architecture-survey/blob/master/components/ui/button.tsx"
    click UI_Advanced "https://github.com/diegovianagomes/architecture-survey/blob/master/components/advanced-analysis.tsx"

    %% Click Events for Global Styling
    click GS_Global "https://github.com/diegovianagomes/architecture-survey/blob/master/app/globals.css"
    click GS_Tailwind "https://github.com/diegovianagomes/architecture-survey/blob/master/tailwind.config.ts"

    %% Click Events for API Endpoints
    click API_Check "https://github.com/diegovianagomes/architecture-survey/blob/master/app/api/check-email/route.ts"
    click API_Register "https://github.com/diegovianagomes/architecture-survey/blob/master/app/api/register-email/route.ts"
    click API_Submit "https://github.com/diegovianagomes/architecture-survey/blob/master/app/api/submit-survey/route.ts"

    %% Click Events for Supabase Integration
    click SUPA "https://github.com/diegovianagomes/architecture-survey/tree/master/lib/supabase"
    click SUP_Admin "https://github.com/diegovianagomes/architecture-survey/blob/master/lib/supabase-admin.ts"
    click SUP_Client "https://github.com/diegovianagomes/architecture-survey/blob/master/lib/supabase-client.ts"

    %% Click Event for Utility Function
    click UT_EmailCrypto "https://github.com/diegovianagomes/architecture-survey/blob/master/lib/utils/email-crypto.ts"

    %% Styling Classes
    classDef frontend fill:#ACE1AF,stroke:#333,stroke-width:2px;
    classDef api fill:#FFDAB9,stroke:#333,stroke-width:2px;
    classDef backend fill:#ADD8E6,stroke:#333,stroke-width:2px;
    classDef utility fill:#F4A460,stroke:#333,stroke-width:2px;
    classDef admin fill:#DDA0DD,stroke:#333,stroke-width:2px;
```

## 🛠️ Instalação

1. Clone o repositório
```bash
git clone [url-do-repositorio]
cd architecture-survey
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` com as seguintes variáveis:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
/app                    # Rotas e páginas Next.js
  /api                  # Endpoints da API
  /admin               # Painel administrativo
  /survey              # Formulário da pesquisa
/components            # Componentes React reutilizáveis
/lib                   # Utilitários e configurações
  /supabase           # Configuração do Supabase
  /utils              # Funções auxiliares
```

## 🔒 Segurança

- Emails são criptografados antes do armazenamento
- Verificação de unicidade sem expor dados sensíveis
- Autenticação necessária para acesso administrativo

## 📊 Análise de Dados

O sistema oferece visualizações detalhadas dos resultados através de:
- Gráficos de distribuição
- Estatísticas por período
- Exportação de dados em formato CSV

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- Diego Viana
- Paula Louzada

## 📞 Suporte

Para suporte, envie um email para [diegovianagomes@gmail.com] ou abra uma issue no repositório.
