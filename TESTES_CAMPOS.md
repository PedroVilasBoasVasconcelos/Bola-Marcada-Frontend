# 🧪 Testes Automatizados - Campos

Este documento explica como rodar os testes automatizados para o fluxo de cadastro e listagem de campos.

## 📋 Pré-requisitos

- Projeto rodando em `http://localhost:3001`
- Backend rodando (se estiver integrado)
- Playwright instalado

## 🚀 Como rodar os testes

### 1. Rodar todos os testes de campos

```bash
npx playwright test app/tests/fields.spec.ts
```

### 2. Rodar os testes em modo interativo (com UI)

```bash
npx playwright test app/tests/fields.spec.ts --ui
```

### 3. Rodar um teste específico

```bash
npx playwright test app/tests/fields.spec.ts -g "Deve cadastrar um novo campo"
```

### 4. Ver o relatório dos testes

```bash
npx playwright show-report
```

## 🧪 Testes implementados

### 1. **Cadastro de Campo**
- ✅ Preenche todos os campos obrigatórios
- ✅ Seleciona tipo de esporte
- ✅ Define horários e valores
- ✅ Verifica redirecionamento após cadastro

### 2. **Listagem de Campos**
- ✅ Exibe campos cadastrados
- ✅ Mostra cards com informações corretas

### 3. **Filtro por Cidade**
- ✅ Filtra campos pela cidade selecionada
- ✅ Exibe apenas campos da cidade filtrada

### 4. **Filtro por Tipo de Esporte**
- ✅ Filtra por tipo de esporte
- ✅ Agrupa campos por categoria

### 5. **Busca por Nome**
- ✅ Busca campo pelo nome
- ✅ Filtra resultados em tempo real

### 6. **Fluxo Completo (E2E)**
- ✅ Cadastra um campo
- ✅ Redireciona para listagem
- ✅ Busca o campo cadastrado
- ✅ Verifica se aparece na listagem

## 📝 Notas importantes

- Os testes precisam que você esteja logado. Certifique-se de ter uma conta com:
  - Email: `teste@email.com`
  - Senha: `senha123`

- Se o backend não estiver rodando, os testes ainda funcionarão com dados mockados

- Para criar a conta de teste, acesse `/rotas/login` e cadastre-se primeiro

## 🐛 Troubleshooting

### Teste falha no login
- Verifique se o backend está rodando
- Crie a conta de teste manualmente

### Teste falha ao cadastrar campo
- Verifique se o token está sendo salvo no localStorage
- Confira se a rota `/api/v1/fields` está funcionando

### Página não carrega
- Confirme que o projeto está rodando em `http://localhost:3001`
- Execute `yarn dev` para iniciar o servidor
