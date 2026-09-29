// Validação de email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validação de senha (mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 especial)
export function isValidPassword(password: string): boolean {
  if (password.length < 8) return false;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return hasUpperCase && hasLowerCase && hasNumber && hasSpecial;
}

// Validação de CPF
export function isValidCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  return true;
}

// Validação de telefone brasileiro
export function isValidPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length === 10 || cleanPhone.length === 11;
}

// Formatação de telefone
export function formatPhone(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  }
  return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
}

// Formatação de CPF
export function formatCPF(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Formatação de data DD/MM/YYYY
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

// Formatação de hora HH:mm
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}

// Validação de data não pode ser passada
export function isValidFutureDate(date: string): boolean {
  const selectedDate = new Date(date + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
}

// Cálculo de preço total (preço por hora * duração)
export function calculateTotalPrice(pricePerHour: number, duration: number): number {
  return pricePerHour * duration;
}

// Converter dia da semana em português
export function getDayOfWeekInPortuguese(dayOfWeek: string): string {
  const days: Record<string, string> = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo',
  };
  return days[dayOfWeek] || dayOfWeek;
}

// Validação de preço (positivo e com até 2 casas decimais)
export function isValidPrice(price: string): boolean {
  const priceRegex = /^\d+([.,]\d{1,2})?$/;
  const isValid = priceRegex.test(price);
  const numericPrice = parseFloat(price.replace(',', '.'));
  return isValid && numericPrice > 0;
}

// Truncar texto com reticências
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Gerar ID único
export function generateUniqueId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Verificar se horário está disponível
export function isTimeSlotAvailable(startTime: string, endTime: string, duration: number): boolean {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startInMinutes = startHour * 60 + startMin;
  const endInMinutes = endHour * 60 + endMin;
  const durationInMinutes = duration * 60;
  
  return (endInMinutes - startInMinutes) >= durationInMinutes;
}

// Calcular diferença de dias entre duas datas
export function getDaysDifference(date1: string, date2: string): number {
  const d1 = new Date(date1 + 'T00:00:00');
  const d2 = new Date(date2 + 'T00:00:00');
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Verificar se string está vazia ou só tem espaços
export function isEmpty(str: string): boolean {
  return !str || str.trim().length === 0;
}

// Capitalizar primeira letra
export function capitalizeFirstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Remover acentos
export function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Validar formato de hora (HH:mm)
export function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
}
