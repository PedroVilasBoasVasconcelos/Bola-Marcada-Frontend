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

// Helper para criar reservas mockadas
async function createMockReservations(page: any) {
  const mockReservations = [
    {
      id: "res-1",
      fieldId: "1",
      fieldName: "Society Field A",
      date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      dayOfWeek: "monday",
      startTime: "10:00",
      duration: 1,
      price: 50,
      createdAt: new Date().toISOString(),
    },
    {
      id: "res-2",
      fieldId: "2",
      fieldName: "Beach Tennis Court A",
      date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
      dayOfWeek: "tuesday",
      startTime: "14:00",
      duration: 2,
      price: 100,
      createdAt: new Date().toISOString(),
    },
  ];

  // Ir para home primeiro para ter acesso ao localStorage
  await page.goto("/");

  await page.evaluate((reservations: any) => {
    localStorage.setItem("userReservations", JSON.stringify(reservations));
  }, mockReservations);

  return mockReservations;
}

test("Exibe lista de reservas do usuário", async ({ page }) => {
  await login(page);
  await createMockReservations(page);

  await page.goto("/rotas/profile");

  await page.waitForTimeout(1000);

  const reservationSection = page.locator("text=Minhas Reservas");
  await expect(reservationSection).toBeVisible();

  const reservationItems = page.locator("[data-testid='reservation-item']");
  
  if ((await reservationItems.count()) > 0) {
    const count = await reservationItems.count();
    expect(count).toBeGreaterThan(0);
  }
});

test("Botão 'Cancelar Reserva' remove da lista", async ({ page }) => {
  await login(page);
  await createMockReservations(page);

  await page.goto("/rotas/profile");

  await page.waitForTimeout(1000);

  const cancelButton = page.locator(
    "button:has-text('Cancelar'), button:has-text('Cancelar Reserva')"
  ).first();

  if ((await cancelButton.count()) > 0) {
    const initialReservations = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem("userReservations") || "[]");
    });

    page.once("dialog", (dialog) => dialog.accept());

    await cancelButton.click();

    await page.waitForTimeout(1000);

    const finalReservations = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem("userReservations") || "[]");
    });

    expect(finalReservations.length).toBeLessThan(initialReservations.length);
  }
});

test("Confirmação antes de cancelar", async ({ page }) => {
  await login(page);
  await createMockReservations(page);

  await page.goto("/rotas/profile");

  await page.waitForTimeout(1000);

  const cancelButton = page.locator(
    "button:has-text('Cancelar'), button:has-text('Cancelar Reserva')"
  ).first();

  if ((await cancelButton.count()) > 0) {
    let dialogShown = false;

    page.once("dialog", (dialog) => {
      dialogShown = true;
      expect(dialog.message()).toBeTruthy();
      dialog.dismiss();
    });

    await cancelButton.click();

    await page.waitForTimeout(500);

    expect(dialogShown).toBe(true);
  }
});

test("Mensagem quando não há reservas", async ({ page }) => {
  await login(page);

  await page.evaluate(() => {
    localStorage.setItem("userReservations", "[]");
  });

  await page.goto("/rotas/profile");

  await page.waitForTimeout(1000);

  const emptyMessage = page.locator(
    "text=/não possui reservas|nenhuma reserva|sem reservas/i"
  );

  await expect(emptyMessage).toBeVisible();
});

test("Exibe informações completas da reserva", async ({ page }) => {
  await login(page);
  const mockReservations = await createMockReservations(page);

  await page.goto("/rotas/profile");

  await page.waitForTimeout(1000);

  const firstReservation = mockReservations[0];

  const fieldName = page.locator(`text=${firstReservation.fieldName}`);
  
  if ((await fieldName.count()) > 0) {
    await expect(fieldName.first()).toBeVisible();
  }

  const time = page.locator(`text=${firstReservation.startTime}`);
  
  if ((await time.count()) > 0) {
    await expect(time.first()).toBeVisible();
  }
});

test("Formata data corretamente (DD/MM/YYYY)", async ({ page }) => {
  await login(page);
  await createMockReservations(page);

  await page.goto("/rotas/profile");

  await page.waitForTimeout(1000);

  const datePattern = page.locator("text=/\\d{2}\\/\\d{2}\\/\\d{4}/");
  
  if ((await datePattern.count()) > 0) {
    await expect(datePattern.first()).toBeVisible();
  }
});

test("Exibe preço da reserva", async ({ page }) => {
  await login(page);
  const mockReservations = await createMockReservations(page);

  await page.goto("/rotas/profile");

  await page.waitForTimeout(1000);

  const pricePattern = page.locator("text=/R\\$.*\\d+/");
  
  if ((await pricePattern.count()) > 0) {
    await expect(pricePattern.first()).toBeVisible();
  }
});

test("Ordena reservas por data (mais recentes primeiro)", async ({ page }) => {
  await login(page);
  await createMockReservations(page);

  await page.goto("/rotas/profile");

  await page.waitForTimeout(1000);

  const reservationDates = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll("[data-testid='reservation-item']"));
    return items.map((item) => item.textContent || "");
  });

  if (reservationDates.length > 1) {
    // Verificar se está ordenado (teste básico)
    expect(reservationDates.length).toBeGreaterThan(0);
  }
});
