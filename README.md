# Portal Web de Modernización de la Gestión Pública - AGROIDEAS

Este proyecto es una aplicación web estática diseñada para difundir e informar sobre el **Proceso de Modernización de la Gestión Pública** en el contexto de **AGROIDEAS** (Programa de Compensaciones para la Competitividad). La web proporciona información clara y estructurada sobre los pilares, lineamientos y herramientas relativas al desarrollo organizacional y la mejora continua del Estado.

## 🚀 Características Principales

- **Dashboard Administrativo Completo:** Panel de control privado (`admin.html`) para la gestión integral de contenidos, usuarios y repositorio institucional sin necesidad de base de datos externa.
- **Persistencia en LocalStorage:** Sistema de almacenamiento local inteligente que permite que los cambios realizados en el panel administrativo se mantengan y reflejen en todo el sitio web de forma inmediata.
- **Diseño Premium y Moderno:** Interfaz de alto impacto visual utilizando **Tailwind CSS** para un diseño responsivo, limpio y estéticamente agradable.
- **Arquitectura de Componentes Dinámicos:** Utilización de Vanilla JavaScript (`js/components.js`) para la inyección automática de elementos globales como el **Header** y el **Footer**.
- **Seguridad y Control de Acceso:** Sistema de autenticación institucional (`js/auth.js`) con validación de correos corporativos y roles de usuario.
- **Interactividad Enriquecida:** 
  - **AOS (Animate on Scroll):** Animaciones fluidas al navegar por el contenido.
  - **Lucide Icons:** Iconografía vectorial moderna y consistente.
  - **DataTables:** Tablas inteligentes con capacidades de búsqueda, paginación y exportación de datos en la sección de Repositorio.
- **Tipografía y Estilo Institucional:** Uso de fuentes modernas (Inter/Outfit) y una paleta de colores institucional (Azul Agro, Verde Agro, Rojo PCM) definida mediante variables CSS.

## 📁 Estructura del Proyecto

El proyecto se organiza en torno a los ejes estratégicos de la modernización:

* `index.html`: Página principal con el resumen de objetivos estratégicos y pilares de transformación.
* `gestion_conocimiento.html`: Políticas y herramientas para la gestión del capital intelectual.
* `gestion_procesos.html`: Directrices para la productividad y mejora de procesos institucionales.
* `gestion_calidad.html`: Enfoque en la calidad de servicios y mejora regulatoria.
* `gestion_innovacion.html`: Estrategias e iniciativas para el fomento de la innovación pública.
* `repositorio.html`: Centro de documentación centralizado (Normatividad, Guías, Publicaciones) con tablas interactivas.
* `estructura_organica.html`: Detalle de la organización funcional y jerárquica de la institución.
* `doc_gestion.html`: Hub de acceso rápido a documentos de gestión (MOP, MAPRO, etc.).
* `contacto.html`: Formulario de atención y contacto.

> [!IMPORTANT]
> Todas las páginas de "Ejes de Gestión" han sido estandarizadas en 5 secciones clave: **1. Definición**, **2. Finalidad**, **3. Fases/Actividades**, **4. Roles** y **5. Contenido Multimedia**.

## 📚 Documentación Técnica

Para un análisis profundo del sistema, consulte los siguientes manuales en la carpeta `/document`:

1.  **[Arquitectura Estructural](file:///d:/AGROIDEAS%20GxP%20-%20Gestion%20Conocimiento/DOCUMENTOS%20DE%20GESTI%C3%93N/8.%20PROPUESTA%20DE%20DESARROLLO%20WEB/Proyecto_repositorio_central%20v%203%20-%20copia%20%283%29/document/1_Arquitectura_Estructural.md)**: Diseño jerárquico y organización de archivos.
2.  **[Guía de Estilos UI](file:///d:/AGROIDEAS%20GxP%20-%20Gestion%20Conocimiento/DOCUMENTOS%20DE%20GESTI%C3%93N/8.%20PROPUESTA%20DE%20DESARROLLO%20WEB/Proyecto_repositorio_central%20v%203%20-%20copia%20%283%29/document/2_Guia_de_Estilos_UI.md)**: Estándares visuales, colores y componentes.
3.  **[Manual de Despliegue](file:///d:/AGROIDEAS%20GxP%20-%20Gestion%20Conocimiento/DOCUMENTOS%20DE%20GESTI%C3%93N/8.%20PROPUESTA%20DE%20DESARROLLO%20WEB/Proyecto_repositorio_central%20v%203%20-%20copia%20%283%29/document/3_Manual_Despliegue_Mantenimiento.md)**: Guía paso a paso para actualización y mantenimiento.
4.  **[Arquitectura de Datos y Flujos](file:///d:/AGROIDEAS%20GxP%20-%20Gestion%20Conocimiento/DOCUMENTOS%20DE%20GESTI%C3%93N/8.%20PROPUESTA%20DE%20DESARROLLO%20WEB/Proyecto_repositorio_central%20v%203%20-%20copia%20%283%29/document/4_Arquitectura_Datos_Interaccion.md)**: Detalle del motor dinámico JSON, seguridad y diagramas UML/Mermaid.

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5, JavaScript (ES6+), CSS3 (Modern Variables).
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (vía CDN para desarrollo ágil).
- **Iconografía:** [Lucide Icons](https://lucide.dev/).
- **Animaciones:** [AOS Library](https://michalsnik.github.io/aos/).
- **Tablas:** [DataTables.net](https://datatables.net/) (jQuery-based integration).

## 💻 Instrucciones de Uso y Despliegue

Al ser un sitio web estático, su despliegue es inmediato y no requiere backend:

1. Descarga o clona el proyecto en tu entorno local.
2. Abre cualquier archivo `.html` (se recomienda empezar por `index.html`) en un navegador moderno.
3. Para realizar cambios globales en la navegación o el pie de página, edita el archivo `js/components.js`.

---
*Ultima actualización: Marzo 2026 - Modernización AGROIDEAS*
