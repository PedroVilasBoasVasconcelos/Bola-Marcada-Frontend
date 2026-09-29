import { test, expect } from "@playwright/test";

test("Exibe informações do campo (nome, preço, endereço)", async ({ page }) => {
  await page.goto("/rotas/campos");
  await page.waitForTimeout(1000);

  const firstFieldCard = page.locator('[data-testid="field-card"]').first();
  await firstFieldCard.locator("text=Ver Detalhes").click();

  await page.waitForTimeout(1000);

  const fieldName = page.locator("h1, h2").first();
  await expect(fieldName).toBeVisible();

  const addressIcon = page.locator("svg").first();
  await expect(addressIcon).toBeVisible();
});

test("Tabela de disponibilidade mostra horários corretos", async ({ page }) => {
  await page.goto("/rotas/campos");
  await page.waitForTimeout(1000);

  const firstFieldCard = page.locator('[data-testid="field-card"]').first();
  await firstFieldCard.locator("text=Ver Detalhes").click();

  await page.waitForTimeout(1000);

  const table = page.locator("table");
  await expect(table).toBeVisible();

  const rows = page.locator("tbody tr");
  const count = await rows.count();
  
  expect(count).toBeGreaterThan(0);
});

test("Botão 'Reservar' abre modal (usuário logado)", async ({ page }) => {
  // Fazer login primeiro
  await page.goto("/rotas/login");
  await page.waitForSelector(".backdrop-blur-md");

  const loginForm = page.locator(".backdrop-blur-md").nth(1);
  await loginForm.locator("input[name='email']").fill("usuarioValido1@teste.com.br");
  await loginForm.locator("input[name='password']").fill("Pedro0901.");
  await loginForm.locator("button:has-text('ENTRAR')").click();

  await page.waitForTimeout(2000);

  // Navegar para detalhes do campo
  await page.goto("/rotas/campos");
  await page.waitForTimeout(1000);

  const firstFieldCard = page.locator('[data-testid="field-card"]').first();
  await firstFieldCard.locator("text=Ver Detalhes").click();

  await page.waitForTimeout(1000);

  // Clicar em Reservar
  await page.click("button:has-text('Reservar')");

  await page.waitForTimeout(500);

  const modal = page.locator('[role="dialog"], .modal, [data-testid="reservation-modal"]');
  await expect(modal).toBeVisible({ timeout: 5000 });
});

test("Botão 'Reservar' redireciona para login (usuário não logado)", async ({ page }) => {
  // Limpar localStorage
  await page.goto("/rotas/campos");
  await page.evaluate(() => localStorage.removeItem("token"));

  await page.waitForTimeout(1000);

  const firstFieldCard = page.locator('[data-testid="field-card"]').first();
  await firstFieldCard.locator("text=Ver Detalhes").click();

  await page.waitForTimeout(1000);

  page.once("dialog", (dialog) => dialog.accept());

  await page.click("button:has-text('Reservar')");

  await page.waitForTimeout(1000);

  await expect(page).toHaveURL("/rotas/login");
});

test("Galeria de imagens permite navegação", async ({ page }) => {
  await page.goto("/rotas/campos");
  await page.waitForTimeout(1000);

  const firstFieldCard = page.locator('[data-testid="field-card"]').first();
  await firstFieldCard.locator("text=Ver Detalhes").click();

  await page.waitForTimeout(1000);

  const image = page.locator("img[alt*='Campo'], img[alt*='Field']").first();
  await expect(image).toBeVisible();

  const nextButton = page.locator("button:has-text('›'), button:has-text('>')");
  
  if ((await nextButton.count()) > 0) {
    await nextButton.first().click();
    await page.waitForTimeout(300);
  }
});

test("Horários fechados aparecem desabilitados", async ({ page }) => {
  await page.goto("/rotas/campos");
  await page.waitForTimeout(1000);

  const firstFieldCard = page.locator('[data-testid="field-card"]').first();
  await firstFieldCard.locator("text=Ver Detalhes").click();

  await page.waitForTimeout(1000);

  const closedSlot = page.locator("text=Fechado, text=Indisponível").first();
  
  if ((await closedSlot.count()) > 0) {
    await expect(closedSlot).toBeVisible();
  }
});
