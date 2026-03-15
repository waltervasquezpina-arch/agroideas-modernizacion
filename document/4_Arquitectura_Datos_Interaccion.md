# Arquitectura de Datos e Interacción Dinámica

## 1. El Motor de Datos (JSON)
El portal utiliza un enfoque de **datos desacoplados**. Toda la información variable se almacena en el archivo `data/content.json`, permitiendo actualizaciones sin modificar la estructura HTML.

### Estructura del Content.json
El archivo se divide en tres ramas principales:
- `sections`: Contenido para las páginas de Ejes de Gestión.
- `repository`: Registros para las tablas del Repositorio Institucional (Directivas, Innovación, Publicaciones).
- `updates`: Registro de auditoría de los últimos cambios.

## 2. Ciclo de Vida del Contenido (Renderizado)
El proceso de carga sigue este flujo:
1. **Fetch:** `js/content-loader.js` intenta obtener `data/content.json`.
2. **Fallback:** Si existe una versión más reciente en el `localStorage` (modificada vía Admin), se prioriza esta sobre el archivo estático.
3. **Parsing:** El script identifica el ID de la página actual.
4. **Injection:** Se inyectan los textos, imágenes y enlaces en los contenedores designados.
5. **Post-Processing:** Se disparan las inicializaciones de DataTables y animaciones AOS tras la inyección.

## 3. Seguridad y Autenticación (`js/auth.js`)
El acceso al panel administrativo está protegido por una capa de seguridad frontend:
- **Dominio Institucional:** Solo se permiten correos finalizados en `@agroideas.gob.pe`.
- **Persistencia de Sesión:** Utiliza `sessionStorage` para mantener al usuario activo durante la navegación del panel.
- **Roles:** Soporta roles de administrador y editor para restringir acciones (borrado vs edición).

## 4. Diagrama de Flujo (Lógica Admin)
```mermaid
graph TD
    A[Inicio de Sesión] --> B{Validación de Correo}
    B -- No @agroideas --> C[Error de Acceso]
    B -- @agroideas --> D[Dashboard Administrativo]
    D --> E[Selección de Sección]
    E --> F[Modificación de Datos]
    F --> G[Guardado en LocalStorage]
    G --> H[Exportar JSON Final]
    H --> I[Reemplazo en Servidor]
```

## 5. Gestión del Repositorio (DataTables Interface)
La interacción con las tablas de documentos se gestiona mediante:
- **Filtros Dinámicos:** Búsqueda en tiempo real por categoría o palabra clave.
- **Estado de Carga:** Spinners de carga mientras se procesan los registros grandes.
- **Exportación:** Botones integrados para descarga en Excel, PDF e impresión directa.
