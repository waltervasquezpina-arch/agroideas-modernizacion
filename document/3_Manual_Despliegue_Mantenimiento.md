# Manual de Despliegue y Mantenimiento - Portal AGROIDEAS

## Requisitos de Ejecución
Este portal es una solución **Estática de Siguiente Generación (Serverless Ready)**. No requiere bases de datos relacionales ni lenguajes de procesamiento de lado servidor como PHP o Python.

**Dependencias Externas (Cargadas vía CDN):**
- Tailwind CSS (Estilos)
- Lucide Icons (Iconografía)
- AOS (Animaciones)
- DataTables (Gestión de Tablas)

## 1. Despliegue en Entorno de Desarrollo (Local)
Para realizar modificaciones o previsualizar el sitio de forma local:

1. Clonar o descargar la carpeta raíz del proyecto.
2. Contar con una conexión a internet activa (necesaria para cargar las bibliotecas vía CDN).
3. Abrir **`index.html`** en cualquier navegador moderno (preferiblemente Chrome o Edge para herramientas de desarrollador).
4. No es necesario realizar compilaciones (`npm build`) ya que el proyecto se ejecuta directamente desde el código fuente.

## 2. Despliegue en Producción
Debido a su naturaleza estática, el portal se puede alojar en cualquier servidor HTTP:

*   **Hosting Tradicional (cPanel/Plesk):** Subir el contenido de la carpeta raíz al directorio `public_html`.
*   **Servidores On-Premise:** Configurar una ruta en Apache o Nginx apuntando a la carpeta del proyecto.
*   **Plataformas Modernas (GitHub Pages/Vercel/Netlify):** Simplemente subir el código al repositorio y configurar el despliegue automático hacia la rama `main`.

## 3. Protocolos de Mantenimiento

### Modificación de la Navegación Global
Para agregar o quitar enlaces en el menú superior o el pie de página, **no se deben editar los archivos HTML individualmente**.

1. Abrir el archivo **`js/components.js`**.
2. Modificar el objeto `components.header` o `components.footer` según corresponda.
3. Al guardar el archivo, los cambios se replicarán automáticamente en todas las páginas que importen este script.

### Actualización de Contenidos Dinámicos
El portal permite la actualización de textos, enlaces y documentos sin tocar el código HTML:

1. **Vía Panel Administrativo:** Acceder a `admin.html` con credenciales institucionales.
2. **Edición:** Realizar cambios en las secciones de "Ejes de Gestión" o "Repositorio".
3. **Persistencia:** Al guardar, los cambios se almacenan en el `localStorage` del navegador para previsualización inmediata.
4. **Sincronización:** Para cambios permanentes en el servidor, exporte el JSON generado y reemplácelo en `data/content.json`.

### Gestión de Datos en el Repositorio
Para actualizar los registros de las tablas en `repositorio.html`, se recomienda utilizar el archivo **`data/content.json`**. El script **`js/content-loader.js`** se encarga de:
- Cargar la normatividad y publicaciones.
- Inyectar las filas en las tablas de DataTables.
- Gestionar la interactividad de los filtros dinámicos.

> [!TIP]
> **AOS y Rendimiento:** Si se agregan muchos elementos con animaciones, asegúrese de ajustar el `offset` y `delay` en el HTML (`data-aos-delay="200"`) para evitar que la página pierda fluidez al cargar.
