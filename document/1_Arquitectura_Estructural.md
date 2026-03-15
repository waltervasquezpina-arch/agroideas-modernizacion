# Arquitectura Estructural del Portal Web AGROIDEAS

## Resumen Ejecutivo
El Portal Web de AGROIDEAS es una plataforma estática de alto rendimiento que utiliza un enfoque de **Micro-Componentes Dinámicos**. La arquitectura ha sido refactorizada para separar la lógica de presentación (HTML/Tailwind) de la infraestructura global (Header, Footer, Animaciones) centralizada en JavaScript.

## 1. El Paradigma de Componentes Dinámicos
Para evitar la redundancia de código en las múltiples páginas del sitio, el proyecto utiliza un inyector de DOM inteligente que asegura la consistencia institucional.

### El Motor Central: `js/components.js`
Este archivo es el cerebro funcional de la interfaz. Su ejecución es obligatoria al final de cada documento HTML para realizar las siguientes tareas:

*   **Inyección de Header y Footer:** Localiza las etiquetas `<header>` y `<footer>` y las rellena con el menú de navegación institucional y los créditos actualizados, respectivamente.
*   **Gestión de Navegación Móvil:** Controla la visibilidad del menú hamburguesa y las transiciones en dispositivos táctiles.
*   **Inicialización de Bibliotecas:** Dispara automáticamente la renderización de **Lucide Icons** y configura la librería de animaciones **AOS** con parámetros optimizados de rendimiento.
*   **Efectos Scrolled:** Maneja el cambio de opacidad y estilo del Navbar al realizar scroll ("Glassmorphism effect").

## 2. Jerarquía de Carpetas y Organización Actualizada

La estructura del árbol de directorios obedece al siguiente estándar moderno:

```text
/Proyecto_repositorio_central/
│
├── css/
│   ├── modern-styles.css    # Estilos globales, variables y animaciones complejas.
│   └── repositorio.css      # Estilos específicos para las tablas y tabs del repositorio.
│
├── js/
│   ├── components.js       # Core de inyección de componentes y gestión de UI.
│   ├── auth.js             # Lógica para gestión de accesos y seguridad básica.
│   └── content-loader.js   # Motor de carga dinámica de contenidos desde JSON.
│
├── data/
│   ├── users.json           # Base de datos de usuarios (Simulación).
│   └── content.json         # Base de datos de contenidos dinámicos.
│
├── images/                  # Activos gráficos críticos (Logos, Banners).
│
├── document/                # Documentación Técnica (Arquitectura, Estilos, Manual).
│
└── *.html                   # Páginas núcleo estandarizadas.
```

## 3. Beneficios de la Nueva Arquitectura
1.  **Mantenibilidad Centralizada:** Cualquier ajuste en el menú de navegación o el pie de página se realiza exclusivamente en `js/components.js`, impactando instantáneamente en todo el portal.
2.  **Escalabilidad Estética:** Mediante el uso de **Tailwind CSS**, se pueden crear nuevos componentes visuales sin necesidad de escribir CSS personalizado adicional para cada página.
3.  **Rendimiento "Lazy-Ready":** Los scripts se cargan al final del body para no bloquear el renderizado inicial de la página, proporcionando una experiencia de carga rápida.
4.  **Estandarización de Secciones:** El uso de IDs unificados (`definition`, `purpose`, `phases`, `roles`, `multimedia`) permite que los scripts de navegación lateral funcionen de manera agnóstica al contenido de la página.
