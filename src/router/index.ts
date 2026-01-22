import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: () => import('../views/LoginView.vue'),
            meta: { requiresAuth: false }
        },
        {
            path: '/',
            name: 'Home',
            component: () => import('../views/HomeView.vue'),
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'ChatPlaceholder',
                    component: () => import('../views/ChatPlaceholder.vue')
                },
                {
                    path: 'chat/:id',
                    name: 'ChatDetail',
                    component: () => import('../views/ChatDetailView.vue'),
                    props: true
                }
            ]
        }
    ]
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login')
    } else if (to.name === 'Login' && authStore.isAuthenticated) {
        next('/')
    } else {
        next()
    }
})

export default router
