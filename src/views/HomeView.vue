<template>
  <div class="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
    <!-- Sidebar -->
    <aside 
      class="w-full md:w-96 flex flex-col border-r border-slate-800/50 glass-dark z-20"
      :class="{ 'hidden md:flex': isChatOpen && isMobile }"
    >
      <!-- User Header -->
      <div class="p-4 border-b border-slate-800/50 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="relative">
            <img :src="authStore.user?.avatar" class="w-10 h-10 rounded-full border-2 border-primary-500/30" />
            <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
          </div>
          <div>
            <h2 class="font-semibold text-white leading-tight">{{ authStore.user?.name }}</h2>
            <p class="text-xs text-slate-500 uppercase tracking-wider font-medium">Online</p>
          </div>
        </div>
        <div class="flex items-center space-x-1">
          <button class="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white">
            <MoreVertical class="w-5 h-5" />
          </button>
          <button @click="handleLogout" class="p-2 hover:bg-primary-500/10 rounded-lg transition-colors text-slate-400 hover:text-primary-400">
            <LogOut class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Search -->
      <div class="p-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            v-model="chatStore.searchQuery"
            type="text" 
            placeholder="Search conversations..."
            class="w-full bg-slate-900/50 border border-slate-800/50 text-slate-200 pl-10 pr-4 py-2 rounded-xl focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500/50 outline-none transition-all text-sm"
          />
        </div>
      </div>

      <!-- Chat List -->
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div 
          v-for="chat in chatStore.filteredChats" 
          :key="chat.id"
          @click="selectChat(chat.id)"
          class="px-4 py-3 flex items-center space-x-3 cursor-pointer hover:bg-slate-800/40 transition-all border-l-2 border-transparent"
          :class="{ 'bg-primary-500/10 border-primary-500': currentChatId === chat.id }"
        >
          <div class="relative shrink-0">
            <img :src="chat.avatar" class="w-12 h-12 rounded-full object-cover" />
            <div v-if="chat.status === 'online'" class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-0.5">
              <h3 class="font-medium text-slate-200 truncate">{{ chat.userName }}</h3>
              <span class="text-[10px] text-slate-500 whitespace-nowrap">{{ formatTime(chat.id) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-sm text-slate-400 truncate">{{ chat.lastMessage }}</p>
              <span v-if="chat.unreadCount > 0" class="shrink-0 ml-2 bg-primary-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                {{ chat.unreadCount }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main 
      class="flex-1 flex flex-col relative"
      :class="{ 'hidden md:flex': !isChatOpen && isMobile }"
    >
      <router-view v-slot="{ Component }">
        <transition name="slide">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useChatStore } from '../stores/chat'
import { LogOut, Search, MoreVertical } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const chatStore = useChatStore()

const currentChatId = computed(() => route.params.id as string)
const isChatOpen = computed(() => !!route.params.id)
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const selectChat = (id: string) => {
  router.push(`/chat/${id}`)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

import { formatChatTime } from '../utils/date'

const formatTime = (chatId: string) => {
  const messages = chatStore.messages[chatId]
  if (!messages || messages.length === 0) return ''
  
  const lastMsg = messages[messages.length - 1]
  if (!lastMsg) return ''
  return formatChatTime(new Date(lastMsg.timestamp))
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
