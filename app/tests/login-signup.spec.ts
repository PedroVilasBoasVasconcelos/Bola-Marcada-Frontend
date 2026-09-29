import { test, expect } from "@playwright/test";

test("Clicar no escudo volta para Home", async ({ page }) => {
  await page.goto("/rotas/login");

  await page.click("img[alt='Logo Bola Marcada']");

  await expect(page).toHaveURL("/");
});

test("Criar conta com sucesso mostra mensagem correta", async ({ page }) => {
  await page.goto("/rotas/login");

  await page.fill("input[name='name']", "Pedro Teste");
  await page.fill("input[name='email']", "usuarioValido1@teste.com.br");
  await page.fill("input[name='password']", "Pedro0901.");
  await page.fill("input[name='cpf']", "12345678909");

  await page.click("button:has-text('CRIAR CONTA')");

  await page.waitForTimeout(300);

  const successMessage = page.locator("text=Conta criada com sucesso!");
  await expect(successMessage).toBeVisible({ timeout: 15000 });
});

test("Criar conta com dados inválidos mostra mensagem de erro", async ({
  page,
}) => {
  await page.goto("/rotas/login");

  await page.fill("input[name='name']", "");
  await page.fill("input[name='email']", "invalido");
  await page.fill("input[name='password']", "123");
  await page.fill("input[name='cpf']", "");

  await page.click("button:has-text('CRIAR CONTA')");

  await expect(page.locator("text=Erro ao criar conta")).toBeVisible();
});

test("Login válido redireciona para a página de perfil", async ({ page }) => {
  await page.goto("/rotas/login");

  const email = "usuarioValido1@teste.com.br";
  const senha = "Pedro0901.";

  const loginForm = page.locator(".backdrop-blur-md").nth(1);

  await loginForm.locator("input[name='email']").fill(email);
  await loginForm.locator("input[name='password']").fill(senha);

  await loginForm.locator("button:has-text('ENTRAR')").click();

  await expect(page).toHaveURL("/rotas/profile", { timeout: 10000 });
});

test("Login inválido mostra mensagem de erro", async ({ page }) => {
  await page.goto("/rotas/login");

  await page.fill("input[name='email']", "errado@teste.com");
  await page.fill("input[name='password']", "0000");

  await page.click("button:has-text('ENTRAR')");

  await expect(page.locator("text=Erro ao entrar")).toBeVisible();
});
