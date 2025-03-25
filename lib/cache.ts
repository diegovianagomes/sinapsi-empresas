import NodeCache from 'node-cache';

// Configuração do cache com tempo de expiração de 5 minutos
export const cache = new NodeCache({
  stdTTL: 300, // 5 minutos em segundos
  checkperiod: 60, // Checar expiração a cada 1 minuto
});

// Função para obter dados do cache
export function getCacheData<T>(key: string): T | undefined {
  return cache.get<T>(key);
}

// Função para definir dados no cache
export function setCacheData<T>(key: string, data: T, ttl?: number): boolean {
  return cache.set(key, data, ttl);
}

// Função para remover dados do cache
export function removeCacheData(key: string): number {
  return cache.del(key);
}

// Função para limpar todo o cache
export function clearCache(): void {
  cache.flushAll();
}

// Função para gerar uma chave de cache baseada em parâmetros
export function generateCacheKey(prefix: string, params?: Record<string, any>): string {
  if (!params) return prefix;
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('|');
  return `${prefix}:${sortedParams}`;
}