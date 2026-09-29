import { test, expect } from "@playwright/test";

test("Botão CADASTRAR / ENTRAR redireciona para Login/Signup", async ({
  page,
}) => {
  await page.goto("/");

  await page.click("text=CADASTRAR / ENTRAR");

  await expect(page).toHaveURL("/rotas/login");
});
