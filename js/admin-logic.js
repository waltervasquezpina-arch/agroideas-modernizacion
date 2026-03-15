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
        // Redirigir o el overlay de auth.js se encargará.
        // Pero por seguridad extra ocultamos si no es admin.
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

async function loadAllData() {
    try {
        const [resContent, resUsers] = await Promise.all([
            fetch('data/content.json'),
            fetch('data/users.json')
        ]);
        contentData = await resContent.json();
        usersData = await resUsers.json();
    } catch (e) {
        console.error("Error cargando archivos:", e);
        showToast("Error al cargar datos. Verifique data/content.json", "error");
    }
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
    // Sub-pestañas para repositorio
    container.innerHTML = `
        <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex gap-6">
            <button onclick="updateSubRepo('directivas')" class="text-sm font-bold ${currentSubRepo==='directivas'?'text-red-600 border-b-2 border-red-600':'text-slate-400'} pb-1">Directivas</button>
            <button onclick="updateSubRepo('innovacion')" class="text-sm font-bold ${currentSubRepo==='innovacion'?'text-red-600 border-b-2 border-red-600':'text-slate-400'} pb-1">Innovación</button>
            <button onclick="updateSubRepo('publicaciones')" class="text-sm font-bold ${currentSubRepo==='publicaciones'?'text-red-600 border-b-2 border-red-600':'text-slate-400'} pb-1">Publicaciones UPP</button>
        </div>
        <div id="sub-repo-content"></div>
    `;
    
    const subContainer = document.getElementById('sub-repo-content');
    if (currentSubRepo === 'directivas') renderDirectivas(subContainer);
    else if (currentSubRepo === 'innovacion') renderInnovacion(subContainer);
    else if (currentSubRepo === 'publicaciones') renderPublicaciones(subContainer);
}

function updateSubRepo(sub) {
    currentSubRepo = sub;
    renderTabContent();
}

function renderDirectivas(container) {
    // Las directivas tienen una estructura anidada. Para simplificar el CRUD, mostraremos las secciones.
    const html = generateTableHeader(['Categoría', 'Subsección', 'Items', 'Acciones']);
    let rows = '';
    contentData.repository.directivas.forEach(cat => {
        cat.subsections.forEach(sub => {
            rows += `
                <tr class="hover:bg-slate-50">
                    <td class="px-6 py-4 text-xs font-bold text-slate-400">${cat.title}</td>
                    <td class="px-6 py-4 text-sm font-bold text-slate-700">${sub.title}</td>
                    <td class="px-6 py-4 text-sm text-slate-500">${sub.items.length} items</td>
                    <td class="px-6 py-4">
                        <button onclick="openModalRepo('directivas', '${cat.id}', '${sub.title}')" class="text-slate-400 hover:text-blue-600 p-1"><i data-lucide="edit-3" class="w-4 h-4"></i></button>
                    </td>
                </tr>
            `;
        });
    });
    container.innerHTML = html + `<tbody class="divide-y divide-slate-100">${rows}</tbody></table>`;
}

function renderInnovacion(container) {
    const html = generateTableHeader(['Tabla', 'Registros', 'Acciones']);
    const keys = Object.keys(contentData.repository.innovacion_tablas);
    const rows = keys.map(k => `
        <tr>
            <td class="px-6 py-4 text-sm font-bold text-slate-700 capitalize">${k.replace(/_/g, ' ')}</td>
            <td class="px-6 py-4 text-sm text-slate-500">${contentData.repository.innovacion_tablas[k].length} registros</td>
            <td class="px-6 py-4">
                <button onclick="openModalRepo('innovacion', '${k}')" class="text-slate-400 hover:text-blue-600 p-1"><i data-lucide="edit-3" class="w-4 h-4"></i></button>
            </td>
        </tr>
    `).join('');
    container.innerHTML = html + `<tbody class="divide-y divide-slate-100">${rows}</tbody></table>`;
}

function renderPublicaciones(container) {
    const html = generateTableHeader(['Título', 'Categoría', 'Estado', 'Acciones']);
    const rows = contentData.repository.publicaciones_upp.map((p, idx) => `
        <tr>
            <td class="px-6 py-4 text-sm font-bold text-slate-700">${p.title}</td>
            <td class="px-6 py-4 text-xs font-bold text-slate-400 uppercase">${p.category}</td>
            <td class="px-6 py-4"><span class="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">${p.status}</span></td>
            <td class="px-6 py-4">
                <button onclick="openModalRepo('publicaciones', ${idx})" class="text-slate-400 hover:text-blue-600 p-1"><i data-lucide="edit-3" class="w-4 h-4"></i></button>
                <button onclick="deletePublication(${idx})" class="text-slate-400 hover:text-red-600 p-1"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
            </td>
        </tr>
    `).join('');
    container.innerHTML = html + `<tbody class="divide-y divide-slate-100">${rows}</tbody></table>`;
}

function renderUsers(container) {
    const html = generateTableHeader(['Nombre', 'Email', 'Rol', 'Acciones']);
    const rows = usersData.map(u => `
        <tr class="hover:bg-slate-50">
            <td class="px-6 py-4 text-sm font-bold text-slate-700">${u.name}</td>
            <td class="px-6 py-4 text-sm text-slate-500">${u.email}</td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 ${u.role==='admin'?'bg-red-100 text-red-700':'bg-blue-100 text-blue-700'} text-[10px] font-black uppercase rounded-full">${u.role}</span>
            </td>
            <td class="px-6 py-4">
                <button class="text-slate-300 cursor-not-allowed"><i data-lucide="shield-off" class="w-4 h-4"></i></button>
            </td>
        </tr>
    `).join('');
    container.innerHTML = html + `<tbody class="divide-y divide-slate-100">${rows}</tbody></table>`;
}

function generateTableHeader(headers) {
    return `
        <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                    ${headers.map(h => `<th class="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">${h}</th>`).join('')}
                </tr>
            </thead>
    `;
}

// --- Modales y Edición ---
function openModal(id) {
    editingId = id;
    const modal = document.getElementById('edit-modal');
    const form = document.getElementById('dynamic-form');
    
    let html = '';
    if (currentTab === 'sections') {
        const item = contentData.sections.find(s => s.id === id);
        html = `
            <div><label class="block text-xs font-bold text-slate-400 uppercase mb-2">Título</label><input type="text" id="title" value="${item.title}" class="w-full p-3 bg-slate-50 border rounded-xl"></div>
            <div><label class="block text-xs font-bold text-slate-400 uppercase mb-2">Definición</label><textarea id="definition" rows="3" class="w-full p-3 bg-slate-50 border rounded-xl">${item.definition}</textarea></div>
            <div><label class="block text-xs font-bold text-slate-400 uppercase mb-2">Finalidad</label><textarea id="purpose" rows="3" class="w-full p-3 bg-slate-50 border rounded-xl">${item.purpose}</textarea></div>
            <div><label class="block text-xs font-bold text-slate-400 uppercase mb-2">Video URL</label><input type="text" id="video_url" value="${item.video_url}" class="w-full p-3 bg-slate-50 border rounded-xl"></div>
        `;
    } else if (currentTab === 'documents') {
        const item = contentData.documents.find(d => d.id == id);
        html = `
            <div><label class="block text-xs font-bold text-slate-400 uppercase mb-2">Título</label><input type="text" id="title" value="${item.title}" class="w-full p-3 bg-slate-50 border rounded-xl"></div>
            <div><label class="block text-xs font-bold text-slate-400 uppercase mb-2">Subtítulo</label><input type="text" id="subtitle" value="${item.subtitle}" class="w-full p-3 bg-slate-50 border rounded-xl"></div>
            <div><label class="block text-xs font-bold text-slate-400 uppercase mb-2">Icono (Lucide)</label><input type="text" id="icon" value="${item.icon}" class="w-full p-3 bg-slate-50 border rounded-xl"></div>
            <div><label class="block text-xs font-bold text-slate-400 uppercase mb-2">Color (Tailwind)</label><input type="text" id="color" value="${item.color}" class="w-full p-3 bg-slate-50 border rounded-xl"></div>
        `;
    }

    form.innerHTML = html;
    modal.classList.remove('hidden');
}

function openModalRepo(type, catIdOrKey, subTitle) {
    editingId = { type, catIdOrKey, subTitle };
    const modal = document.getElementById('edit-modal');
    const form = document.getElementById('dynamic-form');
    
    // Simplificación: Para el repositorio, daremos un textarea con el JSON de los items para edición masiva rápida.
    let items = [];
    if (type === 'directivas') {
        const cat = contentData.repository.directivas.find(c => c.id === catIdOrKey);
        const sub = cat.subsections.find(s => s.title === subTitle);
        items = sub.items;
    } else if (type === 'innovacion') {
        items = contentData.repository.innovacion_tablas[catIdOrKey];
    } else if (type === 'publicaciones') {
        items = [contentData.repository.publicaciones_upp[catIdOrKey]];
    }

    form.innerHTML = `
        <div class="bg-blue-50 p-4 rounded-xl mb-4 border border-blue-100 flex items-center gap-3">
            <i data-lucide="info" class="w-5 h-5 text-blue-600"></i>
            <p class="text-xs text-blue-800 font-medium">Edite los datos en formato JSON. Mantenga el formato exacto para evitar errores.</p>
        </div>
        <div>
            <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Datos de la Tabla</label>
            <textarea id="repo_json" rows="15" class="w-full p-4 bg-slate-900 text-emerald-400 font-mono text-sm border rounded-xl">${JSON.stringify(items, null, 4)}</textarea>
        </div>
    `;
    
    modal.classList.remove('hidden');
    lucide.createIcons();
}

function closeModal() {
    document.getElementById('edit-modal').classList.add('hidden');
    editingId = null;
}

function saveRecord() {
    try {
        if (typeof editingId === 'string') {
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
        } else {
            // Repositorio
            const newItems = JSON.parse(document.getElementById('repo_json').value);
            const { type, catIdOrKey, subTitle } = editingId;

            if (type === 'directivas') {
                const cat = contentData.repository.directivas.find(c => c.id === catIdOrKey);
                const sub = cat.subsections.find(s => s.title === subTitle);
                sub.items = newItems;
            } else if (type === 'innovacion') {
                contentData.repository.innovacion_tablas[catIdOrKey] = newItems;
            } else if (type === 'publicaciones') {
                contentData.repository.publicaciones_upp[catIdOrKey] = newItems[0];
            }
        }

        showToast("Cambios guardados localmente. Recuerde exportar antes de salir.", "success");
        renderTabContent();
        closeModal();
    } catch (e) {
        showToast("Error en formato de datos: " + e.message, "error");
    }
}

function exportJSON() {
    const backupName = `content_backup_${new Date().getTime()}.json`;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(contentData, null, 4));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", backupName);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    showToast(`Punto de restauración creado: ${backupName}`, "info");
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const colors = type === 'success' ? 'bg-emerald-500' : (type === 'error' ? 'bg-red-500' : 'bg-slate-800');
    const icon = type === 'success' ? 'check-circle' : (type === 'error' ? 'alert-triangle' : 'info');
    
    const toast = document.createElement('div');
    toast.className = `toast-enter flex items-center gap-3 ${colors} text-white px-5 py-3 rounded-xl shadow-xl min-w-[300px] border border-white/20`;
    toast.innerHTML = `<i data-lucide="${icon}" class="w-5 h-5"></i> <span class="text-sm font-bold tracking-tight">${message}</span>`;
    
    container.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
