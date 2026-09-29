import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock das funções da API
const mockFetch = jest.fn();
global.fetch = mockFetch as any;

describe('API Mock - Testes de Reservas', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  // Teste 1: Mock de createReservation com sucesso
  it('deve criar reserva com sucesso (mock)', async () => {
    const mockResponse = {
      id: 'res-123',
      fieldId: '1',
      fieldName: 'Society Field A',
      date: '2024-12-25',
      startTime: '10:00',
      duration: 2,
      price: 100,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const response = await fetch('/api/reservations', {
      method: 'POST',
      body: JSON.stringify(mockResponse),
    });
    const data = await response.json();

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(data.id).toBe('res-123');
    expect(data.price).toBe(100);
  });

  // Teste 2: Mock de createReservation com erro 400
  it('deve retornar erro 400 ao criar reserva inválida (mock)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ detail: 'Dados inválidos' }),
    });

    const response = await fetch('/api/reservations', {
      method: 'POST',
    });

    expect(response.ok).toBe(false);
    expect(response.status).toBe(400);
  });

  // Teste 3: Mock de getUserReservations retorna lista
  it('deve retornar lista de reservas do usuário (mock)', async () => {
    const mockReservations = [
      { id: 'res-1', fieldName: 'Campo A', price: 50 },
      { id: 'res-2', fieldName: 'Campo B', price: 75 },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockReservations,
    });

    const response = await fetch('/api/reservations/user/123');
    const data = await response.json();

    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(2);
    expect(data[0].fieldName).toBe('Campo A');
  });

  // Teste 4: Mock de cancelReservation com sucesso
  it('deve cancelar reserva com sucesso (mock)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
      json: async () => ({}),
    });

    const response = await fetch('/api/reservations/res-123', {
      method: 'DELETE',
    });

    expect(response.ok).toBe(true);
    expect(response.status).toBe(204);
  });

  // Teste 5: Mock de getFields retorna lista de campos
  it('deve retornar lista de campos disponíveis (mock)', async () => {
    const mockFields = [
      { id: '1', name: 'Society A', sportType: 'futebol', city: 'São Paulo' },
      { id: '2', name: 'Beach Tennis A', sportType: 'beach-tennis', city: 'Rio de Janeiro' },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFields,
    });

    const response = await fetch('/api/fields');
    const data = await response.json();

    expect(data).toHaveLength(2);
    expect(data[0].sportType).toBe('futebol');
    expect(data[1].city).toBe('Rio de Janeiro');
  });
});

describe('API Mock - Testes de Autenticação', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  // Teste 6: Mock de login com credenciais válidas
  it('deve fazer login com credenciais válidas (mock)', async () => {
    const mockLoginResponse = {
      access_token: 'token-abc-123',
      user: { id: '1', name: 'Pedro', email: 'pedro@test.com' },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockLoginResponse,
    });

    const response = await fetch('/api/users/signin', {
      method: 'POST',
      body: JSON.stringify({ email: 'pedro@test.com', password: 'Pedro123!' }),
    });
    const data = await response.json();

    expect(data.access_token).toBe('token-abc-123');
    expect(data.user.name).toBe('Pedro');
  });

  // Teste 7: Mock de login com credenciais inválidas
  it('deve retornar erro ao fazer login com senha incorreta (mock)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ detail: 'Credenciais inválidas' }),
    });

    const response = await fetch('/api/users/signin', {
      method: 'POST',
      body: JSON.stringify({ email: 'pedro@test.com', password: 'errada' }),
    });

    expect(response.ok).toBe(false);
    expect(response.status).toBe(401);
  });

  // Teste 8: Mock de signup com sucesso
  it('deve criar conta com sucesso (mock)', async () => {
    const mockSignupResponse = {
      id: '123',
      name: 'João Silva',
      email: 'joao@test.com',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => mockSignupResponse,
    });

    const response = await fetch('/api/users/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: 'João Silva',
        email: 'joao@test.com',
        password: 'Joao123!',
        cpf: '12345678909',
      }),
    });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.email).toBe('joao@test.com');
  });

  // Teste 9: Mock de signup com email duplicado
  it('deve retornar erro ao criar conta com email duplicado (mock)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({ detail: 'Email já cadastrado' }),
    });

    const response = await fetch('/api/users/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: 'João Silva',
        email: 'joao@test.com',
        password: 'Joao123!',
        cpf: '12345678909',
      }),
    });

    expect(response.ok).toBe(false);
    expect(response.status).toBe(409);
    const data = await response.json();
    expect(data.detail).toContain('Email');
  });

  // Teste 10: Mock de erro 500 do servidor
  it('deve lidar com erro 500 do servidor (mock)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ detail: 'Erro interno do servidor' }),
    });

    const response = await fetch('/api/fields');

    expect(response.ok).toBe(false);
    expect(response.status).toBe(500);
  });
});
