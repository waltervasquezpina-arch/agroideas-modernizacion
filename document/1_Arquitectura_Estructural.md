# Arquitectura Estructural del Portal Web AGROIDEAS

## Resumen Ejecutivo
El Portal Web de AGROIDEAS es un sitio estático (`Static Site`) de naturaleza hipertextual (HTML/JS/CSS). A diferencia de plataformas monolíticas pesadas o gestores de contenido complejos (CMS), este proyecto se basa en una arquitectura de **Componentes Reutilizables Simulados** mediante *Vanilla JavaScript*.

## 1. El Paradigma de Componentes Asíncronos
Debido a que el proyecto cuenta con **13 páginas** HTML distintas (como `gestion_calidad.html` o `index.html`), se identificó tempranamente el problema de mantenimiento de código repetitivo (Headers, Footers, Navegación lateral). Evitando inyectar lenguajes de servidor (PHP/Node), el proyecto lo soluciona renderizando elementos del DOM dinámicamente con ECMAScript 6.

### El Corazón Estructural: `js/main.js`
Todo archivo `.html` en la raíz contiene un cuerpo (body) "vacío" o parcialmente ciego. Su única responsabilidad es ejecutar una llamada mandatoria al bloque inferiror:
```html
<script src="js/main.js"></script>
```
Una vez ejecutado, el `main.js` de encarga de rellenar las propiedades `innerHTML` del Modelo de Objetos del Documento (DOM):

*   **Bloque `<head>` Dinámico:** El script inyecta asíncronamente las variables UTF-8 complementarias, pre-conexiones de CDNs hacia Google Fonts (*Roboto*), la librería de animaciones al instante (*AOS*) y nuestra propia hoja maestra `css/style.css`.
*   **Encabezado (`<header>`) y Menú Principal:** Inyecta estructuralmente el logotipo, el banner corporativo y los **3 pilares de navegación jerárquica** (Modernización GP, NT de Modernización con DropDown, y Contacto).
*   **Barra Lateral (`<aside>`):** Inyecta automáticamente los hipervínculos verticales que refuerzan la navegación de tópicos. Esta navegación depende de que las secciones en el HTML utilicen los IDs estandarizados: `Definición`, `Finalidad`, `Implementación` y `Roles`.
*   **Pie de Página (`<footer>`):** El cual incrusta un copyright con una variable computada automáticamente contra el reloj del sistema mediante `new Date()` (Haciéndolo "dinámico para siempre").

## 2. Jerarquía de Carpetas y Organización

La estructura del árbol de directorios obedece al siguiente estándar:

\`\`\`text
/pag_web_reutilizable-main-main/
│
├── css/
│   └── style.css            # Hoja de estilos única, maestra y global.
│
├── images/                  # Almacenamiento local de fotografías corporativas.
│   ├── agroideas_banner.png # Banner generado y utilizado en .logo
│   └── (...)
│
├── js/
│   └── main.js              # Controlador ECMAScript e Inyector de DOM.
│
├── document/                # Carpeta contenedora de Documentación Técnica.
│
├── README.md                # Presentación general del repositorio en Markdown.
│
└── *.html                   # 13 Páginas web núcleo de contenido asincrónico.
\`\`\`

## 3. Beneficios de esta Arquitectura
1.  **Mantenibilidad Extrema:** Si en el futuro AGROIDEAS modifica su logotipo o requiere agregar un link de navegación, **no se requiere** entrar a alterar 14 archivos HTML. El Desarrollador simplemente edita la variable respectiva dentro de `js/main.js`.
2.  **Rendimiento y Ligereza:** Al ser un despliegue estático hiper-cacheable (Servido nativamente por cualquier web server como Apache, Nginx o Netlify) carece del *lag* inferido de bases de datos relacionales cruzadas, cargando la experiencia en milisegundos.
3.  **Seguridad Base:** El código fuente al ser plenamente del lado-cliente y estático (Front-End) es inmune a ataques comunes de inyección por bases de datos (SQLi).
