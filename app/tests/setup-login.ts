import { test, expect } from "@playwright/test";

test("Login e salvar token", async ({ page }) => {
  await page.goto("/rotas/login");

  await page.fill("input[name='email']", "usuarioValido@teste.com");
  await page.fill("input[name='password']", "123456");

  await page.click("button:has-text('ENTRAR')");

  await expect(page).toHaveURL("/rotas/profile");

  await page.context().storageState({ path: "storageState.json" });
});
