import { computed, ref } from 'vue'

const STORAGE_KEY = 'pricalica-user-role'
const initialRole =
  typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) ?? '' : ''

const currentUserRole = ref(initialRole)

export function useAuthState() {
  const isAdmin = computed(() => currentUserRole.value === 'admin')

  return {
    currentUserRole,
    isAdmin,
  }
}

export function setCurrentUserRole(role) {
  currentUserRole.value = role

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, role)
  }
}

export function clearCurrentUserRole() {
  currentUserRole.value = ''

  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY)
  }
}

export function getCurrentUserRole() {
  return currentUserRole.value
}
