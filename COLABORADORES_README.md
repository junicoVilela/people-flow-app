# Sistema de Colaboradores - People Flow

Este documento descreve como usar o sistema de gerenciamento de colaboradores implementado no projeto Angular.

## Funcionalidades Implementadas

### 1. Listagem de Colaboradores
- Visualização de todos os colaboradores em uma tabela
- Informações exibidas: Nome, Email, CPF, Cargo, Departamento e Status
- Formatação de CPF com máscara (000.000.000-00)
- Indicadores visuais de status (ATIVO/INATIVO)

### 2. Cadastro de Colaboradores
- Formulário completo com validações
- Campos obrigatórios: Nome, Email, Senha, CPF, Data de Nascimento, Cargo, Departamento, Salário, Data de Admissão
- Campos opcionais: RG, Sexo, Telefone, Estado Civil, Endereço
- Validações de formato para CPF, Email, Telefone

### 3. Edição de Colaboradores
- Formulário pré-preenchido com dados do colaborador
- Senha não é exibida na edição (segurança)
- Validações mantidas

### 4. Inativação de Colaboradores
- Botão específico para inativar colaboradores ativos
- Data de demissão automática (data atual)
- Colaborador inativado não pode ser editado

### 5. Exclusão de Colaboradores
- Modal de confirmação antes da exclusão
- Exclusão permanente do registro

## Estrutura de Arquivos

```
src/app/pages/colaboradores/
├── colaboradores-routes.ts          # Rotas do módulo
├── shared/
│   ├── colaborador.model.ts         # Modelo de dados
│   └── colaborador.service.ts       # Serviço de API
├── colaborador-list/
│   ├── colaborador-list.component.ts
│   ├── colaborador-list.component.html
│   └── colaborador-list.component.scss
└── colaborador-form/
    ├── colaborador-form.component.ts
    ├── colaborador-form.component.html
    └── colaborador-form.component.scss
```

## Endpoints da API

O sistema utiliza os seguintes endpoints do backend Spring Boot:

- `GET /api/colaboradores` - Listar colaboradores
- `GET /api/colaboradores/{id}` - Buscar colaborador por ID
- `POST /api/colaboradores` - Criar novo colaborador
- `PUT /api/colaboradores/{id}` - Atualizar colaborador
- `PATCH /api/colaboradores/{id}/inativar` - Inativar colaborador

## Configuração

### 1. Backend (Spring Boot)
Certifique-se de que o backend está rodando na porta 8080:
```bash
cd people-flow
./mvnw spring-boot:run
```

### 2. Frontend (Angular)
Para desenvolvimento com dados mock:
```bash
cd people-flow-app
npm start
```

Para desenvolvimento com API real:
```bash
cd people-flow-app
npm run start:proxy
```

### 3. Configuração de Ambiente
- **Desenvolvimento com Mock**: `enableMockData: true` em `environment.ts`
- **Desenvolvimento com API Real**: `enableMockData: false` em `environment.ts`

## Navegação

1. Acesse o sistema e faça login
2. No menu lateral, clique em "Colaboradores"
3. Use os botões de ação na tabela:
   - **Editar** (ícone de lápis)
   - **Inativar** (ícone de usuário com X) - apenas para colaboradores ativos
   - **Excluir** (ícone de lixeira)

## Validações Implementadas

### Campos Obrigatórios
- Nome (2-100 caracteres)
- Email (formato válido, máximo 150 caracteres)
- Senha (6-20 caracteres) - apenas no cadastro
- CPF (exatamente 11 dígitos)
- Data de Nascimento (data no passado)
- Cargo (máximo 100 caracteres)
- Departamento (máximo 100 caracteres)
- Salário (maior que zero)
- Data de Admissão

### Campos Opcionais
- RG (máximo 20 caracteres)
- Sexo (M ou F)
- Telefone (10 ou 11 dígitos)
- Estado Civil (máximo 50 caracteres)
- Endereço (máximo 200 caracteres)

## Dados Mock

O sistema inclui 5 colaboradores de exemplo para teste:
1. João Silva Santos - Desenvolvedor Full Stack (ATIVO)
2. Maria Oliveira Costa - Analista de RH (ATIVO)
3. Carlos Eduardo Ferreira - Designer UX/UI (ATIVO)
4. Ana Paula Rodrigues - Gerente de Marketing (INATIVO)
5. Roberto Almeida Lima - Analista Financeiro (ATIVO)

## Próximos Passos

Para melhorar o sistema, considere implementar:

1. **Filtros e Busca**: Adicionar filtros por departamento, status, etc.
2. **Paginação**: Implementar paginação para grandes volumes de dados
3. **Exportação**: Funcionalidade para exportar dados em PDF/Excel
4. **Upload de Foto**: Permitir upload de foto do colaborador
5. **Histórico**: Manter histórico de alterações
6. **Relatórios**: Relatórios de colaboradores por departamento, salário, etc.

## Troubleshooting

### Problemas Comuns

1. **Erro de CORS**: Certifique-se de que o backend está configurado para aceitar requisições do frontend
2. **API não encontrada**: Verifique se o backend está rodando na porta 8080
3. **Dados não carregam**: Verifique se `enableMockData` está configurado corretamente
4. **Validações não funcionam**: Verifique se o ngx-mask está instalado e configurado

### Logs
Ative os logs no console do navegador para debug:
```typescript
// Em environment.ts
enableLogs: true
``` 