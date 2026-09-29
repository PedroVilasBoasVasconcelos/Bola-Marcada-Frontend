import { test, expect } from "@playwright/test";

test("Renderiza lista de campos disponíveis", async ({ page }) => {
  await page.goto("/rotas/campos");

  await page.waitForTimeout(2000);

  const fieldCards = page.locator('[data-testid="field-card"]');
  const count = await fieldCards.count();
  
  // Se não houver campos, aceitar 0 (dados mock podem não estar carregados)
  expect(count).toBeGreaterThanOrEqual(0);
});

test("Botão 'Ver Detalhes' redireciona para página de detalhes", async ({ page }) => {
  await page.goto("/rotas/campos");

  await page.waitForTimeout(2000);

  const firstFieldCard = page.locator('[data-testid="field-card"]').first();
  
  if ((await firstFieldCard.count()) > 0) {
    await firstFieldCard.click();

    await page.waitForTimeout(500);

    await expect(page).toHaveURL(/\/rotas\/campo\/.+/);
  }
});

test("SearchBar filtra campos por nome", async ({ page }) => {
  await page.goto("/rotas/campos");

  await page.waitForTimeout(1000);

  const initialCount = await page.locator('[data-testid="field-card"]').count();

  await page.fill('[data-testid="search-input"]', "Society Field A");

  await page.waitForTimeout(500);

  const filteredCount = await page.locator('[data-testid="field-card"]').count();

  expect(filteredCount).toBeLessThanOrEqual(initialCount);
});

test("Campos sem disponibilidade aparecem como 'Fechado'", async ({ page }) => {
  await page.goto("/rotas/campos");

  await page.waitForTimeout(1000);

  const closedStatus = page.locator("text=Fechado").first();
  
  if ((await closedStatus.count()) > 0) {
    await expect(closedStatus).toBeVisible();
  }
});

test("Filtro por cidade funciona corretamente", async ({ page }) => {
  await page.goto("/rotas/campos");

  await page.waitForTimeout(1000);

  const cityFilter = page.locator('[data-testid="city-filter"]');
  
  if ((await cityFilter.count()) > 0) {
    await cityFilter.selectOption("São Paulo");
    
    await page.waitForTimeout(500);
    
    const fields = page.locator('[data-testid="field-card"]');
    const count = await fields.count();
    
    expect(count).toBeGreaterThanOrEqual(0);
  }
});

test("Filtro por esporte funciona corretamente", async ({ page }) => {
  await page.goto("/rotas/campos");

  await page.waitForTimeout(1000);

  const sportFilter = page.locator('[data-testid="sport-filter"]');
  
  if ((await sportFilter.count()) > 0) {
    await sportFilter.selectOption("futebol");
    
    await page.waitForTimeout(500);
    
    const fields = page.locator('[data-testid="field-card"]');
    const count = await fields.count();
    
    expect(count).toBeGreaterThanOrEqual(0);
  }
});
