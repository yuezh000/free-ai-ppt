export type AuthSession = {
  token: string;
  expires_at: string;
  user: { id: string; email: string };
  password_set: boolean;
  is_admin?: boolean;
};

export const AUTH_STORAGE_KEY = "freeppt-auth";
export const AUTH_OPEN_EVENT = "freeaippt:open-auth";
export const AUTH_CHANGED_EVENT = "freeaippt:auth-changed";

export function readAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthSession;
    if (!session.token || !session.user?.email || new Date(session.expires_at) <= new Date()) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function saveAuthSession(session: AuthSession) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT, { detail: session }));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
}

export function openAuthDialog() {
  window.dispatchEvent(new CustomEvent(AUTH_OPEN_EVENT));
}
