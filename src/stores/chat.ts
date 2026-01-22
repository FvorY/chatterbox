import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Message {
    id: string
    content: string
    senderId: string
    timestamp: Date
}

export interface Chat {
    id: string
    userId: string
    userName: string
    avatar: string
    lastMessage: string
    unreadCount: number
    status: 'online' | 'offline'
    lastSeen?: string
}

export const useChatStore = defineStore('chat', () => {
    const chats = ref<Chat[]>([])
    const messages = ref<Record<string, Message[]>>({})
    const searchQuery = ref('')

    const filteredChats = computed(() => {
        if (!searchQuery.value) return chats.value
        const query = searchQuery.value.toLowerCase()
        return chats.value.filter(chat =>
            chat.userName.toLowerCase().includes(query)
        )
    })

    function initDummyData() {
        const names = [
            'John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown', 'Charlie Davis',
            'Eva Wilson', 'Frank Miller', 'Grace Taylor', 'Henry Moore', 'Ivy Anderson',
            'Jack White', 'Kathy Martin', 'Leo Thompson', 'Mia Garcia', 'Noah Rodriguez',
            'Oliver Lee', 'Penny Walker', 'Quinn Hall', 'Riley Young', 'Sofia King'
        ]

        chats.value = names.map((name, index) => ({
            id: `chat-${index}`,
            userId: `user-${index}`,
            userName: name,
            avatar: `https://randomuser.me/api/portraits/${index % 2 === 0 ? 'men' : 'women'}/${index + 10}.jpg`,
            lastMessage: 'Hey, how are you doing?',
            unreadCount: index % 5 === 0 ? 2 : 0,
            status: index % 3 === 0 ? 'online' : 'offline',
            lastSeen: '2 hours ago'
        }))

        // Initialize some dummy messages
        chats.value.forEach(chat => {
            messages.value[chat.id] = [
                {
                    id: `m-${chat.id}-1`,
                    content: 'Hello!',
                    senderId: chat.userId,
                    timestamp: new Date(Date.now() - 1000 * 60 * 60)
                },
                {
                    id: `m-${chat.id}-2`,
                    content: 'Hi there!',
                    senderId: 'me',
                    timestamp: new Date(Date.now() - 1000 * 60 * 30)
                },
                {
                    id: `m-${chat.id}-3`,
                    content: chat.lastMessage,
                    senderId: chat.userId,
                    timestamp: new Date(Date.now() - 1000 * 60 * 5)
                }
            ]
        })
    }

    function sendMessage(chatId: string, content: string) {
        if (!messages.value[chatId]) {
            messages.value[chatId] = []
        }

        const newMessage: Message = {
            id: `m-${Date.now()}`,
            content,
            senderId: 'me',
            timestamp: new Date()
        }

        messages.value[chatId].push(newMessage)

        // Update last message in chat list
        const chat = chats.value.find(c => c.id === chatId)
        if (chat) {
            chat.lastMessage = content
        }
    }

    function markAsRead(chatId: string) {
        const chat = chats.value.find(c => c.id === chatId)
        if (chat) {
            chat.unreadCount = 0
        }
    }

    return { chats, messages, searchQuery, filteredChats, initDummyData, sendMessage, markAsRead }
})
