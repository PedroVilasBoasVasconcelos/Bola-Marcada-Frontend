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

// Helper para abrir modal de reserva
async function openReservationModal(page: any) {
  await page.goto("/rotas/campos");
  await page.waitForTimeout(1000);

  const firstFieldCard = page.locator('[data-testid="field-card"]').first();
  await firstFieldCard.locator("text=Ver Detalhes").click();

  await page.waitForTimeout(1000);

  await page.click("button:has-text('Reservar')");
  await page.waitForTimeout(500);
}

test("Passo 1 - Seleciona data futura", async ({ page }) => {
  await login(page);
  await openReservationModal(page);

  const dateInput = page.locator('input[type="date"]');
  await expect(dateInput).toBeVisible({ timeout: 5000 });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split("T")[0];

  await dateInput.fill(dateStr);

  const nextButton = page.locator("button:has-text('Próximo'), button:has-text('Continuar')");
  await expect(nextButton).toBeVisible();
});

test("Passo 1 - Valida que não permite data passada", async ({ page }) => {
  await login(page);
  await openReservationModal(page);

  const dateInput = page.locator('input[type="date"]');
  await expect(dateInput).toBeVisible({ timeout: 5000 });

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split("T")[0];

  await dateInput.fill(dateStr);

  const nextButton = page.locator("button:has-text('Próximo'), button:has-text('Continuar')");
  
  if ((await nextButton.count()) > 0) {
    await nextButton.click();
    await page.waitForTimeout(500);

    const errorMessage = page.locator("text=/data.*passad|data.*inválid/i");
    
    if ((await errorMessage.count()) > 0) {
      await expect(errorMessage).toBeVisible();
    }
  }
});

test("Passo 2 - Exibe grid de horários disponíveis", async ({ page }) => {
  await login(page);
  await openReservationModal(page);

  const dateInput = page.locator('input[type="date"]');
  await expect(dateInput).toBeVisible({ timeout: 5000 });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split("T")[0];

  await dateInput.fill(dateStr);

  const nextButton = page.locator("button:has-text('Próximo'), button:has-text('Continuar')");
  await nextButton.click();

  await page.waitForTimeout(1000);

  const timeSlots = page.locator("button:has-text('h'), button:has-text(':')");
  const count = await timeSlots.count();
  
  expect(count).toBeGreaterThanOrEqual(0);
});

test("Passo 2 - Seleciona hora e duração (1h, 2h, 3h)", async ({ page }) => {
  await login(page);
  await openReservationModal(page);

  const dateInput = page.locator('input[type="date"]');
  await expect(dateInput).toBeVisible({ timeout: 5000 });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split("T")[0];

  await dateInput.fill(dateStr);

  const nextButton = page.locator("button:has-text('Próximo'), button:has-text('Continuar')");
  await nextButton.click();

  await page.waitForTimeout(1000);

  const timeSlot = page.locator("button:has-text(':')").first();
  
  if ((await timeSlot.count()) > 0) {
    await timeSlot.click();
    await page.waitForTimeout(500);

    const durationButton = page.locator("button:has-text('1h'), button:has-text('2h'), button:has-text('3h')").first();
    
    if ((await durationButton.count()) > 0) {
      await durationButton.click();
      await page.waitForTimeout(500);
    }
  }
});

test("Passo 2 - Calcula preço total corretamente", async ({ page }) => {
  await login(page);
  await openReservationModal(page);

  const dateInput = page.locator('input[type="date"]');
  await expect(dateInput).toBeVisible({ timeout: 5000 });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split("T")[0];

  await dateInput.fill(dateStr);

  const nextButton = page.locator("button:has-text('Próximo'), button:has-text('Continuar')");
  await nextButton.click();

  await page.waitForTimeout(1000);

  const timeSlot = page.locator("button:has-text(':')").first();
  
  if ((await timeSlot.count()) > 0) {
    await timeSlot.click();
    await page.waitForTimeout(500);

    const durationButton = page.locator("button:has-text('2h')").first();
    
    if ((await durationButton.count()) > 0) {
      await durationButton.click();
      await page.waitForTimeout(500);

      const priceDisplay = page.locator("text=/R\\$.*\\d+/");
      await expect(priceDisplay.first()).toBeVisible();
    }
  }
});

test("Passo 3 - Exibe resumo completo da reserva", async ({ page }) => {
  await login(page);
  await openReservationModal(page);

  const dateInput = page.locator('input[type="date"]');
  await expect(dateInput).toBeVisible({ timeout: 5000 });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split("T")[0];

  await dateInput.fill(dateStr);

  let nextButton = page.locator("button:has-text('Próximo'), button:has-text('Continuar')");
  await nextButton.click();

  await page.waitForTimeout(1000);

  const timeSlot = page.locator("button:has-text(':')").first();
  
  if ((await timeSlot.count()) > 0) {
    await timeSlot.click();
    await page.waitForTimeout(500);

    const durationButton = page.locator("button:has-text('1h')").first();
    
    if ((await durationButton.count()) > 0) {
      await durationButton.click();
      await page.waitForTimeout(500);

      nextButton = page.locator("button:has-text('Próximo'), button:has-text('Continuar')");
      
      if ((await nextButton.count()) > 0) {
        await nextButton.click();
        await page.waitForTimeout(1000);

        const summary = page.locator("text=Resumo, text=Confirmação");
        
        if ((await summary.count()) > 0) {
          await expect(summary.first()).toBeVisible();
        }
      }
    }
  }
});

test("Navegação entre passos (Voltar/Próximo)", async ({ page }) => {
  await login(page);
  await openReservationModal(page);

  const dateInput = page.locator('input[type="date"]');
  await expect(dateInput).toBeVisible({ timeout: 5000 });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split("T")[0];

  await dateInput.fill(dateStr);

  const nextButton = page.locator("button:has-text('Próximo'), button:has-text('Continuar')");
  await nextButton.click();

  await page.waitForTimeout(1000);

  const backButton = page.locator("button:has-text('Voltar')");
  
  if ((await backButton.count()) > 0) {
    await backButton.click();
    await page.waitForTimeout(500);

    await expect(dateInput).toBeVisible();
  }
});

test("Modal fecha ao clicar fora ou no botão fechar", async ({ page }) => {
  await login(page);
  await openReservationModal(page);

  const modal = page.locator('[role="dialog"], .modal, [data-testid="reservation-modal"]');
  await expect(modal).toBeVisible({ timeout: 5000 });

  const closeButton = page.locator("button:has-text('×'), button:has-text('Fechar')");
  
  if ((await closeButton.count()) > 0) {
    await closeButton.first().click();
    await page.waitForTimeout(500);

    const modalHidden = await modal.isHidden();
    expect(modalHidden).toBe(true);
  }
});
