# Teste de Login - People Flow

## 🔍 Como Testar o Sistema

### 1. Acesse o Frontend
```
http://localhost:4200
```

### 2. Faça Login
O sistema deve redirecionar automaticamente para a tela de login.

**Credenciais:**
- **Email:** admin@empresa.com
- **Senha:** 123456

### 3. Verifique os Logs
Abra o Console do navegador (F12) e procure por:
- `🔍 Login response:` - Resposta do backend
- `🔐 Setting auth token:` - Token sendo salvo
- `🔑 Interceptor token:` - Token sendo usado nas requisições

### 4. Teste as Funcionalidades
Após o login, você poderá acessar:
- **Colaboradores** - CRUD completo
- **Categorias** - Dados mock temporários
- **Lançamentos** - Dados mock temporários
- **Relatórios** - Dados mock temporários

## 🐛 Debug

Se o login não funcionar, verifique:

1. **Backend rodando:** http://localhost:8080
2. **Frontend rodando:** http://localhost:4200
3. **Console do navegador** para erros
4. **Network tab** para ver as requisições HTTP

## 📝 Logs Esperados

**Login bem-sucedido:**
```
�� Login response: {token: "...", usuarioId: 1, nome: "...", email: "...", role: "ADMIN"}
🔐 Setting auth token: eyJhbGciOiJIUzI1NiJ9...
🔑 Interceptor token: eyJhbGciOiJIUzI1NiJ9...
```

**Requisição autenticada:**
```
🔑 Interceptor token: eyJhbGciOiJIUzI1NiJ9...
```
