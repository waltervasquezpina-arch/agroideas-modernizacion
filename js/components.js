/**
 * components.js
 * Centralized system to inject shared UI components (Header/Footer)
 * across the AGROIDEAS Modernization Portal.
 */

const components = {
    header: `
    <header class="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all duration-300" id="navbar">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <div class="flex items-center space-x-4 cursor-pointer" onclick="window.location.href='index.html'">
                    <img src="images/Logo_AGROIDEAS.jpg" alt="Logo AGROIDEAS" class="h-12 w-auto object-contain bg-white p-1 rounded-lg">
                    <div>
                        <span class="text-lg font-bold text-blue-900 tracking-tight block leading-none">Unidad de Planeamiento y Presupuesto</span>
                        <p class="text-[9px] text-slate-500 font-bold tracking-widest uppercase leading-none mt-1">Agroideas - MIDAGRI</p>
                    </div>
                </div>

                <!-- Desktop Navigation -->
                <div class="hidden md:flex items-center space-x-8">
                    <a href="index.html" class="text-slate-600 hover:text-blue-700 font-medium transition-colors text-sm uppercase tracking-wider">Inicio</a>
                    
                    <div class="relative group">
                        <button class="flex items-center space-x-1 text-slate-600 group-hover:text-blue-700 font-medium transition-colors text-sm uppercase tracking-wider">
                            <span>Ejes de Gestión</span>
                            <i data-lucide="chevron-down" class="w-4 h-4 transition-transform group-hover:rotate-180"></i>
                        </button>
                        <!-- Dropdown Menu -->
                        <div class="absolute right-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                            <div class="bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 grid gap-1">
                                <a href="gestion_conocimiento.html" class="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item">
                                    <div class="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                                        <i data-lucide="book-open" class="w-5 h-5"></i>
                                    </div>
                                    <span class="text-sm font-semibold text-slate-700">Gestión del Conocimiento</span>
                                </a>
                                <a href="gestion_procesos.html" class="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item">
                                    <div class="p-2 bg-green-50 text-green-600 rounded-lg group-hover/item:bg-green-600 group-hover/item:text-white transition-colors">
                                        <i data-lucide="settings-2" class="w-5 h-5"></i>
                                    </div>
                                    <span class="text-sm font-semibold text-slate-700">Gestión por Procesos</span>
                                </a>
                                <a href="gestion_calidad.html" class="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item">
                                    <div class="p-2 bg-red-50 text-red-600 rounded-lg group-hover/item:bg-red-600 group-hover/item:text-white transition-colors">
                                        <i data-lucide="award" class="w-5 h-5"></i>
                                    </div>
                                    <span class="text-sm font-semibold text-slate-700">Gestión de Calidad</span>
                                </a>
                                <a href="gestion_innovacion.html" class="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item">
                                    <div class="p-2 bg-amber-50 text-amber-600 rounded-lg group-hover/item:bg-amber-600 group-hover/item:text-white transition-colors">
                                        <i data-lucide="lightbulb" class="w-5 h-5"></i>
                                    </div>
                                    <span class="text-sm font-semibold text-slate-700">Innovación Pública</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <a href="doc_gestion.html" class="text-slate-600 hover:text-blue-700 font-medium transition-colors text-sm uppercase tracking-wider">Documentos</a>
                    <a href="contacto.html" class="text-slate-600 hover:text-blue-700 font-medium transition-colors text-sm uppercase tracking-wider">Contacto</a>
                    <a href="repositorio.html" class="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg shadow-blue-200 text-sm tracking-wide">Repositorio</a>
                </div>

                <!-- Mobile menu button -->
                <div class="md:hidden">
                    <button id="mobile-menu-button" class="text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors">
                        <i data-lucide="menu" class="w-7 h-7"></i>
                    </button>
                </div>
            </div>
        </nav>

        <!-- Mobile Navigation Overlay -->
        <div id="mobile-menu" class="hidden md:hidden bg-white border-t border-slate-100 px-4 py-6 space-y-4">
            <a href="index.html" class="block text-lg font-semibold text-slate-700">Inicio</a>
            <div class="space-y-2 pl-4 border-l-2 border-slate-100">
                <p class="text-xs uppercase font-bold text-slate-400 tracking-widest">Ejes</p>
                <a href="gestion_conocimiento.html" class="block text-slate-600 py-1">Gestión del Conocimiento</a>
                <a href="gestion_procesos.html" class="block text-slate-600 py-1">Gestión por Procesos</a>
                <a href="gestion_calidad.html" class="block text-slate-600 py-1">Gestión de Calidad</a>
                <a href="gestion_innovacion.html" class="block text-slate-600 py-1">Innovación Pública</a>
            </div>
            <a href="doc_gestion.html" class="block text-lg font-semibold text-slate-700">Documentos</a>
            <a href="contacto.html" class="block text-lg font-semibold text-slate-700">Contacto</a>
            <a href="repositorio.html" class="block text-lg font-semibold text-blue-700">Repositorio</a>
        </div>
    </header>
    `,
    footer: `
    <footer class="bg-slate-950 text-slate-500 py-12 border-t border-white/5">
        <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="flex flex-col items-center md:items-start gap-1">
                <span class="text-white font-bold tracking-tight uppercase text-sm">Unidad de Planeamiento y Presupuesto</span>
                <span class="text-xs opacity-60 uppercase tracking-widest">Agroideas - MIDAGRI</span>
            </div>
            <div class="flex flex-col items-center md:items-end gap-1 text-xs">
                <p>Última actualización: <span id="current-date-footer" class="text-slate-300 font-semibold"></span></p>
                <p class="opacity-50">&copy; 2026 AGROIDEAS - Programa de Compensaciones para la Competitividad</p>
            </div>
        </div>
    </footer>
    `
};

document.addEventListener('DOMContentLoaded', () => {
    // Inject Header
    const headerElement = document.querySelector('header');
    if (headerElement) {
        headerElement.outerHTML = components.header;
    }

    // Inject Footer
    const footerElement = document.querySelector('footer');
    if (footerElement) {
        footerElement.outerHTML = components.footer;
    }

    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('bg-white/95', 'shadow-xl', 'py-1');
            navbar.classList.remove('bg-white/80', 'py-0');
        } else {
            navbar.classList.remove('bg-white/95', 'shadow-xl', 'py-1');
            navbar.classList.add('bg-white/80', 'py-0');
        }
    });

    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    // Dynamic Date Function
    const updateFooterDate = () => {
        const dateEl = document.getElementById('current-date-footer');
        if (dateEl) {
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();
            dateEl.textContent = `${day}/${month}/${year}`;
        }
    };
    updateFooterDate();
});
