import { test, expect } from "@playwright/test";

test.describe("Cadastro e Listagem de Campos", () => {
  test.beforeEach(async ({ page }) => {
    // Fazer login antes dos testes
    await page.goto("http://localhost:3001/rotas/login");
    
    // Preencher formulário de login
    await page.fill('input[name="email"]', "teste@email.com");
    await page.fill('input[name="password"]', "senha123");
    
    // Clicar no botão de entrar
    await page.click('button:has-text("ENTRAR")');
    
    // Aguardar redirecionamento
    await page.waitForURL(/profile|campos/);
  });

  test("Deve cadastrar um novo campo", async ({ page }) => {
    // Navegar para a página de cadastro
    await page.goto("http://localhost:3001/rotas/cadastrar-campo");

    // Preencher o formulário
    await page.fill('input[name="name"]', "Campo de Teste Automatizado");
    await page.fill('input[name="address"]', "Rua dos Testes, 123");
    await page.fill('input[name="city"]', "São Paulo");
    
    // Selecionar tipo de esporte
    await page.selectOption('select[name="sportType"]', "futebol");
    
    // Preencher descrição
    await page.fill(
      'textarea[name="description"]',
      "Campo criado automaticamente pelos testes E2E"
    );

    // Preencher horários (primeiro horário)
    const firstTimeInput = page.locator('input[type="time"]').first();
    await firstTimeInput.fill("08:00");
    
    const secondTimeInput = page.locator('input[type="time"]').nth(1);
    await secondTimeInput.fill("22:00");
    
    // Preencher preço
    const priceInput = page.locator('input[type="number"]').first();
    await priceInput.fill("50");

    // Submeter o formulário
    await page.click('button:has-text("Cadastrar Campo")');

    // Verificar mensagem de sucesso ou redirecionamento
    await expect(page).toHaveURL(/campos/, { timeout: 10000 });
  });

  test("Deve listar campos cadastrados", async ({ page }) => {
    // Navegar para a listagem
    await page.goto("http://localhost:3001/rotas/campos");

    // Verificar se o título está presente
    await expect(page.locator("h1")).toContainText("Campos");

    // Verificar se há cards de campos (mockados ou reais)
    const fieldCards = page.locator('[class*="group cursor-pointer"]');
    
    // Deve ter pelo menos um campo (mockado)
    const count = await fieldCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("Deve filtrar campos por cidade", async ({ page }) => {
    await page.goto("http://localhost:3001/rotas/campos");

    // Selecionar cidade no filtro
    await page.selectOption('select:has-text("Digite sua cidade")', {
      label: "São Paulo",
    });

    // Aguardar filtragem
    await page.waitForTimeout(500);

    // Verificar se apenas campos de São Paulo são exibidos
    const cityTexts = await page.locator('[class*="text-sm text-gray-600"]').allTextContents();
    
    // Todos devem ser de São Paulo
    for (const text of cityTexts) {
      expect(text).toContain("São Paulo");
    }
  });

  test("Deve filtrar campos por tipo de esporte", async ({ page }) => {
    await page.goto("http://localhost:3001/rotas/campos");

    // Selecionar tipo de esporte
    await page.selectOption('select:has-text("selecione o tipo")', "futebol");

    // Aguardar filtragem
    await page.waitForTimeout(500);

    // Verificar se a categoria Society aparece
    await expect(page.locator("h2")).toContainText("Society");
  });

  test("Deve buscar campo por nome", async ({ page }) => {
    await page.goto("http://localhost:3001/rotas/campos");

    // Digitar no campo de busca
    await page.fill('input[placeholder="Digite o nome do lugar"]', "Society Field A");

    // Aguardar filtragem
    await page.waitForTimeout(500);

    // Verificar se apenas o campo buscado aparece
    const fieldNames = await page.locator("h3").allTextContents();
    
    expect(fieldNames.some(name => name.includes("Society Field A"))).toBeTruthy();
  });

  test("Fluxo completo: Cadastrar e verificar na listagem", async ({ page }) => {
    const uniqueName = `Campo E2E ${Date.now()}`;

    // 1. Cadastrar campo
    await page.goto("http://localhost:3001/rotas/cadastrar-campo");
    
    await page.fill('input[name="name"]', uniqueName);
    await page.fill('input[name="address"]', "Rua E2E, 999");
    await page.fill('input[name="city"]', "Rio de Janeiro");
    await page.selectOption('select[name="sportType"]', "volei");
    await page.fill('textarea[name="description"]', "Teste E2E completo");

    // Preencher horário e preço
    await page.locator('input[type="time"]').first().fill("09:00");
    await page.locator('input[type="time"]').nth(1).fill("21:00");
    await page.locator('input[type="number"]').first().fill("40");

    await page.click('button:has-text("Cadastrar Campo")');

    // 2. Aguardar redirecionamento
    await page.waitForURL(/campos/);

    // 3. Buscar pelo campo cadastrado
    await page.fill('input[placeholder="Digite o nome do lugar"]', uniqueName);
    await page.waitForTimeout(500);

    // 4. Verificar se o campo aparece na listagem
    await expect(page.locator("h3")).toContainText(uniqueName);
  });
});
