import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMySportsCenters } from '../utils/api';
import toast from 'react-hot-toast';

export function useRequireSportsCenter() {
  const router = useRouter();
  const [sportsCenterId, setSportsCenterId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCenter = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Você precisa fazer login primeiro!');
        router.push('/rotas/login');
        return;
      }

      try {
        const centers = await getMySportsCenters(token);

        if (!centers || centers.length === 0) {
          toast.error('Você precisa criar um centro esportivo primeiro!');
          router.push('/rotas/cadastrar-centro');
          return;
        }

        setSportsCenterId(centers[0].id);
      } catch (error) {
        console.error('Erro ao verificar centro esportivo:', error);
        toast.error('Erro ao verificar centro esportivo');
      } finally {
        setLoading(false);
      }
    };

    checkCenter();
  }, [router]);

  return { sportsCenterId, loading };
}

export async function getSportsCenterIdOrRedirect(
  token: string,
  router: any
): Promise<number | null> {
  try {
    const centers = await getMySportsCenters(token);

    if (!centers || centers.length === 0) {
      toast.error('Você precisa criar um centro esportivo primeiro!');
      router.push('/rotas/cadastrar-centro');
      return null;
    }

    return centers[0].id;
  } catch (error) {
    console.error('Erro ao buscar centros:', error);
    throw error;
  }
}
