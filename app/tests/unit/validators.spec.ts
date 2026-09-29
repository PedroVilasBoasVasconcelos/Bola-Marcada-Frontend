import { describe, it, expect } from '@jest/globals';
import {
  isValidEmail,
  isValidPassword,
  isValidCPF,
  isValidPhone,
  formatPhone,
  formatCPF,
  formatDate,
  formatTime,
  isValidFutureDate,
  calculateTotalPrice,
  getDayOfWeekInPortuguese,
  isValidPrice,
  truncateText,
  generateUniqueId,
  isTimeSlotAvailable,
  getDaysDifference,
  isEmpty,
  capitalizeFirstLetter,
  removeAccents,
  isValidTimeFormat,
} from '../../utils/validators';

describe('Validadores - Testes Unitários', () => {
  // Teste 1: Validação de email válido
  it('deve validar email válido', () => {
    expect(isValidEmail('teste@example.com')).toBe(true);
    expect(isValidEmail('usuario.teste@gmail.com')).toBe(true);
    expect(isValidEmail('contato@empresa.com.br')).toBe(true);
  });

  // Teste 2: Validação de email inválido
  it('deve rejeitar email inválido', () => {
    expect(isValidEmail('emailinvalido')).toBe(false);
    expect(isValidEmail('teste@')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('teste @example.com')).toBe(false);
  });

  // Teste 3: Validação de senha válida
  it('deve validar senha forte', () => {
    expect(isValidPassword('Senha123!')).toBe(true);
    expect(isValidPassword('Pedro0901.')).toBe(true);
    expect(isValidPassword('Abcd1234@')).toBe(true);
  });

  // Teste 4: Validação de senha fraca
  it('deve rejeitar senha fraca', () => {
    expect(isValidPassword('senha123')).toBe(false); // Sem maiúscula e especial
    expect(isValidPassword('SENHA123!')).toBe(false); // Sem minúscula
    expect(isValidPassword('SenhaForte!')).toBe(false); // Sem número
    expect(isValidPassword('Sen123')).toBe(false); // Menos de 8 caracteres
  });

  // Teste 5: Validação de CPF válido
  it('deve validar CPF com 11 dígitos', () => {
    expect(isValidCPF('12345678909')).toBe(true);
    expect(isValidCPF('111.222.333-44')).toBe(true);
  });

  // Teste 6: Validação de CPF inválido
  it('deve rejeitar CPF inválido', () => {
    expect(isValidCPF('123')).toBe(false);
    expect(isValidCPF('11111111111')).toBe(false); // Todos iguais
    expect(isValidCPF('abc.def.ghi-jk')).toBe(false);
  });

  // Teste 7: Validação de telefone válido
  it('deve validar telefone brasileiro', () => {
    expect(isValidPhone('11999998888')).toBe(true);
    expect(isValidPhone('1133334444')).toBe(true);
    expect(isValidPhone('(11) 99999-8888')).toBe(true);
  });

  // Teste 8: Formatação de telefone
  it('deve formatar telefone corretamente', () => {
    expect(formatPhone('11999998888')).toBe('(11) 99999-8888');
    expect(formatPhone('1133334444')).toBe('(11) 3333-4444');
  });

  // Teste 9: Formatação de CPF
  it('deve formatar CPF corretamente', () => {
    expect(formatCPF('12345678909')).toBe('123.456.789-09');
  });

  // Teste 10: Formatação de data
  it('deve formatar data em DD/MM/YYYY', () => {
    const date = new Date('2024-12-25');
    expect(formatDate(date)).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(formatDate('2024-12-25')).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  // Teste 11: Formatação de hora
  it('deve formatar hora em HH:mm', () => {
    expect(formatTime('9:30')).toBe('09:30');
    expect(formatTime('14:5')).toBe('14:05');
    expect(formatTime('10:00')).toBe('10:00');
  });

  // Teste 12: Validação de data futura
  it('deve validar que data é futura', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    expect(isValidFutureDate(tomorrowStr)).toBe(true);
  });

  // Teste 13: Cálculo de preço total
  it('deve calcular preço total corretamente', () => {
    expect(calculateTotalPrice(50, 1)).toBe(50);
    expect(calculateTotalPrice(50, 2)).toBe(100);
    expect(calculateTotalPrice(75.5, 3)).toBe(226.5);
  });

  // Teste 14: Conversão de dia da semana
  it('deve converter dia da semana para português', () => {
    expect(getDayOfWeekInPortuguese('monday')).toBe('Segunda-feira');
    expect(getDayOfWeekInPortuguese('friday')).toBe('Sexta-feira');
    expect(getDayOfWeekInPortuguese('sunday')).toBe('Domingo');
  });

  // Teste 15: Validação de preço
  it('deve validar formato de preço', () => {
    expect(isValidPrice('50.00')).toBe(true);
    expect(isValidPrice('75,50')).toBe(true);
    expect(isValidPrice('100')).toBe(true);
    expect(isValidPrice('-10')).toBe(false);
    expect(isValidPrice('abc')).toBe(false);
  });

  // Teste 16: Truncar texto
  it('deve truncar texto com reticências', () => {
    expect(truncateText('Texto muito longo para exibir', 10)).toBe('Texto muit...');
    expect(truncateText('Curto', 10)).toBe('Curto');
  });

  // Teste 17: Gerar ID único
  it('deve gerar ID único com prefixo', () => {
    const id1 = generateUniqueId('test');
    const id2 = generateUniqueId('test');
    expect(id1).toContain('test-');
    expect(id2).toContain('test-');
    expect(id1).not.toBe(id2);
  });

  // Teste 18: Verificar disponibilidade de horário
  it('deve verificar se horário tem duração suficiente', () => {
    expect(isTimeSlotAvailable('10:00', '12:00', 2)).toBe(true);
    expect(isTimeSlotAvailable('10:00', '11:00', 2)).toBe(false);
    expect(isTimeSlotAvailable('14:00', '18:00', 3)).toBe(true);
  });

  // Teste 19: Calcular diferença de dias
  it('deve calcular diferença entre duas datas', () => {
    expect(getDaysDifference('2024-01-01', '2024-01-02')).toBe(1);
    expect(getDaysDifference('2024-01-01', '2024-01-10')).toBe(9);
  });

  // Teste 20: Verificar string vazia
  it('deve identificar strings vazias ou com espaços', () => {
    expect(isEmpty('')).toBe(true);
    expect(isEmpty('   ')).toBe(true);
    expect(isEmpty('texto')).toBe(false);
  });

  // Teste 21: Capitalizar primeira letra
  it('deve capitalizar primeira letra', () => {
    expect(capitalizeFirstLetter('texto')).toBe('Texto');
    expect(capitalizeFirstLetter('TEXTO')).toBe('Texto');
    expect(capitalizeFirstLetter('tExTo')).toBe('Texto');
  });

  // Teste 22: Remover acentos
  it('deve remover acentos de strings', () => {
    expect(removeAccents('São Paulo')).toBe('Sao Paulo');
    expect(removeAccents('José María')).toBe('Jose Maria');
    expect(removeAccents('Ação')).toBe('Acao');
  });

  // Teste 23: Validar formato de hora
  it('deve validar formato de hora HH:mm', () => {
    expect(isValidTimeFormat('10:00')).toBe(true);
    expect(isValidTimeFormat('23:59')).toBe(true);
    expect(isValidTimeFormat('24:00')).toBe(false);
    expect(isValidTimeFormat('10:60')).toBe(false);
    expect(isValidTimeFormat('10')).toBe(false);
  });
});
