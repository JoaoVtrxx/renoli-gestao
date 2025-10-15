# Roadmap de Desenvolvimento - Renoli Gestão

Este documento descreve o status atual do projeto e os próximos passos para a finalização, com foco no polimento da interface de usuário (UI).

## Resumo do Status Atual (Até 15/10/2025)

O projeto está com **toda a sua funcionalidade de backend concluída** e uma estrutura de frontend funcional, porém básica.

- **[x] Backend Completo:** Todas as APIs (tRPC) para o CRUD de Veículos, Clientes, Profissões e Estados Civis estão 100% funcionais. As APIs para Relatórios e Dashboard também estão prontas.
- **[x] Autenticação e Banco de Dados:** Todo o sistema de login (NextAuth), banco de dados (Prisma + Neon) e armazenamento de arquivos (Supabase) está configurado e operacional.
- **[x] Estrutura de UI Global:** O layout principal da aplicação, com a `Sidebar` de navegação e o `Header` superior, foi implementado e é aplicado a todas as páginas internas.
- **[x] Design System Básico:** As cores e fontes principais do design foram configuradas no `globals.css` do Tailwind CSS.

O foco agora é puramente no **Frontend**, para fazer com que as telas funcionais que temos hoje correspondam ao design de alta fidelidade do Stitch AI.

## Próximos Passos (Roadmap de Polimento da UI)

A estratégia é criar componentes de UI reutilizáveis e depois usá-los para refatorar as páginas existentes.

### **1. Criar Componentes de UI Reutilizáveis**

O próximo passo é criar uma "biblioteca" de componentes básicos e estilizados em `src/components/ui/`.

- **[ ] `Card.tsx`**: Um componente de card com `padding`, `border-radius` e `shadow` padronizados para ser usado nos KPIs do Dashboard e outras seções.
- **[ ] `Button.tsx`**: Um componente de botão com variações de estilo (ex: `variant='primary'` e `variant='secondary'`) para os botões "Adicionar Veículo" e "Adicionar Cliente".
- **[ ] `Input.tsx`**: Um componente de input estilizado que pode ser usado em todos os nossos formulários.
- **[ ] `Table.tsx`**: Componentes básicos para Tabela (`Table`, `Thead`, `Tbody`, `Tr`, `Th`, `Td`) com o estilo padrão do design.

### **2. Refatorar a Página do Dashboard**

Com os componentes `Card` e `Button` prontos, a primeira página a ser refatorada é o Dashboard.

- **[ ]** Atualizar `src/app/(app)/page.tsx` para usar os novos componentes, ajustando o layout dos KPIs e das "Ações Rápidas" para corresponder exatamente ao design do Stitch AI.

### **3. Refatorar as Páginas de Listagem e Formulários**

Após o Dashboard, aplicar os novos componentes reutilizáveis (`Table`, `Input`, `Button`, etc.) às seguintes páginas:

- **[ ]** Listagem de Veículos (`/veiculos`)
- **[ ]** Formulário de Veículo (`VeiculoForm.tsx`)
- **[ ]** Listagem de Clientes (`/clientes`)
- **[ ]** Formulário de Cliente (`ClienteForm.tsx`)
- **[ ]** Páginas de Gerenciamento (`/configuracoes/...`)

### **4. (Opcional) Polimento Final**

- **[ ]** Revisar e estilizar os estados de `loading` e "vazio" para que correspondam ao novo design.
- **[ ]** Garantir que a responsividade de todas as telas esteja funcionando bem com o novo layout.
