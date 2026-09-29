import { test, expect } from "@playwright/test";

test("Editar nome e telefone atualiza informações abaixo do avatar", async ({
  page,
}) => {
  await page.goto("/rotas/login");

  await page.waitForSelector(".backdrop-blur-md");

  await page.goto("/rotas/login");

  const email = "usuarioValido1@teste.com.br";
  const senha = "Pedro0901.";

  const loginForm = page.locator(".backdrop-blur-md").nth(1);

  await loginForm.locator("input[name='email']").fill(email);
  await loginForm.locator("input[name='password']").fill(senha);

  await loginForm.locator("button:has-text('ENTRAR')").click();

  await expect(page).toHaveURL("/rotas/profile", { timeout: 15000 });

  await page.click("button:has-text('Editar')");

  await page.fill(
    "input[placeholder='Nome completo']",
    "Nome Atualizado Teste"
  );
  await page.fill("input[placeholder='Telefone']", "31999998888");

  await Promise.all([
    page.waitForResponse(
      (res) => res.url().includes("/user") && res.status() < 500
    ),
    page.click("button:has-text('Salvar')"),
  ]);

  await expect(page.locator("text=Nome Atualizado Teste")).toBeVisible();
});

test("Deletar conta remove o usuário e redireciona para a Home", async ({
  page,
}) => {
  await page.goto("/rotas/login");

  await page.waitForSelector(".backdrop-blur-md");

  await page.goto("/rotas/login");

  const email = "usuarioValido1@teste.com.br";
  const senha = "Pedro0901.";

  const loginForm = page.locator(".backdrop-blur-md").nth(1);

  await loginForm.locator("input[name='email']").fill(email);
  await loginForm.locator("input[name='password']").fill(senha);

  await loginForm.locator("button:has-text('ENTRAR')").click();

  await expect(page).toHaveURL("/rotas/profile", { timeout: 15000 });

  await page.click("button:has-text('Deletar Conta')");

  page.once("dialog", (dialog) => dialog.accept());

  await page.waitForResponse(
    (res) => res.url().includes("/user") && res.status() < 500
  );

  await expect(page).toHaveURL("/", { timeout: 5000 });
});
