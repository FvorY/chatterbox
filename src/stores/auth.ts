import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<{ email: string; name: string; avatar: string } | null>(null)

    const isAuthenticated = computed(() => !!user.value)

    function login(email: string) {
        const rawName = email.split('@')[0]
        const name = rawName
            .split(/[._-]/)
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ')

        user.value = {
            email,
            name,
            avatar: `https://i.pravatar.cc/150?u=${email}`
        }
    }

    function logout() {
        user.value = null
    }

    return { user, isAuthenticated, login, logout }
})
