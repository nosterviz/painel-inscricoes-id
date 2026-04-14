import { useState, useEffect, useCallback, useRef } from 'react';

const ENDPOINT = 'https://script.google.com/macros/s/AKfycbyHxHZLcBgLaEkxFCCkSEbW94Y6wiguOBb-zYLkqFUd22kBSJbzdjDKEkglGPor_FhJSg/exec';
const REFRESH_INTERVAL = 30000;
const TIMEOUT_DURATION = 10000;

interface RegistrationData {
  inscritos: number;
  nomes: string[];
}

interface UseRegistrationsReturn {
  data: RegistrationData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

export function useRegistrations(): UseRegistrationsReturn {
  const [data, setData] = useState<RegistrationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const timerRef = useRef<any>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

    try {
      const response = await fetch(ENDPOINT, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Servidor respondeu com status ${response.status}`);
      }

      const json = await response.json();
      
      const count = Number(json.inscritos);
      if (isNaN(count)) {
        throw new Error("Formato de resposta inesperado do servidor (campo 'inscritos' inválido)");
      }

      setData({
        inscritos: count,
        nomes: Array.isArray(json.nomes) ? json.nomes : []
      });
      setLastUpdated(new Date());
      setError(null);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError("O servidor demorou demais para responder. Tentando novamente em breve...");
      } else {
        setError(err.message || "Erro desconhecido ao carregar dados");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    timerRef.current = setInterval(fetchData, REFRESH_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh: fetchData
  };
}
