# Credenciais de Teste - People Flow

## Usuários Disponíveis para Login

### 1. Administrador
- **Email:** admin@empresa.com
- **Senha:** 123456
- **Perfil:** ADMIN (acesso total ao sistema)

### 2. Recursos Humanos
- **Email:** rh@empresa.com
- **Senha:** 123456
- **Perfil:** RH (acesso a gestão de colaboradores)

### 3. Colaborador 1
- **Email:** joao.silva@empresa.com
- **Senha:** 123456
- **Perfil:** COLABORADOR (acesso limitado)

### 4. Colaborador 2
- **Email:** maria.santos@empresa.com
- **Senha:** 123456
- **Perfil:** COLABORADOR (acesso limitado)

## Como Usar

1. Inicie o backend Spring Boot (porta 8080)
2. Inicie o frontend Angular (porta 4200)
3. Acesse http://localhost:4200
4. Use qualquer uma das credenciais acima para fazer login

## Observações

- Todas as senhas são: **123456**
- Os dados são inseridos automaticamente no banco H2 quando o backend inicia
- O sistema usa autenticação JWT real (não mais em memória)
- As permissões são baseadas nos roles definidos no backend 