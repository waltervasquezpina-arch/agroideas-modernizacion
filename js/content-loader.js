/**
 * content-loader.js
 * Utilidad para cargar contenido dinámico desde data/content.json.
 */

const contentLoader = {
    data: null,

    async init() {
        try {
            const response = await fetch('data/content.json');
            if (response.ok) {
                this.data = await response.json();
                return this.data;
            }
        } catch (error) {
            console.error("Error cargando content.json:", error);
        }
        return null;
    },

    /**
     * Carga el contenido de una sección técnica (Eje de Gestión).
     * @param {string} sectionId - ID de la sección (ej: 'gestion-conocimiento')
     */
    async loadSection(sectionId) {
        if (!this.data) await this.init();
        if (!this.data) return;

        const section = this.data.sections.find(s => s.id === sectionId);
        if (!section) return;

        // 1. Definición y Finalidad
        const defEl = document.querySelector('#definition p');
        const purpEl = document.querySelector('#purpose p');
        if (defEl) defEl.innerText = section.definition;
        if (purpEl) purpEl.innerText = section.purpose;

        // 2. Fases / Actividades
        const phasesContainer = document.querySelector('#phases .grid');
        if (phasesContainer && section.phases) {
            phasesContainer.innerHTML = section.phases.map(p => `
                <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow group">
                    <h4 class="font-bold text-slate-900 mb-2 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                        <i data-lucide="${p.icon}" class="w-5 h-5 text-blue-600"></i> ${p.title}
                    </h4>
                    <p class="text-sm text-slate-500 leading-relaxed">${p.description}</p>
                </div>
            `).join('');
        }

        // 3. Roles
        const rolesContainer = document.querySelector('#roles .grid');
        if (rolesContainer && section.roles) {
            rolesContainer.innerHTML = section.roles.map(r => `
                <div class="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                    <h4 class="font-bold text-blue-400 mb-2">${r.role}</h4>
                    <p class="text-slate-400 text-sm leading-relaxed">${r.description}</p>
                </div>
            `).join('');
        }

        // 4. Video
        const videoTitle = document.querySelector('#multimedia p.text-lg.font-bold');
        if (videoTitle) videoTitle.innerText = section.video_title || section.title;

        // Re-inicializar iconos
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    /**
     * Carga las cards de documentos.
     */
    async loadDocuments(containerId) {
        if (!this.data) await this.init();
        if (!this.data) return;

        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = this.data.documents.map(doc => `
            <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all group" data-aos="fade-up">
                <div class="flex items-start justify-between mb-8">
                    <div class="w-16 h-16 bg-${doc.color}-50 text-${doc.color}-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-${doc.color}-100/50">
                        <i data-lucide="${doc.icon}" class="w-8 h-8"></i>
                    </div>
                </div>
                <h3 class="text-2xl font-black text-slate-900 mb-2 tracking-tight">${doc.title}</h3>
                <p class="text-slate-500 font-medium mb-8 text-sm leading-relaxed">${doc.subtitle}</p>
                <div class="space-y-3">
                    ${doc.links.map(link => `
                        <a href="${link.url}" class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-${doc.color}-50 text-slate-600 hover:text-${doc.color}-700 transition-all font-bold text-xs group/link">
                            <span class="flex items-center gap-3">
                                <i data-lucide="${link.icon || 'file-text'}" class="w-4 h-4"></i>
                                ${link.text}
                            </span>
                            <div class="flex items-center gap-2">
                                ${link.badge ? `<span class="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-[8px] uppercase font-black">${link.badge}</span>` : ''}
                                <i data-lucide="download-cloud" class="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity"></i>
                            </div>
                        </a>
                    `).join('')}
                    ${doc.links.length === 0 ? '<p class="text-[10px] text-slate-400 italic">No hay documentos disponibles aún.</p>' : ''}
                </div>
            </div>
        `).join('');

        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    /**
     * Carga las tablas del repositorio.
     */
    async loadRepository() {
        if (!this.data) await this.init();
        if (!this.data) return;

        // 1. Directivas (Accordion)
        const accordion = document.getElementById('accordion-directivas');
        if (accordion && this.data.repository.directivas) {
            accordion.innerHTML = this.data.repository.directivas.map((cat, idx) => `
                <div class="accordion-item ${idx === 0 ? 'active' : ''}">
                    <button class="w-full p-6 flex justify-between items-center focus:outline-none hover:bg-slate-50 transition-all group" onclick="toggleAccordion(this)">
                        <span class="font-bold text-slate-700">${cat.title}</span>
                        <i data-lucide="chevron-down" class="w-5 h-5 text-slate-400 transition-transform ${idx === 0 ? 'rotate-180' : ''} chevron-icon"></i>
                    </button>
                    <div class="accordion-content" style="${idx === 0 ? 'max-height: 2000px;' : ''}">
                        <div class="p-0 border-t border-slate-50">
                            ${cat.subsections.map(sub => `
                                <div class="bg-slate-50 text-xs font-black text-slate-400 uppercase tracking-widest p-4 pb-2 border-t border-slate-100">${sub.title}</div>
                                <div class="overflow-x-auto">
                                    <table class="w-full text-left text-sm">
                                        <tbody class="divide-y divide-slate-50">
                                            ${sub.items.length > 0 ? sub.items.map(item => `
                                                <tr class="hover:bg-slate-50/50 transition-colors">
                                                    <td class="p-4 font-bold text-slate-700 w-1/3">${item.title}</td>
                                                    <td class="p-4 text-xs font-mono text-slate-500">${item.code}</td>
                                                    <td class="p-4 text-xs text-slate-600">${item.date}</td>
                                                    <td class="p-4 text-center">
                                                        <a href="${item.url}" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"><i data-lucide="file-type-2" class="w-6 h-6"></i></a>
                                                    </td>
                                                </tr>
                                            `).join('') : `
                                                <tr>
                                                    <td class="p-4 text-slate-400 italic">No desarrollado / Sin registros</td>
                                                    <td class="p-4 text-slate-400 font-mono text-xs">---</td>
                                                    <td class="p-4 text-slate-400 text-xs">-/-/-</td>
                                                    <td class="p-4 text-center">---</td>
                                                </tr>
                                            `}
                                        </tbody>
                                    </table>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // 2. Innovadora (Tablas de Innovación)
        const innovTables = this.data.repository.innovacion_tablas;
        if (innovTables) {
            this.renderInnovTable('fichas_iniciativa', ['Nº', 'Nombre Iniciativa', 'CODIGO', 'Descripción del Problema', 'Justificación', 'Link']);
            this.renderInnovTable('reportes_evaluacion', ['Nº', 'Nombre Iniciativa', 'CODIGO', 'Unidades', 'Resultado', 'Link']);
            this.renderInnovTable('fichas_innovacion', ['Nº', 'Nombre Iniciativa', 'CODIGO', 'Categoría', 'Resultado Esperado', 'Link']);
        }

        // 3. Publicaciones UPP
        const pubBody = document.querySelector('#repoTable tbody');
        if (pubBody && this.data.repository.publicaciones_upp) {
            // Destruir DataTable si ya existe para evitar errores al re-inyectar
            if ($.fn.DataTable.isDataTable('#repoTable')) {
                $('#repoTable').DataTable().destroy();
            }

            pubBody.innerHTML = this.data.repository.publicaciones_upp.map(p => `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="p-6">
                        <div class="font-bold text-slate-900">${p.title}</div>
                        <div class="text-xs text-slate-500 mt-1 uppercase tracking-tight font-medium">${p.desc}</div>
                    </td>
                    <td class="p-6">
                        <span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg border border-slate-200 text-[10px] font-black">${p.category}</span>
                    </td>
                    <td class="p-6">
                        <span class="px-3 py-1 bg-${p.status==='Validado'?'blue':'green'}-100 text-${p.status==='Validado'?'blue':'green'}-700 text-[10px] font-black rounded-full uppercase">${p.status}</span>
                    </td>
                    <td class="p-6 text-center">
                        <a href="${p.url}" class="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all inline-flex">
                            <i data-lucide="download" class="w-5 h-5"></i>
                        </a>
                    </td>
                </tr>
            `).join('');

            // Intentar re-inicializar si la función global initRepoTable existe (la crearé en repositorio.html)
            if (window.initRepoTable) {
                window.initRepoTable();
            }
        }

        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    renderInnovTable(key, headers) {
        const body = document.querySelector(`[data-innov-table="${key}"] tbody`);
        if (!body) return;
        const data = this.data.repository.innovacion_tablas[key];
        body.innerHTML = data.map(row => `
            <tr class="hover:bg-slate-50/50 transition-colors">
                <td class="p-6 font-bold text-slate-400">${row.id}</td>
                <td class="p-6 font-bold text-slate-900">${row.name}</td>
                <td class="p-6"><span class="px-2 py-1 bg-slate-100 text-slate-600 rounded border border-slate-200 text-xs font-mono">${row.code}</span></td>
                <td class="p-6 text-slate-500 max-w-xs">${row.problem || row.units || row.category}</td>
                <td class="p-6 text-slate-500 max-w-xs">${row.justification || row.result || row.expected}</td>
                <td class="p-6 text-center"><a href="${row.url}" class="text-red-600 hover:scale-110 transition-transform inline-block"><i data-lucide="file-type-2" class="w-7 h-7"></i></a></td>
            </tr>
        `).join('');
    }
};

// Modificación del listener inicial para soportar repositorio
document.addEventListener('DOMContentLoaded', () => {
    const pageId = document.body.dataset.pageId;
    if (pageId) {
        if (pageId === 'repositorio') {
            contentLoader.loadRepository();
        } else {
            contentLoader.loadSection(pageId);
        }
    }
});
