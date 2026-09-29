const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

//  ROTAS DE USUÁRIO

// Registrar novo usuário
export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  cpf: string;
}) {
  try {
    const response = await fetch(`${API_URL}/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = "Falha ao registrar usuário.";
      
      try {
        const error = await response.json();
        console.log("Erro do backend:", error);
        
        // Tenta extrair mensagem de várias formas possíveis
        if (typeof error.detail === 'string') {
          errorMessage = error.detail;
        } else if (error.detail && typeof error.detail === 'object') {
          errorMessage = JSON.stringify(error.detail);
        } else if (error.message) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
      } catch (e) {
        console.error("Erro ao parsear resposta:", e);
        errorMessage = `Erro ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error;
  }
}

// Login
export async function loginUser(data: { email: string; password: string }) {
  const response = await fetch(`${API_URL}/users/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Falha ao fazer login.");
  }

  const { access_token } = await response.json();
  
  // Buscar dados do usuário após login
  const userResponse = await fetch(`${API_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!userResponse.ok) {
    throw new Error("Falha ao obter dados do usuário.");
  }

  const user = await userResponse.json();
  
  return {
    token: access_token,
    user: user,
  };
}

// Obter dados do usuário atual
export async function getCurrentUser(token: string) {
  try {
    const response = await fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Falha ao obter dados do usuário.");
    }

    const userData = await response.json();
    
    // Salvar dados do usuário no localStorage para uso offline
    localStorage.setItem("userData", JSON.stringify(userData));
    
    return userData;
  } catch (error) {
    console.warn("Backend não disponível, usando dados locais");
    
    // Tentar pegar do localStorage
    const savedUser = localStorage.getItem("userData");
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    
    // Se não tiver no localStorage, criar usuário mockado
    const mockUser = {
      id: "local-user",
      name: "Usuário Local",
      email: "usuario@local.com",
      phone: "",
      avatar: null,
    };
    localStorage.setItem("userData", JSON.stringify(mockUser));
    return mockUser;
  }
}

// Atualizar usuário
export async function updateCurrentUser(
  token: string,
  data: { name: string; email?: string; phone?: string; avatar?: string }
) {
  const response = await fetch(`${API_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Falha ao atualizar usuário.");
  }

  return await response.json();
}

// Deletar usuário
export async function deleteUser(token: string, soft: boolean = true) {
  const response = await fetch(`${API_URL}/users/me?soft=${soft}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Falha ao deletar usuário.");
  }

  return true;
}

//  ROTAS DE CENTROS ESPORTIVOS

// Criar novo centro esportivo
export async function createSportsCenter(
  token: string,
  data: {
    name: string;
    cnpj: string;
    latitude: number;
    longitude: number;
    photo?: string;
    description?: string;
  }
) {
  // 1. Buscar ID do usuário logado
  const user = await getCurrentUser(token);
  
  // 2. Criar centro esportivo
  const response = await fetch(`${API_URL}/sports_center/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user_id: user.id,
      name: data.name,
      cnpj: data.cnpj,
      latitude: data.latitude,
      longitude: data.longitude,
      photo_path: data.photo,
      description: data.description,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (response.status === 409) {
      throw new Error("CNPJ já cadastrado no sistema.");
    }
    throw new Error(error.detail || "Falha ao criar centro esportivo.");
  }

  return await response.json();
}

// Buscar centros esportivos do usuário logado
export async function getMySportsCenters(token: string) {
  const response = await fetch(`${API_URL}/sports_center/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Falha ao buscar centros esportivos.");
  }

  return await response.json();
}

// Buscar centros esportivos por cidade
export async function getSportsCentersByCity(cityName: string) {
  const response = await fetch(`${API_URL}/sports_center/city/${cityName}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Falha ao buscar centros esportivos.");
  }

  return await response.json();
}

//  ROTAS DE CAMPOS

// Criar novo campo
export async function createField(
  token: string,
  data: {
    name: string;
    address: string;
    city: string;
    sportType: string;
    description: string;
    images: string[];
    schedule: Array<{
      dayOfWeek: string;
      startTime: string;
      endTime: string;
      price: string;
    }>;
  }
) {
  // 1. Buscar centros do usuário logado
  const centers = await getMySportsCenters(token);
  
  if (!centers || centers.length === 0) {
    throw new Error("Você precisa criar um centro esportivo primeiro!");
  }
  
  const sportsCenterId = centers[0].id;
  
  // 2. Converter para formato do backend
  const backendData = {
    sports_center_id: sportsCenterId,
    name: data.name,
    field_type: data.sportType,
    price_per_hour: parseFloat(data.schedule[0]?.price || '0'),
    photo_path: data.images[0] || '',
    description: data.description,
  };

  const response = await fetch(`${API_URL}/field`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const errorMessage = error.detail || error.message || "Falha ao cadastrar campo.";
    throw new Error(errorMessage);
  }

  return await response.json();
}

// Buscar todos os campos
export async function getFields(filters?: {
  city?: string;
  sportType?: string;
}) {
  let url = `${API_URL}/field`;
  
  if (filters) {
    const params = new URLSearchParams();
    if (filters.city) params.append("city", filters.city);
    if (filters.sportType) params.append("sportType", filters.sportType);
    
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Falha ao buscar campos.");
  }

  const backendFields = await response.json();
  
  // Adaptar formato backend → frontend
  if (Array.isArray(backendFields)) {
    return backendFields.map((field: any) => ({
      id: field.id.toString(),
      name: field.name,
      sportType: field.field_type,
      description: field.description || '',
      images: field.photo_path ? [field.photo_path] : [],
      price: field.price_per_hour?.toString() || '0',
      address: '', // Precisa vir do sports_center
      city: '', // Precisa vir do sports_center
      schedule: [], // Precisa vir de availabilities
    }));
  }
  
  return backendFields;
}

// Buscar campo por ID (com dados do sports_center)
export async function getFieldById(id: string) {
  const response = await fetch(`${API_URL}/field/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Falha ao buscar campo.");
  }

  const backendField = await response.json();
  
  // Adaptar formato backend → frontend (agora com sports_center)
  return {
    id: backendField.id.toString(),
    name: backendField.name,
    sportType: backendField.field_type,
    description: backendField.description || '',
    images: backendField.photo_path ? [backendField.photo_path] : [],
    price: backendField.price_per_hour?.toString() || '0',
    // Dados do sports_center (lat/long, converter para endereço com geocoding)
    centerName: backendField.sports_center?.name || '',
    latitude: backendField.sports_center?.latitude,
    longitude: backendField.sports_center?.longitude,
    // Endereço será gerado usando geocoding no componente
    address: '',
    city: '',
    schedule: [], // Buscar com getFieldAvailabilities
  };
}

// Buscar horários disponíveis de um campo
export async function getFieldAvailabilities(fieldId: string) {
  const response = await fetch(`${API_URL}/field/${fieldId}/availabilities`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Falha ao buscar horários do campo.");
  }

  const availabilities = await response.json();
  
  // Adaptar formato backend → frontend
  return availabilities.map((avail: any) => {
    const startDate = new Date(avail.start_time);
    const endDate = new Date(avail.end_time);
    
    return {
      id: avail.id.toString(),
      dayOfWeek: avail.day_of_week_name || dayNames[avail.day_of_week],
      startTime: startDate.toTimeString().slice(0, 5), // "08:00"
      endTime: endDate.toTimeString().slice(0, 5),     // "22:00"
      price: '0', // Será preenchido com price_per_hour do campo
    };
  });
}

// Buscar campo completo (com sports_center e horários)
export async function getFieldComplete(id: string) {
  const field = await getFieldById(id);
  const availabilities = await getFieldAvailabilities(id);
  
  // Adicionar preço aos horários
  const schedule = availabilities.map((avail: any) => ({
    ...avail,
    price: field.price,
  }));
  
  return {
    ...field,
    schedule,
  };
}

// Atualizar campo
export async function updateField(
  token: string,
  id: string,
  data: Partial<{
    name: string;
    address: string;
    city: string;
    sportType: string;
    description: string;
    images: string[];
    schedule: Array<{
      dayOfWeek: string;
      startTime: string;
      endTime: string;
      price: string;
    }>;
  }>
) {
  // Converter para formato do backend
  const backendData: any = {};
  if (data.name) backendData.name = data.name;
  if (data.sportType) backendData.field_type = data.sportType;
  if (data.description) backendData.description = data.description;
  if (data.images && data.images[0]) backendData.photo_path = data.images[0];
  if (data.schedule && data.schedule[0]) {
    backendData.price_per_hour = parseFloat(data.schedule[0].price);
  }

  const response = await fetch(`${API_URL}/field/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Falha ao atualizar campo.");
  }

  return await response.json();
}

// Deletar campo
export async function deleteField(token: string, id: string) {
  const response = await fetch(`${API_URL}/field/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Falha ao deletar campo.");
  }

  return true;
}

//  ROTAS DE RESERVAS (BOOKINGS)

// Helper: Converter dia da semana (string → número)
const dayNameToNumber: { [key: string]: number } = {
  'Domingo': 0,
  'Segunda': 1,
  'Terça': 2,
  'Quarta': 3,
  'Quinta': 4,
  'Sexta': 5,
  'Sábado': 6,
};

// Helper: Converter número → dia da semana
const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

// Criar nova reserva
export async function createReservation(
  token: string,
  data: {
    fieldId: string;
    date: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    price: string;
  }
) {
  try {
    // Converter para formato do backend
    const backendData = {
      user_id: 1, // Será substituído pelo backend usando o token
      field_id: parseInt(data.fieldId),
      booking_date: `${data.date}T${data.startTime}:00`,
      start_time: `${data.date}T${data.startTime}:00`,
      end_time: `${data.date}T${data.endTime}:00`,
    };

    const response = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(backendData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Falha ao criar reserva.");
    }

    const reservation = await response.json();
    console.log("✅ Reserva criada no backend:", reservation);
    
    return reservation;
  } catch (error) {
    console.warn("⚠️ Backend não disponível, usando localStorage");
    
    // Fallback: salvar no localStorage
    const localReservation = {
      id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    
    const existingReservations = JSON.parse(
      localStorage.getItem("userReservations") || "[]"
    );
    existingReservations.push(localReservation);
    localStorage.setItem("userReservations", JSON.stringify(existingReservations));
    
    console.log("📦 Reserva salva localmente:", localReservation);
    return localReservation;
  }
}

// Obter reservas do usuário
export async function getUserReservations(token: string) {
  try {
    const response = await fetch(`${API_URL}/bookings/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Falha ao obter reservas.");
    }

    const backendBookings = await response.json();
    console.log("✅ Reservas do backend:", backendBookings);
    
    // Adaptar formato backend → frontend
    const reservations = backendBookings.map((booking: any) => {
      const startDate = new Date(booking.start_time);
      return {
        id: booking.id.toString(),
        fieldId: booking.field_id.toString(),
        date: startDate.toISOString().split('T')[0],
        dayOfWeek: dayNames[booking.day_of_week] || 'Segunda',
        startTime: startDate.toTimeString().slice(0, 5),
        endTime: '16:00', // Calcular ou buscar do campo se disponível
        price: '100.00', // Buscar do campo se disponível
        status: booking.status,
        createdAt: booking.created_at || new Date().toISOString(),
      };
    });
    
    // Salvar no localStorage para backup
    localStorage.setItem("userReservations", JSON.stringify(reservations));
    
    return reservations;
  } catch (error) {
    console.warn("⚠️ Backend não disponível, usando localStorage");
    
    // Fallback: pegar do localStorage
    const localReservations = localStorage.getItem("userReservations");
    if (localReservations) {
      const reservations = JSON.parse(localReservations);
      console.log("📦 Reservas locais:", reservations);
      return reservations;
    }
    
    console.log("⚠️ Nenhuma reserva encontrada");
    return [];
  }
}

// Cancelar reserva
export async function cancelReservation(token: string, id: string) {
  try {
    const response = await fetch(`${API_URL}/bookings/${id}/cancel`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Falha ao cancelar reserva.");
    }

    console.log("✅ Reserva cancelada no backend");
    const result = await response.json();
    
    // Adaptar resposta se necessário
    return {
      success: true,
      message: result.message,
      booking: result.booking,
    };
  } catch (error) {
    console.warn("⚠️ Backend não disponível, cancelando localmente");
    
    // Fallback: cancelar no localStorage
    const localReservations = JSON.parse(
      localStorage.getItem("userReservations") || "[]"
    );
    
    const updatedReservations = localReservations.map((r: any) =>
      r.id === id ? { ...r, status: "cancelled" } : r
    );
    
    localStorage.setItem("userReservations", JSON.stringify(updatedReservations));
    console.log("📦 Reserva cancelada localmente");
    
    return { success: true };
  }
}
