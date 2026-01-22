<template>
  <div class="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-900/20">
    <div class="w-20 h-20 bg-primary-600/10 rounded-full flex items-center justify-center mb-6 animate-bounce">
      <MessageCircle class="w-10 h-10 text-primary-500" />
    </div>
    <h2 class="text-2xl font-bold text-white mb-2">Your Conversations</h2>
    <p class="text-slate-400 max-w-xs mx-auto">
      Select a chat from the sidebar to start messaging with style.
    </p>
  </div>
</template>

<script setup lang="ts">
import { MessageCircle } from 'lucide-vue-next'
</script>
