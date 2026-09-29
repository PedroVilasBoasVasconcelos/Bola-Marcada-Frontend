// lib/geocoding.ts - Conversão de lat/long para endereço usando OpenStreetMap

interface GeocodingResult {
  display_name: string;
  address: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

/**
 * Converte latitude/longitude em endereço formatado usando OpenStreetMap.
 * Gratuito e sem necessidade de API key.
 * 
 * ⚠️ Rate limit: 1 requisição por segundo
 */
export async function getAddressFromCoordinates(
  lat: number,
  lng: number
): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?` +
      `lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'BolaMarcada/1.0' // Obrigatório pela política do OSM
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Erro ao buscar endereço');
    }
    
    const data: GeocodingResult = await response.json();
    
    // Formatar endereço de forma legível
    const addr = data.address;
    const parts = [
      addr.road,
      addr.suburb || addr.city,
      addr.state,
    ].filter(Boolean);
    
    return parts.join(', ') || data.display_name || `${lat}, ${lng}`;
    
  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
    // Fallback: retorna coordenadas
    return `${lat}, ${lng}`;
  }
}

/**
 * Versão com cache em memória para evitar múltiplas requisições.
 */
const addressCache = new Map<string, string>();

export async function getAddressFromCoordinatesCached(
  lat: number,
  lng: number
): Promise<string> {
  const key = `${lat.toFixed(6)},${lng.toFixed(6)}`;
  
  if (addressCache.has(key)) {
    return addressCache.get(key)!;
  }
  
  const address = await getAddressFromCoordinates(lat, lng);
  addressCache.set(key, address);
  
  return address;
}

/**
 * Hook para usar geocoding com cache persistente no localStorage
 */
export function useGeocodingCache() {
  const getFromLocalStorage = (): Record<string, string> => {
    if (typeof window === 'undefined') return {};
    try {
      const cached = localStorage.getItem('geocoding-cache');
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  };

  const saveToLocalStorage = (cache: Record<string, string>) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('geocoding-cache', JSON.stringify(cache));
    }
  };

  const getAddress = async (lat: number, lng: number): Promise<string> => {
    const key = `${lat.toFixed(6)},${lng.toFixed(6)}`;
    const cache = getFromLocalStorage();
    
    if (cache[key]) {
      return cache[key];
    }
    
    const address = await getAddressFromCoordinates(lat, lng);
    cache[key] = address;
    saveToLocalStorage(cache);
    
    return address;
  };

  return { getAddress };
}
