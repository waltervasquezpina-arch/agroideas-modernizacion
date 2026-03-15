/**
 * auth.js
 * Sistema de gestión de autenticación local para AGROIDEAS.
 * Carga usuarios de JSON y gestiona sesión con localStorage.
 */

const authSystem = {
    users: [],
    storageKey: 'agroideas_auth_session',
    usersKey: 'agroideas_registered_users',

    async init() {
        // CORRECCIÓN: Siempre intentar cargar desde JSON para obtener nuevos usuarios registrados
        try {
            const response = await fetch('data/users.json');
            if (response.ok) {
                this.users = await response.json();
                // Actualizamos el cache local por si acaso, pero priorizamos el fetch
                localStorage.setItem(this.usersKey, JSON.stringify(this.users));
            }
        } catch (error) {
            console.error("Error cargando base de datos de usuarios, usando cache local:", error);
            const storedUsers = localStorage.getItem(this.usersKey);
            if (storedUsers) this.users = JSON.parse(storedUsers);
        }

        // 2. Verificar estado de sesión y proteger página
        this.checkAccess();
    },

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            const sessionData = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                timestamp: new Date().getTime()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(sessionData));
            return { success: true, user };
        }
        return { success: false, message: "Credenciales incorrectas" };
    },

    logout() {
        localStorage.removeItem(this.storageKey);
        window.location.reload();
    },

    isLoggedIn() {
        const session = localStorage.getItem(this.storageKey);
        if (!session) return false;
        
        // Opcional: Validar expiración (ej: 24h)
        const data = JSON.parse(session);
        const now = new Date().getTime();
        const expiry = 24 * 60 * 60 * 1000; 
        if (now - data.timestamp > expiry) {
            this.logout();
            return false;
        }
        return true;
    },

    getCurrentUser() {
        const session = localStorage.getItem(this.storageKey);
        return session ? JSON.parse(session) : null;
    },

    checkAccess() {
        const user = this.getCurrentUser();
        const isLoggedIn = this.isLoggedIn();
        
        // 1. Inyectar Overlay si no existe
        if (!isLoggedIn && !document.getElementById('login-overlay')) {
            this.injectLoginOverlay();
        }

        const loginOverlay = document.getElementById('login-overlay');
        // El contenido restringido es generalmente el tag <main>
        const mainContent = document.querySelector('main');
        
        if (isLoggedIn) {
            if (loginOverlay) loginOverlay.classList.add('hidden');
            if (mainContent) mainContent.classList.remove('opacity-0', 'pointer-events-none');
            this.updateHeaderUI();
        } else {
            if (loginOverlay) {
                loginOverlay.classList.remove('hidden');
                loginOverlay.classList.add('flex');
            }
            if (mainContent) mainContent.classList.add('opacity-0', 'pointer-events-none');
            // Asegurar que no haya scroll en el login
            document.body.style.overflow = 'hidden';
        }
    },

    injectLoginOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'login-overlay';
        overlay.className = 'fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4';
        overlay.innerHTML = `
            <div class="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 transform translate-y-0 transition-all duration-500">
                <div class="text-center mb-10">
                    <div class="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-100/50">
                        <i data-lucide="shield-lock" class="w-10 h-10"></i>
                    </div>
                    <h2 class="text-3xl font-black text-slate-900 mb-2 tracking-tight">Acceso Privado</h2>
                    <p class="text-slate-500 font-medium text-sm">Portal exclusivo de Modernización AGROIDEAS.</p>
                </div>

                <form id="login-form-global" class="space-y-6">
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Usuario Institucional</label>
                        <div class="relative">
                            <i data-lucide="mail" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"></i>
                            <input type="email" id="login-email" required class="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-600/10 focus:border-red-600 transition-all font-medium" placeholder="usuario@agroideas.gob.pe">
                        </div>
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Contraseña</label>
                        <div class="relative">
                            <i data-lucide="key" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"></i>
                            <input type="password" id="login-password" required class="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-600/10 focus:border-red-600 transition-all font-medium" placeholder="••••••••">
                        </div>
                    </div>
                    
                    <div id="login-error" class="hidden">
                        <div class="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3">
                            <i data-lucide="alert-circle" class="w-5 h-5"></i>
                            <span>Credenciales inválidas</span>
                        </div>
                    </div>

                    <button type="submit" class="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                        Entrar <i data-lucide="chevron-right" class="w-6 h-6"></i>
                    </button>
                </form>
            </div>
        `;
        document.body.appendChild(overlay);
        
        // Listener del formulario
        document.getElementById('login-form-global').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const pass = document.getElementById('login-password').value;
            const result = this.login(email, pass);
            if (result.success) {
                window.location.reload(); 
            } else {
                document.getElementById('login-error').classList.remove('hidden');
            }
        });

        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    updateHeaderUI() {
        if (!this.isLoggedIn()) return;
        
        const user = this.getCurrentUser();
        
        const injectUI = () => {
            // 1. Escritorio: Badge y Botón Admin
            const navContainer = document.querySelector('header nav .hidden.md\\:flex.items-center.space-x-8');
            if (navContainer && !document.getElementById('user-profile-badge')) {
                const adminBtn = user.role === 'admin' ? `
                    <a href="admin.html" class="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-bold transition-colors text-xs uppercase tracking-wider group">
                        <i data-lucide="layout-dashboard" class="w-4 h-4 group-hover:scale-110 transition-transform"></i>
                        <span>Panel Admin</span>
                    </a>
                ` : '';

                const badge = document.createElement('div');
                badge.id = 'user-profile-badge';
                badge.className = 'flex items-center gap-6 pl-6 border-l border-slate-200 ml-4 animate-in fade-in slide-in-from-right-4';
                badge.innerHTML = `
                    ${adminBtn}
                    <div class="flex flex-col items-end hidden lg:flex">
                        <span class="text-[10px] font-black uppercase text-slate-400 leading-none">Usuario</span>
                        <span class="text-xs font-bold text-slate-900 leading-tight">${user.name}</span>
                    </div>
                    <button onclick="authSystem.logout()" class="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-xl text-xs font-black uppercase hover:bg-red-600 hover:text-white transition-all shadow-sm shadow-red-100">
                        <i data-lucide="log-out" class="w-4 h-4"></i>
                        <span>Salir</span>
                    </button>
                `;
                navContainer.appendChild(badge);
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }

            // 2. Móvil: Botón Admin
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && user.role === 'admin' && !document.getElementById('mobile-admin-link')) {
                const adminMobile = document.createElement('a');
                adminMobile.id = 'mobile-admin-link';
                adminMobile.href = 'admin.html';
                adminMobile.className = 'block text-lg font-bold text-blue-700 bg-blue-50 p-4 rounded-2xl flex items-center gap-3';
                adminMobile.innerHTML = `
                    <i data-lucide="layout-dashboard" class="w-6 h-6"></i>
                    Panel Administración
                `;
                // Insertar antes del botón de Cerrar Sesión si existiera, o al final
                mobileMenu.appendChild(adminMobile);
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        };

        injectUI();
        const observer = new MutationObserver(() => injectUI());
        observer.observe(document.body, { childList: true, subtree: true });
    }
};

// Auto-inicialización
document.addEventListener('DOMContentLoaded', () => authSystem.init());
