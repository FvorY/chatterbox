<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
    <!-- Decorative background elements -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/20 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>

    <div class="w-full max-w-md glass p-8 rounded-3xl animate-fade-in z-10">
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-lg shadow-primary-600/30">
          <MessageCircle class="text-white w-8 h-8" />
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">ChatterBox</h1>
        <p class="text-slate-400">Connect with style and speed</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
          <div class="relative">
            <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              v-model="email" 
              type="email" 
              placeholder="name@example.com"
              required
              class="w-full bg-slate-900/50 border border-slate-700 text-white pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Password</label>
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              v-model="password" 
              type="password" 
              placeholder="••••••••"
              required
              class="w-full bg-slate-900/50 border border-slate-700 text-white pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <button 
          type="submit"
          :disabled="!isValid"
          class="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl shadow-lg shadow-primary-600/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Sign In
        </button>
      </form>

      <div class="mt-8 pt-8 border-t border-slate-800 text-center">
        <p class="text-slate-500 text-sm">
          Experience the next generation of messaging
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { MessageCircle, Mail, Lock } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const isValid = computed(() => email.value.length > 0 && password.value.length > 0)

const handleLogin = () => {
  if (isValid.value) {
    authStore.login(email.value)
    router.push('/')
  }
}
</script>
