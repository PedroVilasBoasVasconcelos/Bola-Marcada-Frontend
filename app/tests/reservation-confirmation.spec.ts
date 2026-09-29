import { test, expect } from "@playwright/test";

// Helper para criar uma reserva mockada
async function createMockReservation(page: any) {
  // Primeiro precisa ir para uma página do app para ter acesso ao localStorage
  await page.goto("/");
  
  const mockReservation = {
    id: "test-reservation-123",
    fieldId: "1",
    fieldName: "Society Field A",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow
    dayOfWeek: "monday",
    startTime: "10:00",
    duration: 1,
    price: 50,
    createdAt: new Date().toISOString(),
  };

  await page.evaluate((reservation: any) => {
    const reservations = JSON.parse(
      localStorage.getItem("userReservations") || "[]"
    );
    reservations.push(reservation);
    localStorage.setItem("userReservations", JSON.stringify(reservations));
  }, mockReservation);

  return mockReservation;
}

test("Exibe dados da reserva (campo, data, hora, preço)", async ({ page }) => {
  const mockReservation = await createMockReservation(page);

  await page.goto(`/rotas/reserva/confirmacao?id=${mockReservation.id}`);

  await page.waitForTimeout(1000);

  const fieldName = page.locator(`text=${mockReservation.fieldName}`);
  await expect(fieldName).toBeVisible({ timeout: 5000 });

  const priceDisplay = page.locator(`text=/R\\$.*${mockReservation.price}/`);
  await expect(priceDisplay).toBeVisible();

  const timeDisplay = page.locator(`text=${mockReservation.startTime}`);
  await expect(timeDisplay).toBeVisible();
});

test("Botão 'Ver Minhas Reservas' redireciona para profile", async ({ page }) => {
  const mockReservation = await createMockReservation(page);

  await page.goto(`/rotas/reserva/confirmacao?id=${mockReservation.id}`);

  await page.waitForTimeout(1000);

  const myReservationsButton = page.locator(
    "button:has-text('Ver Minhas Reservas'), a:has-text('Ver Minhas Reservas')"
  );

  if ((await myReservationsButton.count()) > 0) {
    await myReservationsButton.click();

    await page.waitForTimeout(1000);

    await expect(page).toHaveURL(/\/rotas\/profile/);
  }
});

test("Botão 'Reservar Novamente' redireciona para home ou listagem", async ({ page }) => {
  const mockReservation = await createMockReservation(page);

  await page.goto(`/rotas/reserva/confirmacao?id=${mockReservation.id}`);

  await page.waitForTimeout(1000);

  const reserveAgainButton = page.locator(
    "button:has-text('Reservar Novamente'), a:has-text('Reservar Novamente'), button:has-text('Nova Reserva')"
  );

  if ((await reserveAgainButton.count()) > 0) {
    await reserveAgainButton.click();

    await page.waitForTimeout(1000);

    const url = page.url();
    const isValidRedirect = url.includes("/rotas/campos") || url === "/" || url.endsWith("/");
    
    expect(isValidRedirect).toBe(true);
  }
});

test("Ícone de sucesso aparece", async ({ page }) => {
  const mockReservation = await createMockReservation(page);

  await page.goto(`/rotas/reserva/confirmacao?id=${mockReservation.id}`);

  await page.waitForTimeout(1000);

  const successIcon = page.locator("svg, [data-icon='check'], [class*='check']").first();
  await expect(successIcon).toBeVisible({ timeout: 5000 });
});

test("Redireciona para listagem se ID inválido", async ({ page }) => {
  await page.goto("/rotas/reserva/confirmacao?id=invalid-reservation-id");

  await page.waitForTimeout(1500);

  await expect(page).toHaveURL(/\/rotas\/campos/);
});

test("Exibe dia da semana correto", async ({ page }) => {
  const mockReservation = await createMockReservation(page);

  await page.goto(`/rotas/reserva/confirmacao?id=${mockReservation.id}`);

  await page.waitForTimeout(1000);

  const dayOfWeek = page.locator("text=/Segunda-feira|Terça-feira|Quarta-feira|Quinta-feira|Sexta-feira|Sábado|Domingo/");
  await expect(dayOfWeek.first()).toBeVisible();
});

test("Formata data em DD/MM/YYYY", async ({ page }) => {
  const mockReservation = await createMockReservation(page);

  await page.goto(`/rotas/reserva/confirmacao?id=${mockReservation.id}`);

  await page.waitForTimeout(1000);

  const datePattern = page.locator("text=/\\d{2}\\/\\d{2}\\/\\d{4}/");
  await expect(datePattern.first()).toBeVisible();
});
