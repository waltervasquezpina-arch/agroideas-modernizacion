# Manual de Despliegue y Mantenimiento - Portal AGROIDEAS

## Requisitos Previos al Despliegue
Este portal (al ser completamente `Estático Front-End`) no exige la instalación de complejas infraestructuras de backend. 
**No se necesita instalar PHP, NodeJS, Python, MySQL ni ningún runtime de lado de servidor.**

Las tecnologías nativas implementadas y que todos los navegadores leen intrínsecamente son:
- **HTML5:** Lenguaje estructural semántico.
- **CSS3:** Hoja de Estilos (Con Arquitectura BEM).
- **ES6 (JavaScript Vanilla):** Inyector DOM Dinámico (sin requerimiento de frameworks pesados).

## 1. Despliegue en Entorno de Desarrollo (Local)
Para revisar, editar o probar la aplicación de manera estrictamente local en la computadora del desarrollador:

1. Proveerse de los ficheros nativos clónicos y almacenarlos en cualquier directorio (e.g. `C:/Proyectos/AGROIDEAS_Portal`).
2. Abrir el directorio clonado ingresando en la carpeta raíz.
3. Buscar el archivo **`index.html`** (o cualquier .html adyacente) y ejecutarlo haciendo "Doble Clic" o seleccionando "Abrir Con > [Navegador de Preferencia como Google Chrome]".
4. Todos los estilos y dependencias interconectan automáticamente por la lógica implícita de `main.js`. 

## 2. Despliegue en Producción (Cloud / Servidor Físico)
Dado su ligereza de ejecución, es escalable en ambientes virtuales en minutos:

**- En un Servidor On-Premise (Propio de la institución):**
1. Ingresar o desplegar un gestor HTTP (Apache, NGINX).
2. Volcar íntegramente toda la carpeta física `pag_web_reutilizable-main-main/` dentro de la carpeta pública del servidor base típicamente instanciada como `/var/www/html` o `/htdocs`.

**- En Contenedores Cloud Gratuitos / Serverless (ej. GitHub Pages / Netlify / Vercel):**
1. Crear un Commit con todos los archivos al repositorio base respectivo ("Branch: Main").
2. Conectar la instancia Cloud. Dado que no hay compilaciones `package.json`, la mayoría de estos hosts desplegarán e interconectarán el DNS al `index.html` casi instantáneamente usando el Motor estático por defecto.

## 3. Protocolos de Mantenimiento Específico 

### Alterar Enlaces del Menú Principal
Para agregar botones o páginas a las pestañas superiores (Modernización GP, NT Modernización, Contacto), **NUNCA** editar una página HTML a la vez.

El programador debe abrir directamente `js/main.js` en su IDE, localizar el bloque reservado del `innerHTML` de `<header>`, y dentro, buscar la estructura visual del Menú HTML.
Si se busca agregar un enlace simple, clonar la siguiente estructura `<li>` como hermana de contacto:

```html
<li class="menu__li">
    <a class="menu__a" href="nueva_pagina.html">Mi Botón Nuevo</a>
</li>
```

Si se busca expandir el menú desplegable (El dropdown de _NT Modernización_), localizar el `<ul class="submenu__ul">` e insertar adentro el nuevo elemento `<li>`:

```html
<li class="submenu__li"><a class="submenu__a" href="nueva_gestion.html">Mi Submateria Extra</a></li>
```

Al igual que el header, el menú de navegación complementario lateral y los hipervínculos del `<aside>` y pie de página inferior (Footer), obedecen la programación inyectable de `main.js`. 

> [!TIP]
> **Nuevas Secciones:** Si se añaden nuevas secciones de contenido, asegúrese de usar los IDs `Definición`, `Finalidad`, `Implementación` y `Roles` para que los enlaces del menú "TOPICOS" (Aside) funcionen automáticamente.

La fecha de copyright se formatea al idioma local y se compila a la hora del localizador por lo que el mantenedor jamás requerirá intervenir el texto.
