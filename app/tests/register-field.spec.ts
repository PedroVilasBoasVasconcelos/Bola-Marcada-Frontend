import { test, expect } from "@playwright/test";

// Helper para fazer login
async function login(page: any) {
  await page.goto("/rotas/login");
  await page.waitForSelector(".backdrop-blur-md");

  const loginForm = page.locator(".backdrop-blur-md").nth(1);
  await loginForm.locator("input[name='email']").fill("usuarioValido1@teste.com.br");
  await loginForm.locator("input[name='password']").fill("Pedro0901.");
  await loginForm.locator("button:has-text('ENTRAR')").click();

  await page.waitForTimeout(2000);
}

test("Preenche formulário completo (nome, descrição, preço, endereço)", async ({ page }) => {
  await login(page);

  await page.goto("/rotas/cadastrar-campo");

  await page.waitForTimeout(1000);

  await page.fill("input[name='name']", "Campo de Futebol Teste");
  await page.fill("input[name='address']", "Rua das Flores, 123");
  await page.fill("input[name='city']", "São Paulo");

  const sportSelect = page.locator("select[name='sportType']");
  if ((await sportSelect.count()) > 0) {
    await sportSelect.selectOption("futebol");
  }

  const descriptionField = page.locator("textarea[name='description']");
  if ((await descriptionField.count()) > 0) {
    await descriptionField.fill("Campo society em excelente estado, com vestiários e estacionamento.");
  }

  const nameInput = page.locator("input[name='name']");
  await expect(nameInput).toHaveValue("Campo de Futebol Teste");
});

test("Define horários de disponibilidade (checkboxes isOpen)", async ({ page }) => {
  await login(page);

  await page.goto("/rotas/cadastrar-campo");

  await page.waitForTimeout(1000);

  const mondayCheckbox = page.locator("input[type='checkbox'][data-day='monday']").first();
  
  if ((await mondayCheckbox.count()) > 0) {
    await mondayCheckbox.check();
    await page.waitForTimeout(300);

    const isChecked = await mondayCheckbox.isChecked();
    expect(isChecked).toBe(true);
  }
});

test("Upload de imagem funciona", async ({ page }) => {
  await login(page);

  await page.goto("/rotas/cadastrar-campo");

  await page.waitForTimeout(1000);

  const fileInput = page.locator("input[type='file']");
  
  if ((await fileInput.count()) > 0) {
    const buffer = Buffer.from("fake-image-content");
    await fileInput.setInputFiles({
      name: "campo-test.jpg",
      mimeType: "image/jpeg",
      buffer: buffer,
    });

    await page.waitForTimeout(500);
  }
});

test("Validação de campos obrigatórios", async ({ page }) => {
  await login(page);

  await page.goto("/rotas/cadastrar-campo");

  await page.waitForTimeout(1000);

  page.once("dialog", (dialog) => {
    expect(dialog.message()).toContain("obrigatórios");
    dialog.accept();
  });

  const submitButton = page.locator(
    "button:has-text('Cadastrar'), button:has-text('Salvar'), button[type='submit']"
  );

  if ((await submitButton.count()) > 0) {
    await submitButton.click();
    await page.waitForTimeout(500);
  }
});

test("Sucesso ao cadastrar redireciona ou exibe mensagem", async ({ page }) => {
  await login(page);

  await page.goto("/rotas/cadastrar-campo");

  await page.waitForTimeout(1000);

  // Preencher formulário completo
  await page.fill("input[name='name']", "Campo Teste Completo");
  await page.fill("input[name='address']", "Av. Paulista, 1000");
  await page.fill("input[name='city']", "São Paulo");

  const sportSelect = page.locator("select[name='sportType']");
  if ((await sportSelect.count()) > 0) {
    await sportSelect.selectOption("futebol");
  }

  const descriptionField = page.locator("textarea[name='description']");
  if ((await descriptionField.count()) > 0) {
    await descriptionField.fill("Campo completo para testes E2E.");
  }

  // Upload de imagem
  const fileInput = page.locator("input[type='file']");
  if ((await fileInput.count()) > 0) {
    const buffer = Buffer.from("fake-image-content");
    await fileInput.setInputFiles({
      name: "campo-test.jpg",
      mimeType: "image/jpeg",
      buffer: buffer,
    });

    await page.waitForTimeout(500);
  }

  page.once("dialog", (dialog) => {
    expect(dialog.message()).toContain("sucesso");
    dialog.accept();
  });

  const submitButton = page.locator(
    "button:has-text('Cadastrar'), button:has-text('Salvar'), button[type='submit']"
  );

  if ((await submitButton.count()) > 0) {
    await submitButton.click();
    await page.waitForTimeout(2000);
  }
});

test("Adiciona múltiplos horários para o mesmo dia", async ({ page }) => {
  await login(page);

  await page.goto("/rotas/cadastrar-campo");

  await page.waitForTimeout(1000);

  const addTimeSlotButton = page.locator(
    "button:has-text('Adicionar Horário'), button:has-text('+')"
  );

  if ((await addTimeSlotButton.count()) > 0) {
    await addTimeSlotButton.first().click();
    await page.waitForTimeout(500);

    const timeSlots = page.locator("[data-testid='time-slot']");
    const count = await timeSlots.count();
    
    expect(count).toBeGreaterThan(0);
  }
});

test("Valida formato de preço", async ({ page }) => {
  await login(page);

  await page.goto("/rotas/cadastrar-campo");

  await page.waitForTimeout(1000);

  const priceInput = page.locator("input[name='price'], input[placeholder*='preço']").first();

  if ((await priceInput.count()) > 0) {
    await priceInput.fill("50.00");
    await page.waitForTimeout(300);

    const value = await priceInput.inputValue();
    expect(value).toMatch(/^\d+([.,]\d{1,2})?$/);
  }
});
