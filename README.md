# Portal Web de Modernización de la Gestión Pública - AGROIDEAS

Este proyecto es una aplicación web estática diseñada para difundir e informar sobre el **Proceso de Modernización de la Gestión Pública** en el contexto de **AGROIDEAS** (Programa de Compensaciones para la Competitividad). La web proporciona información clara y estructurada sobre los pilares, lineamientos y herramientas relativas al desarrollo organizacional y la mejora continua del Estado.

## 🚀 Características Principales

- **Diseño Responsivo y Limpio:** Interfaz amigable, estructurada principalmente con HTML5 y CSS puro, adaptada para una navegación sencilla.
- **Reutilización de Componentes (JavaScript):** El proyecto implementa un enfoque de reutilización de código mediante Vanilla JavaScript (`js/main.js`). Componentes críticos y repetitivos como el **Header** (menú de navegación), el **Aside** (barras laterales contextuales) y el **Footer** se inyectan dinámicamente en el DOM, facilitando el mantenimiento y la escalabilidad del proyecto.
- **Animaciones Interactivas:** Integración de la biblioteca **AOS (Animate on Scroll)** para dotar a las páginas de transiciones fluidas y animaciones atractivas al hacer scroll.
- **Tipografía Moderna:** Uso de la fuente *Roboto* de Google Fonts para garantizar máxima legibilidad.

## 📁 Estructura del Proyecto

El proyecto está compuesto por múltiples secciones que abarcan distintos tópicos de la modernización:

* `index.html`: Página principal que describe el alcance y conceptos generales de la modernización. Contiene las secciones estándar: **1. Definición**, **2. Finalidad**, **3. Implementación** y **4. Roles**.
* `estructura_organica.html`: Información referente a la estructura, organización y funcionamiento institucional.
* `gestion_procesos.html`: Directrices para la mejora de productividad y la gestión regulada por procesos.
* `gestion_calidad.html`: Enfoque hacia la calidad en las regulaciones y servicios brindados al ciudadano.
* `gestion_conocimiento.html`: Políticas orientadas al rescate, gestión documental y difusión del conocimiento interno.
* `gestion_innovacion.html`: Estrategias e iniciativas destinadas a fomentar la innovación pública.
* *Documentos y Repositorio:* (`doc_gestion.html`, `repositorio.html`) donde se listan documentos rectores, boletines, infografías, diapositivas y activos de conocimiento e innovación.
* `contacto.html`: Formulario de contacto directo para consultas relacionadas a este proceso.

> [!NOTE]
> Todas las páginas de contenido principal han sido estandarizadas con una estructura de 4 secciones (Definición, Finalidad, Implementación, Roles) y IDs sincronizados para la navegación dinámica.

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (ES6)
- **Bibliotecas Externas:** [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/)
- **Fuentes:** [Google Fonts - Roboto](https://fonts.google.com/specimen/Roboto)

## 💻 Instrucciones de Uso y Despliegue

Al ser un sitio web completamente estático, no requiere de una configuración de servidor compleja ni bases de datos para su visualización.

1. Clona o descarga el repositorio en tu máquina local.
2. Navega hasta la carpeta principal del proyecto (donde se encuentra el archivo `index.html`).
3. Abre el archivo `index.html` haciendo doble clic sobre él, o bien, ábrelo en cualquier navegador web moderno (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, etc.).

> **Nota para desarrolladores:** Si deseas modificar el menú principal, los enlaces de interés en la barra lateral o los créditos al pie de página, solo necesitas editar el archivo `js/main.js`. Todos los archivos HTML se actualizarán automáticamente al recargar la página en el navegador.

## 📝 Ejemplo de Reutilización de Código

Esta web utiliza la propiedad `innerHTML` de JavaScript para inyectar componentes, por ejemplo, el pie de página común para todo el sitio:

```javascript
const footer = document.querySelector("footer");

/* Despliegue del contenido del elemento FOOTER (FECHA DINÁMICA) */
const fechaActual = new Date();
const opcionesFecha = { day: 'numeric', month: 'long', year: 'numeric' };
const fechaFormateada = fechaActual.toLocaleDateString('es-ES', opcionesFecha);
const anioActual = fechaActual.getFullYear();

footer.innerHTML = \`
    <p>
            AGROIDEAS &copy;\${anioActual} Actualizada: \${fechaFormateada}
    </p>
\`;
```
