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
2. Localizar el bloque de código dentro de la función `injectHeader()`.
3. Modificar la estructura HTML dentro de la cadena de texto (\`...\`).
4. Al guardar el archivo, los cambios se replicarán automáticamente en todas las páginas que importen este script.

### Actualización de Secciones en Ejes de Gestión
Todas las páginas de "Ejes de Gestión" (Conocimiento, Procesos, Calidad, Innovación) deben mantener la estructura de 5 secciones para garantizar el correcto funcionamiento del menú lateral automático:

| Sección | ID Requerido |
| :--- | :--- |
| Definición | `definition` |
| Finalidad | `purpose` |
| Fases / Actividades | `phases` |
| Roles | `roles` |
| Contenido Multimedia | `multimedia` |

### Gestión de Datos en el Repositorio
Para actualizar los registros de las tablas en `repositorio.html`, se debe editar directamente el código HTML de la tabla correspondiente dentro del archivo. Las capacidades de búsqueda y ordenación de **DataTables** se aplicarán automáticamente tras la carga de la página.

> [!TIP]
> **AOS y Rendimiento:** Si se agregan muchos elementos con animaciones, asegúrese de ajustar el `offset` y `delay` en el HTML (`data-aos-delay="200"`) para evitar que la página pierda fluidez al cargar.
