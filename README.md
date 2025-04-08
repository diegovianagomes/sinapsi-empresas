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
