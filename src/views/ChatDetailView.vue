<template>
  <div class="flex-1 flex flex-col h-full bg-slate-900/30 overflow-hidden" v-if="chat">
    <!-- Header -->
    <header class="h-16 shrink-0 border-b border-slate-800/50 glass-dark px-4 flex items-center justify-between z-10">
      <div class="flex items-center space-x-3">
        <button @click="router.push('/')" class="md:hidden p-2 -ml-2 hover:bg-slate-800 rounded-lg text-slate-400">
          <ArrowLeft class="w-5 h-5" />
        </button>
        <div class="relative">
          <img :src="chat.avatar" class="w-10 h-10 rounded-full object-cover border border-slate-700" />
          <div v-if="chat.status === 'online'" class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full"></div>
        </div>
        <div>
          <h2 class="font-semibold text-white leading-tight">{{ chat.userName }}</h2>
          <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            {{ chat.status === 'online' ? 'Active Now' : 'Last seen ' + chat.lastSeen }}
          </p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button class="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-primary-400">
          <Phone class="w-5 h-5" />
        </button>
        <button class="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-primary-400">
          <Video class="w-5 h-5" />
        </button>
        <button class="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-primary-400">
          <MoreVertical class="w-5 h-5" />
        </button>
      </div>
    </header>

    <!-- Messages Container -->
    <div 
      ref="messageContainer"
      class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"
    >
      <div v-for="msg in messages" :key="msg.id" 
        class="flex flex-col animate-slide-in"
        :class="msg.senderId === 'me' ? 'items-end' : 'items-start'"
      >
        <div 
          class="max-w-[75%] md:max-w-[60%] px-4 py-2.5 rounded-2xl text-sm shadow-sm"
          :class="msg.senderId === 'me' 
            ? 'bg-primary-600 text-white rounded-tr-none' 
            : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'"
        >
          <p class="leading-relaxed">{{ msg.content }}</p>
        </div>
        <span class="text-[10px] text-slate-500 mt-1 px-1">
          {{ formatMessageTime(msg.timestamp) }}
        </span>
      </div>
    </div>

    <!-- Input Area -->
    <footer class="p-4 border-t border-slate-800/50 glass-dark">
      <form @submit.prevent="handleSendMessage" class="flex items-center space-x-3">
        <button type="button" class="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
          <PlusCircle class="w-6 h-6" />
        </button>
        <div class="flex-1 relative">
          <input 
            v-model="newMessage"
            type="text" 
            placeholder="Type a message..."
            class="w-full bg-slate-900 border border-slate-700/50 text-slate-200 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-primary-500/50 focus:border-transparent outline-none transition-all"
          />
          <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary-400 transition-colors">
            <Smile class="w-5 h-5" />
          </button>
        </div>
        <button 
          type="submit"
          :disabled="!newMessage.trim()"
          class="p-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:bg-slate-800 text-white rounded-2xl transition-all shadow-lg shadow-primary-600/20 active:scale-90"
        >
          <Send class="w-5 h-5" />
        </button>
      </form>
    </footer>
  </div>
  <div v-else class="flex-1 flex items-center justify-center">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '../stores/chat'
import { 
  ArrowLeft, Phone, Video, MoreVertical, 
  PlusCircle, Smile, Send 
} from 'lucide-vue-next'

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const chatStore = useChatStore()
const newMessage = ref('')
const messageContainer = ref<HTMLElement | null>(null)

const chat = computed(() => chatStore.chats.find(c => c.id === props.id))
const messages = computed(() => chatStore.messages[props.id] || [])

const scrollToBottom = async () => {
  await nextTick()
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

onMounted(() => {
  chatStore.markAsRead(props.id)
  scrollToBottom()
})

watch(() => props.id, (newId) => {
  chatStore.markAsRead(newId)
  scrollToBottom()
})

watch(() => messages.value.length, () => {
  scrollToBottom()
})

const handleSendMessage = () => {
  if (newMessage.value.trim()) {
    chatStore.sendMessage(props.id, newMessage.value.trim())
    newMessage.value = ''
  }
}

const formatMessageTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
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
</style>
