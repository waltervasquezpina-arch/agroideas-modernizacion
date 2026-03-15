/**
 * admin-logic.js
 * Lógica de gestión para el dashboard administrativo.
 */

let contentData = null;
let usersData = null;
let currentTab = 'sections'; // 'sections', 'documents', 'repository', 'users'
let editingId = null;
let currentSubRepo = 'directivas';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Verificar acceso
    const user = authSystem.getCurrentUser();
    if (!user || user.role !== 'admin') {
        if (user && user.role !== 'admin') {
            alert('Acceso restringido: Solo para administradores.');
            window.location.href = 'index.html';
        }
        return;
    }

    // Mostrar el dashboard si es admin
    const adminView = document.getElementById('admin-view');
    adminView.classList.remove('opacity-0', 'pointer-events-none');
    
    // Actualizar UI de usuario
    document.getElementById('user-display-name').innerText = user.name;
    document.getElementById('user-display-role').innerText = user.role.toUpperCase();

    // 2. Cargar datos
    await loadAllData();
    
    // 3. Inicializar primer tab
    switchTab('sections');
    lucide.createIcons();
});

const STORAGE_KEY_CONTENT = 'agro_content_data';
const STORAGE_KEY_USERS = 'agro_users_data';

async function loadAllData() {
    try {
        const localContent = localStorage.getItem(STORAGE_KEY_CONTENT);
        const localUsers = localStorage.getItem(STORAGE_KEY_USERS);

        if (localContent && localUsers) {
            contentData = JSON.parse(localContent);
            usersData = JSON.parse(localUsers);
            console.log("Cargado desde LocalStorage");
        } else {
            console.log("LocalStorage vacío. Cargando desde archivos JSON...");
            const [resContent, resUsers] = await Promise.all([
                fetch('data/content.json'),
                fetch('data/users.json')
            ]);
            contentData = await resContent.json();
            usersData = await resUsers.json();
            
            // Guardar copia inicial
            syncToLocalStorage();
        }
    } catch (e) {
        console.error("Error cargando archivos:", e);
        showToast("Error al cargar datos. Verifique los archivos JSON.", "error");
    }
}

function syncToLocalStorage() {
    localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(contentData));
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(usersData));
}

// --- Navegación ---
function switchTab(tabId) {
    currentTab = tabId;
    
    // UI Sidebar
    document.querySelectorAll('nav button').forEach(btn => {
        btn.classList.remove('bg-red-600', 'text-white');
        btn.classList.add('hover:bg-slate-800', 'hover:text-white', 'text-slate-300');
    });
    document.getElementById(`nav-${tabId}`).classList.remove('hover:bg-slate-800', 'hover:text-white', 'text-slate-300');
    document.getElementById(`nav-${tabId}`).classList.add('bg-red-600', 'text-white');

    // Título de página
    const titles = {
        'sections': 'Secciones Técnicas (Ejes de Gestión)',
        'documents': 'Documentos Destacados (Cards)',
        'repository': 'Repositorio Institucional',
        'users': 'Gestión de Usuarios'
    };
    document.getElementById('page-title').innerText = titles[tabId];

    renderTabContent();
}

// --- Renderizadores ---
function renderTabContent() {
    const container = document.getElementById('content-area');
    container.innerHTML = '';
    
    if (currentTab === 'sections') renderSections(container);
    else if (currentTab === 'documents') renderDocuments(container);
    else if (currentTab === 'repository') renderRepository(container);
    else if (currentTab === 'users') renderUsers(container);

    lucide.createIcons();
}

function renderSections(container) {
    const html = generateTableHeader(['ID', 'Título', 'Definición', 'Acciones']);
    const rows = contentData.sections.map(s => `
        <tr class="hover:bg-slate-50 transition-colors">
            <td class="px-6 py-4 text-xs font-mono text-slate-400 capitalize">${s.id}</td>
            <td class="px-6 py-4 text-sm font-bold text-slate-700">${s.title}</td>
            <td class="px-6 py-4 text-sm text-slate-500 truncate max-w-xs">${s.definition}</td>
            <td class="px-6 py-4">
                <button onclick="openModal('${s.id}')" class="text-slate-400 hover:text-blue-600 p-1"><i data-lucide="edit-3" class="w-4 h-4"></i></button>
            </td>
        </tr>
    `).join('');
    
    container.innerHTML = html + `<tbody class="divide-y divide-slate-100">${rows}</tbody></table>`;
}

function renderDocuments(container) {
    const html = generateTableHeader(['Icono', 'Título', 'Subtítulo', 'Color', 'Acciones']);
    const rows = contentData.documents.map(d => `
        <tr class="hover:bg-slate-50 transition-colors">
            <td class="px-6 py-4"><i data-lucide="${d.icon}" class="w-5 h-5 text-slate-400"></i></td>
            <td class="px-6 py-4 text-sm font-bold text-slate-700">${d.title}</td>
            <td class="px-6 py-4 text-sm text-slate-500">${d.subtitle}</td>
            <td class="px-6 py-4"><span class="px-2 py-1 bg-${d.color}-100 text-${d.color}-700 text-[10px] font-bold rounded-full uppercase">${d.color}</span></td>
            <td class="px-6 py-4">
                <button onclick="openModal('${d.id}')" class="text-slate-400 hover:text-blue-600 p-1"><i data-lucide="edit-3" class="w-4 h-4"></i></button>
            </td>
        </tr>
    `).join('');
    
    container.innerHTML = html + `<tbody class="divide-y divide-slate-100">${rows}</tbody></table>`;
}

function renderRepository(container) {
    container.innerHTML = `
        <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-6">
            <button onclick="updateSubRepo('directivas')" class="text-sm font-bold ${currentSubRepo==='directivas'?'text-red-600 border-b-2 border-red-600':'text-slate-400'} pb-1 flex items-center gap-2">
                <i data-lucide="landmark" class="w-4 h-4"></i> Directivas
            </button>
            <button onclick="updateSubRepo('innovacion')" class="text-sm font-bold ${currentSubRepo==='innovacion'?'text-red-600 border-b-2 border-red-600':'text-slate-400'} pb-1 flex items-center gap-2">
                <i data-lucide="lightbulb" class="w-4 h-4"></i> Innovación
            </button>
            <button onclick="updateSubRepo('publicaciones')" class="text-sm font-bold ${currentSubRepo==='publicaciones'?'text-red-600 border-b-2 border-red-600':'text-slate-400'} pb-1 flex items-center gap-2">
                <i data-lucide="book-open" class="w-4 h-4"></i> Publicaciones UPP
            </button>
        </div>
        <div id="sub-repo-content" class="overflow-x-auto"></div>
    `;
    
    const subContainer = document.getElementById('sub-repo-content');
    if (currentSubRepo === 'directivas') renderDirectivas(subContainer);
    else if (currentSubRepo === 'innovacion') renderInnovacion(subContainer);
    else if (currentSubRepo === 'publicaciones') renderPublicaciones(subContainer);
    
    lucide.createIcons();
}

function updateSubRepo(sub) {
    currentSubRepo = sub;
    renderTabContent();
}

function renderDirectivas(container) {
    let html = '';
    contentData.repository.directivas.forEach(cat => {
        html += `
            <div class="p-6 border-b border-slate-100 bg-slate-50/30">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                        <i data-lucide="folder" class="w-4 h-4 text-red-600"></i> ${cat.title}
                    </h3>
                    <button onclick="openNewSubSectionModal('${cat.id}')" class="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center gap-1 shadow-sm transition-all active:scale-95">
                        <i data-lucide="plus" class="w-3 h-3 text-red-600"></i> Nueva Subsección
                    </button>
                </div>
                
                <div class="space-y-6">
                    ${cat.subsections.map((sub, sIdx) => `
                        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            <div class="px-5 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center text-xs font-bold text-slate-600">
                                <span class="flex items-center gap-2 italic text-slate-400 uppercase tracking-wider">${sub.title}</span>
                                <div class="flex gap-4">
                                    <button onclick="openNewItemModal('directivas', '${cat.id}', '${sub.title}')" class="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-black uppercase text-[10px]">
                                        <i data-lucide="plus-circle" class="w-4 h-4"></i> Nuevo Registro
                                    </button>
                                    <button onclick="deleteSubSection('${cat.id}', '${sub.title}')" class="text-red-300 hover:text-red-600 transition-colors">
                                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                                    </button>
                                </div>
                            </div>
                            <table class="w-full text-left border-collapse">
                                <thead class="bg-slate-50/50 text-[10px] uppercase font-black text-slate-400 tracking-wider">
                                    <tr>
                                        <th class="px-6 py-3 border-b">Documento</th>
                                        <th class="px-6 py-3 border-b">Código</th>
                                        <th class="px-6 py-3 border-b">Fecha de Publicación</th>
                                        <th class="px-6 py-3 border-b text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-50">
                                    ${sub.items.length === 0 ? `<tr><td colspan="4" class="px-6 py-8 text-center text-slate-400 italic text-xs">Aún no se han registrado documentos en esta subsección</td></tr>` : 
                                      sub.items.map((item, idx) => `
                                        <tr class="hover:bg-slate-50/50 transition-colors">
                                            <td class="px-6 py-3 text-sm text-slate-700 font-bold">${item.title}</td>
                                            <td class="px-6 py-3 text-xs font-mono text-slate-500 bg-slate-50/30">${item.code}</td>
                                            <td class="px-6 py-3 text-xs text-slate-500">${item.date}</td>
                                            <td class="px-6 py-3">
                                                <div class="flex justify-center gap-3">
                                                    <button onclick="openEditItemModal('directivas', '${cat.id}', '${sub.title}', ${idx})" class="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><i data-lucide="edit-3" class="w-4 h-4"></i></button>
                                                    <button onclick="deleteItem('directivas', '${cat.id}', '${sub.title}', ${idx})" class="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `).join('')}
                    ${cat.subsections.length === 0 ? `<div class="p-10 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-400 italic">No hay subsecciones creadas</div>` : ''}
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderInnovacion(container) {
    let html = '';
    const tables = {
        'fichas_iniciativa': { title: '1. Fichas de Iniciativa', icon: 'file-text', headers: ['Iniciativa', 'Código', 'Problema', 'Acciones'] },
        'reportes_evaluacion': { title: '2. Reportes de Evaluación', icon: 'clipboard-check', headers: ['Iniciativa', 'Código', 'Resultado', 'Acciones'] },
        'fichas_innovacion': { title: '3. Fichas de Innovación Final', icon: 'zap', headers: ['Iniciativa', 'Código', 'Categoría', 'Acciones'] }
    };

    Object.keys(tables).forEach(key => {
        const table = tables[key];
        const rows = contentData.repository.innovacion_tablas[key];
        
        html += `
            <div class="p-8 border-b border-slate-100 bg-white">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                        <div class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm"><i data-lucide="${table.icon}" class="w-5 h-5"></i></div>
                        ${table.title}
                    </h3>
                    <button onclick="openNewItemModal('innovacion', '${key}')" class="px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 flex items-center gap-2 active:scale-95">
                        <i data-lucide="plus" class="w-4 h-4"></i> Nuevo Registro
                    </button>
                </div>
                
                <div class="border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                    <table class="w-full text-left border-collapse">
                        <thead class="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <tr>
                                ${table.headers.map(h => `<th class="px-6 py-4">${h}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-50 text-sm">
                            ${rows.map((r, idx) => `
                                <tr class="hover:bg-slate-50/50 transition-colors">
                                    <td class="px-6 py-5 font-bold text-slate-800">
                                        <div class="flex flex-col">
                                            <span>${r.name || r.title || ''}</span>
                                            <span class="text-[10px] text-slate-400 font-mono mt-0.5">${r.id ? 'ID: ' + r.id : ''}</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-5 font-mono text-xs text-slate-500"><span class="bg-slate-100 px-2 py-1 rounded border border-slate-200">${r.code || ''}</span></td>
                                    <td class="px-6 py-5 text-slate-500 line-clamp-2 max-w-[300px] leading-relaxed">${r.result || r.category || r.problem || ''}</td>
                                    <td class="px-6 py-5">
                                        <div class="flex gap-4">
                                            <button onclick="openEditItemModal('innovacion', '${key}', null, ${idx})" class="p-2 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"><i data-lucide="edit-3" class="w-5 h-5"></i></button>
                                            <button onclick="deleteItem('innovacion', '${key}', null, ${idx})" class="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><i data-lucide="trash-2" class="w-5 h-5"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                            ${rows.length === 0 ? `<tr><td colspan="4" class="px-6 py-12 text-center text-slate-400 italic">No hay registros dinámicos</td></tr>` : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderPublicaciones(container) {
    container.innerHTML = `
        <div class="p-8 bg-white h-full">
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h3 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <i data-lucide="book-copy" class="w-8 h-8 text-blue-600"></i> Publicaciones e Informes UPP
                    </h3>
                    <p class="text-slate-400 font-medium text-sm mt-1">Gestión de documentos técnicos, reportes y boletines institucionales</p>
                </div>
                <button onclick="openNewItemModal('publicaciones')" class="px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black uppercase tracking-wider hover:bg-slate-900 transition-all shadow-2xl shadow-blue-200 flex items-center gap-2 active:scale-95">
                    <i data-lucide="plus-circle" class="w-5 h-5"></i> Registrar Publicación
                </button>
            </div>
            
            <div class="border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 bg-white">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                        <tr>
                            <th class="px-8 py-6">Documento Publicado</th>
                            <th class="px-8 py-6">Clasificación / Desc</th>
                            <th class="px-8 py-6">Estado</th>
                            <th class="px-8 py-6 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-sm">
                        ${contentData.repository.publicaciones_upp.map((p, idx) => `
                            <tr class="hover:bg-blue-50/30 transition-all group">
                                <td class="px-8 py-6">
                                    <h5 class="font-black text-slate-800 text-base leading-tight group-hover:text-blue-600 transition-colors">${p.title}</h5>
                                    <a href="${p.url}" target="_blank" class="text-[10px] font-mono text-slate-400 mt-1 inline-flex items-center gap-1 hover:text-blue-500 font-bold">${p.url}</a>
                                </td>
                                <td class="px-8 py-6">
                                    <div class="flex flex-col gap-1.5">
                                        <span class="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-black rounded w-fit uppercase">${p.category}</span>
                                        <span class="text-slate-500 text-xs font-medium italic truncate max-w-[200px]">${p.desc}</span>
                                    </div>
                                </td>
                                <td class="px-8 py-6">
                                    <span class="px-3 py-1 ${p.status==='Validado'?'bg-blue-100 text-blue-700':'bg-emerald-100 text-emerald-700'} text-[10px] font-black rounded-full uppercase border border-white shadow-sm">${p.status}</span>
                                </td>
                                <td class="px-8 py-6">
                                    <div class="flex justify-center gap-4">
                                        <button onclick="openEditItemModal('publicaciones', null, null, ${idx})" class="w-10 h-10 bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl flex items-center justify-center transition-all shadow-sm"><i data-lucide="edit-3" class="w-4 h-4"></i></button>
                                        <button onclick="deleteItem('publicaciones', null, null, ${idx})" class="w-10 h-10 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl flex items-center justify-center transition-all shadow-sm"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderUsers(container) {
    const htmlHeader = `
        <div class="px-8 py-6 bg-white border-b border-slate-100 flex justify-between items-center">
            <div>
                <h3 class="text-xl font-black text-slate-800">Directorio de Usuarios</h3>
                <p class="text-sm text-slate-400 font-medium mt-1">Gestión de accesos y roles administrativos</p>
            </div>
            <button onclick="openModal('new-user')" class="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-red-600 transition-all shadow-2xl active:scale-95">
                <i data-lucide="user-plus" class="w-4 h-4 text-white"></i> Nuevo Usuario
            </button>
        </div>
    `;

    const tableHtml = generateTableHeader(['ID', 'Nombre Completo', 'Email Institucional', 'Rol Administrativo', 'Acciones']);
    const rows = usersData.map(u => `
        <tr class="hover:bg-slate-50 transition-colors">
            <td class="px-8 py-6 text-xs font-mono text-slate-400">#${u.id}</td>
            <td class="px-8 py-6">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold border-2 border-white shadow-sm">${u.name.charAt(0)}</div>
                    <span class="text-base font-bold text-slate-700">${u.name}</span>
                </div>
            </td>
            <td class="px-8 py-6 text-sm text-slate-500 font-medium">${u.email}</td>
            <td class="px-8 py-6">
                <span class="px-4 py-1.5 ${u.role==='admin'?'bg-red-100 text-red-700':'bg-blue-100 text-blue-700'} text-[10px] font-black uppercase rounded-full border border-white shadow-sm">${u.role}</span>
            </td>
            <td class="px-8 py-6">
                <div class="flex gap-4">
                    <button onclick="openModal('user-${u.id}')" class="w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-xl flex items-center justify-center transition-all shadow-sm"><i data-lucide="edit-3" class="w-4 h-4"></i></button>
                    <button onclick="deleteUser(${u.id})" class="w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:text-red-600 rounded-xl flex items-center justify-center transition-all shadow-sm"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
    
    container.innerHTML = htmlHeader + tableHtml + `<tbody class="divide-y divide-slate-100">${rows}</tbody></table>`;
}

function generateTableHeader(headers) {
    return `
        <table class="w-full text-left border-collapse bg-white">
            <thead class="bg-slate-50/50 border-b border-slate-100">
                <tr>
                    ${headers.map(h => `<th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">${h}</th>`).join('')}
                </tr>
            </thead>
    `;
}

// --- Modales y Gestión de Datos ---

function openModal(id) {
    editingId = id;
    const modal = document.getElementById('edit-modal');
    const form = document.getElementById('dynamic-form');
    let title = "Editar Registro";
    let html = "";

    if (currentTab === 'sections') {
        const item = contentData.sections.find(s => s.id === id);
        title = `Editar Sección: ${item.title}`;
        html = `
            <div class="space-y-6">
                <div>
                    <label for="title" class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Título de la Sección</label>
                    <input type="text" id="title" value="${item.title}" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium">
                </div>
                <div>
                    <label for="definition" class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Definición Estratégica</label>
                    <textarea id="definition" rows="4" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium">${item.definition}</textarea>
                </div>
                <div>
                    <label for="purpose" class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Finalidad Institucional</label>
                    <textarea id="purpose" rows="4" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium">${item.purpose}</textarea>
                </div>
                <div>
                    <label for="video_url" class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">URL del Video de Resumen</label>
                    <input type="text" id="video_url" value="${item.video_url}" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium">
                </div>
            </div>
        `;
    } else if (currentTab === 'documents') {
        const item = contentData.documents.find(d => d.id == id);
        title = `Editar Documento: ${item.title}`;
        html = `
            <div class="grid grid-cols-2 gap-8">
                <div class="col-span-2">
                    <label for="title" class="block text-xs font-black text-slate-400 uppercase mb-3">Título Principal</label>
                    <input type="text" id="title" value="${item.title}" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                </div>
                <div class="col-span-2">
                    <label for="subtitle" class="block text-xs font-black text-slate-400 uppercase mb-3">Descripción / Subtítulo</label>
                    <input type="text" id="subtitle" value="${item.subtitle}" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                </div>
                <div>
                    <label for="icon" class="block text-xs font-black text-slate-400 uppercase mb-3">Icono (Lucide ID)</label>
                    <input type="text" id="icon" value="${item.icon}" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                </div>
                <div>
                    <label for="color" class="block text-xs font-black text-slate-400 uppercase mb-3">Esquema de Color (Tailwind)</label>
                    <input type="text" id="color" value="${item.color}" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" placeholder="blue, red, green...">
                </div>
            </div>
        `;
    } else if (currentTab === 'users') {
        const isNew = id === 'new-user';
        const user = isNew ? { name: '', email: '', password: '', role: 'user' } : usersData.find(u => `user-${u.id}` === id);
        title = isNew ? 'Registrar Nuevo Usuario' : 'Editar Datos de Usuario';
        html = `
            <div class="grid grid-cols-2 gap-8">
                <div>
                    <label for="user_name" class="block text-xs font-black text-slate-400 uppercase mb-3 tracking-widest">Nombre Completo</label>
                    <input type="text" id="user_name" value="${user.name}" required class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 transition-all font-medium">
                </div>
                <div>
                    <label for="user_email" class="block text-xs font-black text-slate-400 uppercase mb-3 tracking-widest">Email Institucional</label>
                    <input type="email" id="user_email" value="${user.email}" required class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 transition-all font-medium">
                </div>
                <div>
                    <label for="user_password" class="block text-xs font-black text-slate-400 uppercase mb-3 tracking-widest">Contraseña de Acceso</label>
                    <div class="relative">
                        <input type="password" id="user_password" value="${user.password}" required class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 transition-all font-medium pr-14">
                        <button type="button" onclick="togglePassword('user_password', this)" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors bg-white/50 p-2 rounded-xl border border-slate-100">
                            <i data-lucide="eye-off" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>
                <div>
                    <label for="user_role" class="block text-xs font-black text-slate-400 uppercase mb-3 tracking-widest">Rol del Sistema</label>
                    <select id="user_role" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 transition-all font-bold appearance-none">
                        <option value="admin" ${user.role==='admin'?'selected':''}>ADMINISTRADOR (CONTROL TOTAL)</option>
                        <option value="user" ${user.role==='user'?'selected':''}>OPERADOR (CONSULTA)</option>
                    </select>
                </div>
            </div>
        `;
    }

    document.getElementById('modal-title').innerText = title;
    form.innerHTML = html;
    modal.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * togglePassword - Manejo de visibilidad de contraseña
 */
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i') || btn.querySelector('svg');
    
    if (!input || !icon) return;

    if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '<i data-lucide="eye" class="w-5 h-5"></i>';
    } else {
        input.type = 'password';
        btn.innerHTML = '<i data-lucide="eye-off" class="w-5 h-5"></i>';
    }
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * Gestores del Repositorio (Nuevas Funciones CRUD Estructurado)
 */

function openNewSubSectionModal(catId) {
    editingId = { action: 'new-sub', catId };
    const modal = document.getElementById('edit-modal');
    const form = document.getElementById('dynamic-form');
    document.getElementById('modal-title').innerText = 'Añadir Nueva Subsección';
    
    form.innerHTML = `
        <div class="space-y-6">
            <div>
                <label for="sub_title" class="block text-xs font-black text-slate-400 uppercase mb-3">Título de la Nueva Subsección</label>
                <input type="text" id="sub_title" placeholder="Ej: 1.3 Unidad de Tecnologías" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 transition-all font-bold">
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
    lucide.createIcons();
}

function openNewItemModal(type, key, subTitle) {
    editingId = { action: 'new-item', type, key, subTitle };
    generateFormForSpecialItem(type, key, {});
}

function openEditItemModal(type, key, subTitle, index) {
    editingId = { action: 'edit-item', type, key, subTitle, index };
    let item = {};
    if (type === 'directivas') {
        const cat = contentData.repository.directivas.find(c => c.id === key);
        const sub = cat.subsections.find(s => s.title === subTitle);
        item = sub.items[index];
    } else if (type === 'innovacion') {
        item = contentData.repository.innovacion_tablas[key][index];
    } else if (type === 'publicaciones') {
        item = contentData.repository.publicaciones_upp[index];
    }
    generateFormForSpecialItem(type, key, item);
}

function generateFormForSpecialItem(type, key, item) {
    const modal = document.getElementById('edit-modal');
    const form = document.getElementById('dynamic-form');
    document.getElementById('modal-title').innerText = (editingId.action === 'new-item' ? 'Nuevo Registro de Repositorio' : 'Editar Registro de Repositorio');
    
    let html = '';
    
    if (type === 'directivas') {
        html = `
            <div class="grid grid-cols-2 gap-6">
                <div class="col-span-2">
                    <label for="item_title" class="block text-xs font-black text-slate-400 uppercase mb-2">Nombre de la Directiva/Norma</label>
                    <input type="text" id="item_title" value="${item.title || ''}" class="w-full p-4 bg-slate-50 border rounded-2xl outline-none shadow-sm">
                </div>
                <div>
                    <label for="item_code" class="block text-xs font-black text-slate-400 uppercase mb-2">Código (Ej: DI N°...)</label>
                    <input type="text" id="item_code" value="${item.code || ''}" class="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-mono">
                </div>
                <div>
                    <label for="item_date" class="block text-xs font-black text-slate-400 uppercase mb-2">Fecha (dd/mm/aaaa)</label>
                    <input type="text" id="item_date" value="${item.date || ''}" class="w-full p-4 bg-slate-50 border rounded-2xl outline-none">
                </div>
                <div class="col-span-2">
                    <label for="item_url" class="block text-xs font-black text-slate-400 uppercase mb-2">Enlace al Documento (PDF)</label>
                    <input type="text" id="item_url" value="${item.url || '#'}" class="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-bold text-blue-600">
                </div>
            </div>
        `;
    } else if (type === 'innovacion') {
        if (key === 'fichas_iniciativa') {
            html = `
                <div class="grid grid-cols-2 gap-6">
                    <div class="col-span-2"><label for="i_name" class="block text-xs font-black text-slate-400 uppercase mb-2">Nombre de la Iniciativa</label><input type="text" id="i_name" value="${item.name||''}" class="w-full p-4 bg-slate-50 border rounded-2xl"></div>
                    <div><label for="i_id" class="block text-xs font-black text-slate-400 uppercase mb-2">ID Correlativo</label><input type="text" id="i_id" value="${item.id||''}" class="w-full p-4 bg-slate-50 border rounded-2xl font-black"></div>
                    <div><label for="i_code" class="block text-xs font-black text-slate-400 uppercase mb-2">Código GIP</label><input type="text" id="i_code" value="${item.code||''}" class="w-full p-4 bg-slate-50 border rounded-2xl font-mono"></div>
                    <div class="col-span-2"><label for="i_problem" class="block text-xs font-black text-slate-400 uppercase mb-2">Problema Identificado</label><textarea id="i_problem" rows="3" class="w-full p-4 bg-slate-50 border rounded-2xl">${item.problem||''}</textarea></div>
                    <div class="col-span-2"><label for="i_justification" class="block text-xs font-black text-slate-400 uppercase mb-2">Justificación Estratégica</label><textarea id="i_justification" rows="3" class="w-full p-4 bg-slate-50 border rounded-2xl">${item.justification||''}</textarea></div>
                </div>
            `;
        } else if (key === 'reportes_evaluacion') {
            html = `
                <div class="grid grid-cols-2 gap-6">
                    <div class="col-span-2"><label for="r_name" class="block text-xs font-black text-slate-400 uppercase mb-2">Iniciativa Socializada</label><input type="text" id="r_name" value="${item.name||''}" class="w-full p-4 bg-slate-50 border rounded-2xl"></div>
                    <div><label for="r_code" class="block text-xs font-black text-slate-400 uppercase mb-2">Código GIP</label><input type="text" id="r_code" value="${item.code||''}" class="w-full p-4 bg-slate-50 border rounded-2xl font-mono"></div>
                    <div><label for="r_result" class="block text-xs font-black text-slate-400 uppercase mb-2">Resultado Evaluación</label><input type="text" id="r_result" value="${item.result||''}" class="w-full p-4 bg-slate-50 border rounded-2xl font-black uppercase text-blue-600"></div>
                    <div class="col-span-2"><label for="r_units" class="block text-xs font-black text-slate-400 uppercase mb-2">Unidades que Emitieron Opinión</label><input type="text" id="r_units" value="${item.units||''}" class="w-full p-4 bg-slate-50 border rounded-2xl"></div>
                </div>
            `;
        } else if (key === 'fichas_innovacion') {
            html = `
                <div class="grid grid-cols-2 gap-6">
                    <div class="col-span-2"><label for="f_name" class="block text-xs font-black text-slate-400 uppercase mb-2">Nombre del Proyecto Innovador</label><input type="text" id="f_name" value="${item.name||''}" class="w-full p-4 bg-slate-50 border rounded-2xl"></div>
                    <div><label for="f_code" class="block text-xs font-black text-slate-400 uppercase mb-2">Código Final</label><input type="text" id="f_code" value="${item.code||''}" class="w-full p-4 bg-slate-50 border rounded-2xl font-mono"></div>
                    <div><label for="f_category" class="block text-xs font-black text-slate-400 uppercase mb-2">Categoría (GIP)</label><input type="text" id="f_category" value="${item.category||''}" class="w-full p-4 bg-slate-50 border rounded-2xl font-bold uppercase"></div>
                    <div class="col-span-2"><label for="f_expected" class="block text-xs font-black text-slate-400 uppercase mb-2">Expectativa de Valor Público</label><textarea id="f_expected" rows="3" class="w-full p-4 bg-slate-50 border rounded-2xl">${item.expected||''}</textarea></div>
                </div>
            `;
        }
    } else if (type === 'publicaciones') {
        html = `
            <div class="space-y-6">
                <div><label for="p_title" class="block text-xs font-black text-slate-400 uppercase mb-2">Título de la Publicación</label><input type="text" id="p_title" value="${item.title||''}" class="w-full p-4 bg-slate-50 border rounded-2xl font-bold"></div>
                <div><label for="p_desc" class="block text-xs font-black text-slate-400 uppercase mb-2">Breve Resumen / Detalle</label><input type="text" id="p_desc" value="${item.desc||''}" class="w-full p-4 bg-slate-50 border rounded-2xl"></div>
                <div class="grid grid-cols-2 gap-6">
                    <div><label for="p_cat" class="block text-xs font-black text-slate-400 uppercase mb-2">Categoría Técnica</label><input type="text" id="p_cat" value="${item.category||''}" class="w-full p-4 bg-slate-50 border rounded-2xl uppercase tracking-tighter"></div>
                    <div>
                        <label for="p_status" class="block text-xs font-black text-slate-400 uppercase mb-2">Estado de Publicación</label>
                        <select id="p_status" class="w-full p-4 bg-slate-50 border rounded-2xl font-bold">
                            <option value="Validado" ${item.status==='Validado'?'selected':''}>VALIDADO</option>
                            <option value="Publicado" ${item.status==='Publicado'?'selected':''}>PUBLICADO</option>
                        </select>
                    </div>
                </div>
                <div><label for="p_url" class="block text-xs font-black text-slate-400 uppercase mb-2">Enlace de Descarga</label><input type="text" id="p_url" value="${item.url||'#'}" class="w-full p-4 bg-slate-50 border rounded-2xl font-mono text-blue-600"></div>
            </div>
        `;
    }

    form.innerHTML = html;
    modal.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function saveRecord() {
    try {
        // Lógica Usuarios
        if (currentTab === 'users') {
            const userData = {
                name: document.getElementById('user_name').value,
                email: document.getElementById('user_email').value,
                password: document.getElementById('user_password').value,
                role: document.getElementById('user_role').value
            };

            // Validación Estricta de Email Institucional (@agroideas.gob.pe)
            // No permite tildes, espacios ni caracteres especiales (#, &, %, etc.)
            const emailRegex = /^[a-zA-Z0-9._-]+@agroideas\.gob\.pe$/;
            if (!emailRegex.test(userData.email)) {
                showToast("El correo debe ser institucional (@agroideas.gob.pe) y no contener caracteres especiales (tildes, #, &, /, espacios, etc.)", "error");
                return; 
            }

            if (editingId === 'new-user') {
                const nextId = usersData.length > 0 ? Math.max(...usersData.map(u => u.id)) + 1 : 1;
                usersData.push({ id: nextId, ...userData });
                showToast("Usuario registrado exitosamente");
            } else {
                const userId = parseInt(editingId.replace('user-', ''));
                const idx = usersData.findIndex(u => u.id === userId);
                usersData[idx] = { ...usersData[idx], ...userData };
                showToast("Cambios del usuario guardados");
            }
        } 
        // Lógica Secciones y Documentos
        else if (typeof editingId === 'string') {
            const formData = {
                title: document.getElementById('title').value,
                definition: document.getElementById('definition')?.value,
                purpose: document.getElementById('purpose')?.value,
                video_url: document.getElementById('video_url')?.value,
                subtitle: document.getElementById('subtitle')?.value,
                icon: document.getElementById('icon')?.value,
                color: document.getElementById('color')?.value
            };

            if (currentTab === 'sections') {
                const idx = contentData.sections.findIndex(s => s.id === editingId);
                contentData.sections[idx] = { ...contentData.sections[idx], ...formData };
            } else if (currentTab === 'documents') {
                const idx = contentData.documents.findIndex(d => d.id == editingId);
                contentData.documents[idx] = { ...contentData.documents[idx], ...formData };
            }
            showToast("Cambios realizados con éxito");
        }
        // Lógica Repositorio (Estructura Anidada)
        else if (editingId.action === 'new-sub') {
            const title = document.getElementById('sub_title').value;
            const cat = contentData.repository.directivas.find(c => c.id === editingId.catId);
            cat.subsections.push({ title, items: [] });
            showToast("Subsección creada Correctamente");
        }
        else if (editingId.action === 'new-item' || editingId.action === 'edit-item') {
            const isNew = editingId.action === 'new-item';
            const { type, key, subTitle, index } = editingId;
            let newItem = {};
            
            if (type === 'directivas') {
                newItem = {
                    title: document.getElementById('item_title').value,
                    code: document.getElementById('item_code').value,
                    date: document.getElementById('item_date').value,
                    url: document.getElementById('item_url').value
                };
                const cat = contentData.repository.directivas.find(c => c.id === key);
                const sub = cat.subsections.find(s => s.title === subTitle);
                if (isNew) sub.items.push(newItem);
                else sub.items[index] = newItem;
            } else if (type === 'innovacion') {
                if (key === 'fichas_iniciativa') {
                    newItem = {
                        id: document.getElementById('i_id').value,
                        name: document.getElementById('i_name').value,
                        code: document.getElementById('i_code').value,
                        problem: document.getElementById('i_problem').value,
                        justification: document.getElementById('i_justification').value,
                        url: '#'
                    };
                } else if (key === 'reportes_evaluacion') {
                    newItem = {
                        name: document.getElementById('r_name').value,
                        code: document.getElementById('r_code').value,
                        result: document.getElementById('r_result').value,
                        units: document.getElementById('r_units').value,
                        url: '#'
                    };
                } else if (key === 'fichas_innovacion') {
                    newItem = {
                        name: document.getElementById('f_name').value,
                        code: document.getElementById('f_code').value,
                        category: document.getElementById('f_category').value,
                        expected: document.getElementById('f_expected').value,
                        url: '#'
                    };
                }
                if (isNew) contentData.repository.innovacion_tablas[key].push(newItem);
                else contentData.repository.innovacion_tablas[key][index] = newItem;
            } else if (type === 'publicaciones') {
                newItem = {
                    title: document.getElementById('p_title').value,
                    desc: document.getElementById('p_desc').value,
                    category: document.getElementById('p_cat').value,
                    status: document.getElementById('p_status').value,
                    url: document.getElementById('p_url').value
                };
                if (isNew) contentData.repository.publicaciones_upp.push(newItem);
                else contentData.repository.publicaciones_upp[index] = newItem;
            }
            showToast(isNew ? "Nuevo registro adicionado" : "Registro actualizado");
        }

        renderTabContent();
        closeModal();
        
        // --- PERSISTENCIA LOCAL ---
        syncToLocalStorage();
        console.log("SYNC_SIGNAL: Persistiendo cambios en LocalStorage...");
    } catch (e) {
        showToast("Error al guardar: " + e.message, "error");
        console.error(e);
    }
}

function deleteSubSection(catId, subTitle) {
    if (confirm(`¿Está seguro de eliminar la subsección "${subTitle}"? Todos los registros dentro de ella se borrarán.`)) {
        const cat = contentData.repository.directivas.find(c => c.id === catId);
        cat.subsections = cat.subsections.filter(s => s.title !== subTitle);
        syncToLocalStorage();
        showToast("Subsección eliminada", "info");
        renderTabContent();
    }
}

function deleteItem(type, catKey, subTitle, index) {
    if (confirm("¿Confirmar eliminación de este registro?")) {
        if (type === 'directivas') {
            const cat = contentData.repository.directivas.find(c => c.id === catKey);
            const sub = cat.subsections.find(s => s.title === subTitle);
            sub.items.splice(index, 1);
        } else if (type === 'innovacion') {
            contentData.repository.innovacion_tablas[catKey].splice(index, 1);
        } else if (type === 'publicaciones') {
            contentData.repository.publicaciones_upp.splice(index, 1);
        }
        syncToLocalStorage();
        showToast("Registro borrado", "success");
        renderTabContent();
    }
}

function deleteUser(id) {
    const user = authSystem.getCurrentUser();
    if (id === user.id) {
        showToast("No puede eliminarse a sí mismo", "error");
        return;
    }
    
    if (confirm("¿Eliminar este usuario permanentemente?")) {
        usersData = usersData.filter(u => u.id !== id);
        syncToLocalStorage();
        showToast("Usuario eliminado");
        renderTabContent();
    }
}

function closeModal() {
    document.getElementById('edit-modal').classList.add('hidden');
    editingId = null;
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const colors = type === 'success' ? 'bg-emerald-600' : (type === 'error' ? 'bg-red-600' : 'bg-slate-900');
    const icon = type === 'success' ? 'check-circle-2' : (type === 'error' ? 'alert-octagon' : 'info');
    
    const toast = document.createElement('div');
    toast.className = `toast-enter flex items-center gap-4 ${colors} text-white px-6 py-4 rounded-[1.25rem] shadow-2xl min-w-[320px] border border-white/10`;
    toast.innerHTML = `<i data-lucide="${icon}" class="w-6 h-6"></i> <span class="text-sm font-black tracking-tight">${message}</span>`;
    
    container.appendChild(toast);
    if (typeof lucide !== 'undefined') lucide.createIcons();

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px) scale(0.95)';
        toast.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// Exportadores auxiliares
function exportJSON() {
    const blob = new Blob([JSON.stringify(contentData, null, 4)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.json';
    a.click();
    showToast("Archivo content.json exportado", "info");
}

function exportUsersJSON() {
    const blob = new Blob([JSON.stringify(usersData, null, 4)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.json';
    a.click();
    showToast("Archivo users.json exportado", "info");
}

function resetToDefaults() {
    if (confirm("¿Está seguro de restablecer todos los datos? Se perderán todos los cambios guardados localmente y se volverá a la configuración original de los archivos JSON.")) {
        localStorage.removeItem(STORAGE_KEY_CONTENT);
        localStorage.removeItem(STORAGE_KEY_USERS);
        location.reload();
    }
}

function initAdmin() {
    console.log("Admin Logic Initialized");
}

initAdmin();
