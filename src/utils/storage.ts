const WELCOME_KEY = 'gg-welcome-seen'
const WELCOME_USER_SESSION_KEY = 'gg-welcome-user-session'

export function hasSeenWelcome(): boolean {
  return localStorage.getItem(WELCOME_KEY) === 'true'
}

export function markWelcomeSeen(): void {
  localStorage.setItem(WELCOME_KEY, 'true')
}

export function hasWelcomeUserThisSession(): boolean {
  return sessionStorage.getItem(WELCOME_USER_SESSION_KEY) === 'true'
}

export function markWelcomeUserThisSession(): void {
  sessionStorage.setItem(WELCOME_USER_SESSION_KEY, 'true')
}

export function clearWelcomeUserSession(): void {
  sessionStorage.removeItem(WELCOME_USER_SESSION_KEY)
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
