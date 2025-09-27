export function getTenantFromCookie() {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(/(?:^|; )tenant=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function getTenant() {
  // Prefer cookie set by middleware
  const fromCookie = getTenantFromCookie();
  // If cookie is just 'localhost' but we're on a port, prefer full host
  if (fromCookie && fromCookie !== 'localhost') return fromCookie;
  // Fallback to localStorage for legacy flows
  try {
    const ls = localStorage.getItem('tenant');
    if (ls) return ls;
  } catch (_) {}
  // On localhost, use full host including port
  if (typeof location !== 'undefined' && location.hostname === 'localhost') {
    return location.port ? `localhost:${location.port}` : 'localhost';
  }
  return undefined;
}

export function getServerTenant(headers) {
  // For server components: read from cookie header or host
  const cookie = headers.get?.('cookie') || '';
  const hostHeader = headers.get?.('host') || '';
  const cookieMatch = cookie.match(/(?:^|; )tenant=([^;]+)/);
  if (cookieMatch) {
    const c = decodeURIComponent(cookieMatch[1]);
    if (c && c !== 'localhost') return c;
  }
  const [hostName, hostPort] = hostHeader.split(':');
  const host = hostName.replace(/^www\./i, '');
  if (host && !host.includes('localhost')) return host;
  // On localhost, return host including port
  if (host.includes('localhost')) return hostPort ? `localhost:${hostPort}` : 'localhost';
  return undefined;
}


