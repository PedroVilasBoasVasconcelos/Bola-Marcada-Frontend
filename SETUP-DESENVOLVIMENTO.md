# 🚀 Setup de Desenvolvimento - Bola Marcada

## ✅ Problemas Resolvidos no Frontend

### 1. **Perfil agora popula automaticamente**
- ✅ Dados salvos no `localStorage` após login/cadastro
- ✅ Funciona offline
- ✅ Campos sempre preenchidos (nome, email, telefone)

### 2. **Minhas Instalações aparece corretamente**
- ✅ Busca do backend primeiro
- ✅ Fallback para `localStorage.localFields`
- ✅ Logs claros no console para debug

### 3. **Melhor tratamento de erros**
- ✅ Logs com emojis (✅ ❌ ⚠️ 📦) para fácil identificação
- ✅ Fallback automático para modo offline
- ✅ Mensagens descritivas

---

## 🐳 Opções de Setup (Escolha 1)

### **OPÇÃO 1: Docker Compose (RECOMENDADA)** ⭐

**Vantagens:**
- Um comando roda tudo
- Configuração centralizada
- Fácil para todo o time
- Simula produção

**Como fazer:**

1. Crie `docker-compose.yml` na raiz do workspace:

```yaml
version: '3.8'

services:
  backend:
    build: ./BACKEND-BolaMarcada
    container_name: bolamarcada-backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/bolamarcada
      - JWT_SECRET=seu-secret-aqui
    volumes:
      - ./BACKEND-BolaMarcada:/app
    depends_on:
      - db
    networks:
      - bolamarcada-network

  frontend:
    build: ./FRONTEND-BolaMarcada
    container_name: bolamarcada-frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000/api/v1
    volumes:
      - ./FRONTEND-BolaMarcada:/app
      - /app/node_modules
    depends_on:
      - backend
    networks:
      - bolamarcada-network

  db:
    image: postgres:15-alpine
    container_name: bolamarcada-db
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=bolamarcada
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - bolamarcada-network

networks:
  bolamarcada-network:
    driver: bridge

volumes:
  postgres_data:
```

2. Criar `Dockerfile` no frontend (se não tiver):

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

3. Rodar tudo:

```bash
docker-compose up
```

4. Acessar:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Banco: localhost:5432

---

### **OPÇÃO 2: VSCode Workspace Multi-Folder**

**Vantagens:**
- Um VSCode com as duas pastas
- Terminal split
- Git integrado

**Como fazer:**

1. Criar arquivo `bolamarcada.code-workspace`:

```json
{
  "folders": [
    {
      "path": "./FRONTEND-BolaMarcada",
      "name": "Frontend"
    },
    {
      "path": "./BACKEND-BolaMarcada",
      "name": "Backend"
    }
  ],
  "settings": {
    "terminal.integrated.splitCwd": "workspaceFolder"
  }
}
```

2. Abrir workspace: `File > Open Workspace from File`

3. Split terminal (Ctrl+Shift+5):
   - Terminal 1 (Backend): `cd BACKEND-BolaMarcada && docker-compose up`
   - Terminal 2 (Frontend): `cd FRONTEND-BolaMarcada && npm run dev`

---

### **OPÇÃO 3: Scripts NPM com Concurrently**

**Vantagens:**
- Um comando
- Logs coloridos
- Mata tudo junto (Ctrl+C)

**Como fazer:**

1. Instalar concurrently:

```bash
npm install -D concurrently
```

2. Adicionar em `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "backend": "cd ../BACKEND-BolaMarcada && docker-compose up",
    "dev:all": "concurrently -n \"BACK,FRONT\" -c \"blue,green\" \"npm run backend\" \"npm run dev\"",
    "dev:logs": "concurrently --kill-others \"npm run backend\" \"npm run dev\""
  }
}
```

3. Rodar:

```bash
npm run dev:all
```

---

## 🔧 Corrigir Conexão com Backend

### Problema: "Backend não disponível, usando dados locais"

**Causas comuns:**

1. **CORS não configurado no backend**
2. **URL incorreta**
3. **Backend não está rodando**

### Solução:

**1. Verificar se backend está rodando:**

```bash
curl http://localhost:8000/api/v1/health
# ou
http://localhost:8000/docs  # Swagger
```

**2. Configurar CORS no backend (FastAPI):**

```python
# main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**3. Verificar URL no frontend:**

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

**4. Testar conexão:**

```bash
# No frontend
npm run dev

# Abrir console (F12) e procurar por:
✅ # Sucesso
❌ # Erro
⚠️ # Warning
📦 # Usando localStorage
```

---

## 📊 Debug de Problemas

### Console Logs

Agora os logs estão organizados com emojis:

- ✅ `Sucesso` - Operação bem-sucedida
- ❌ `Erro` - Falha crítica
- ⚠️ `Warning` - Aviso (usando fallback)
- 📦 `LocalStorage` - Usando dados locais

### Verificar o que está acontecendo:

1. **Abrir console (F12)**
2. **Procurar por:**
   - `✅ Dados do usuário carregados:` - Perfil carregou
   - `📦 Usando campos locais:` - Está offline
   - `❌ Erro ao carregar usuário:` - Problema na API

### localStorage Debug:

```javascript
// No console do navegador:
localStorage.getItem('token')        // Token JWT
localStorage.getItem('userData')     // Dados do usuário
localStorage.getItem('localFields')  // Campos cadastrados offline
```

---

## 🎯 Próximos Passos (Recomendado)

1. ✅ **Teste o frontend offline** (já funciona)
2. ✅ **Configure Docker Compose** (Opção 1)
3. ✅ **Configure CORS no backend**
4. ✅ **Teste integração completa**
5. ⏳ **Migre dados locais para backend** (quando estiver funcionando)

---

## 💡 Dicas

- Use o **Docker Compose** para desenvolvimento
- Mantenha dados no **localStorage como fallback**
- Sempre teste offline antes de integrar
- Use **variáveis de ambiente** (.env.local)
- Commite o `docker-compose.yml` no Git

---

## 📞 Troubleshooting

### Problema: "Minhas instalações" não aparece

**Solução:**
1. Abra console (F12)
2. Verifique: `localStorage.getItem('localFields')`
3. Se vazio: Cadastre um campo
4. Veja os logs: `📦 Usando campos locais:`

### Problema: Perfil não preenche

**Solução:**
1. Abra console (F12)
2. Verifique: `localStorage.getItem('userData')`
3. Faça logout e login novamente
4. Veja os logs: `✅ Dados do usuário carregados:`

### Problema: Backend não conecta

**Solução:**
1. Verifique se está rodando: `http://localhost:8000/docs`
2. Configure CORS (veja acima)
3. Verifique `.env.local`
4. Veja logs do Docker: `docker-compose logs backend`

---

**Criado por:** Copilot  
**Data:** 20/11/2025  
**Projeto:** Bola Marcada - Feature Frontend Felipe
