# Guía de Estilos UI e Interactividad - AGROIDEAS

## Resumen de UI (User Interface)
La presentación completa del sitio previene del uso de frameworks pesados (`Bootstrap`, `Tailwind`) para proteger el peso final del bundle. El desarrollo ha escalado sobre CSS3 nativo puro orientado por la arquitectura oficial BEM de sus clases.

## 1. Patrón de Diseño CSS (BEM)
La nomenclatura de estilos en `style.css` se ejecuta basándose estrictamente en el paradigma **Block, Element, Modifier (BEM)** con fines de alta estandarización para el escaneo visual de cualquier desarrollador entrante.
Ejemplo generalizado en nuestra hoja:
- **Bloque:** `.menu`
- **Elemento (Separador Doble-guiónbajo):** `.menu__ul`, `.menu__li`, `.menu__a`
- **Modificador (Separador Doble-guión):** `.menu__item--has-dropdown`

## 2. Sistema Gestor de Variables Tématicas (El Tema 'AGROIDEAS')
Todo el código de colores, transiciones y geometría ha sido abstraído a la raíz semántica en lo más alto de `style.css` a manera de Propiedades Personalizadas CSS. Esto provee control "Theme-Global":

```css
:root {
	/* Tema Oficial AGROIDEAS */
	--color-primary: #123769;     /* Azul Institucional */
	--color-secondary: #0ea5e9;   /* Acento Celeste */
	--color-text-main: #333333;   /* Texto Lectura */
	--color-text-muted: #555555;  /* Texto Secundario / Párrafos */
    ---(...)
```
*Si la identidad corporativa sufre un cambio a futuro, sólo será necesario alterar estas dos líneas hexadecimales* para teñir instantáneamente tarjetas, bordes, headers, acentos y hover-states alrededor del servidor.

## 3. Disposición y Responsividad (Grid & Flexbox)
Todas las tácticas CSS desfasadas como *floatings* (`float: left/right`) y anchos exactos en píxeles rígidos fueron limpiados en la Refactorización.
*   **Flexbox Principal:** Usado a lo largo del eje Z (`column`) transversal para separar el `<header>`, `<main>` y `<footer>`. Empleado paralelamente en su eje `X` (`row nowrap`) para disponer de forma armoniosa al componente `sidebar` y la sección de lectura de contenido.
*   **CSS Grid (Tarjetas):** Para listas de documentación o categorías se instanció robustamente el comando `display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));`. Este mágico comportamiento garantiza que las tarjetas rellenen cualquier vació y colapsen apilándose ordenadamente hacia el eje Y conforme las pantallas se reduzcan a tamaños de tableta o teléfono móvil (IPhone/Android).

> [!IMPORTANT]
> **Integridad del Layout:** Es imperativo utilizar el Doctype HTML5 (`<!DOCTYPE html>`) en todas las páginas. El uso de doctypes antiguos (como XHTML Strict) rompe el renderizado de Flexbox en navegadores modernos, causando que el `aside` se desplace fuera de su contenedor. Asimismo, el `aside` debe ser siempre hijo directo de `main`.

## 4. Estética Premium e Interactividad (Web 3.0)
Nuestros contenedores clase `.contenido__tarjeta` portan interactividad enriquecida y *Micro-animaciones* nativas construidas con funciones matemáticas matemáticas avanzadas (`cubic-bezier(0.175, 0.885, 0.32, 1.275)`).
Esto provoca que, al suceder un estado `:hover`:
1.  **Elevación elástica:** La tarjeta no suba bruscamente, sino que rebote simulando expansión topológica visual.
2.  **Saturación Viva (Imágenes):** La iconografía que habita en las tarjetas tiene programado un desaturador pasivo (`grayscale: 60%`); dicho filtro salta a `0%` devolviendo intenso color de foco al instante de la interacción del mouse.
3.  **Botonería Activa:** Los botones al pie y títulos cambian sus colores al espectro inverso o activan variaciones del azul al celeste mediante `linear-gradients`.

## 5. Accesibilidad Cross-Platform (Resolución)
El código aloja una Media Query `@media (max-width: 900px)` y `@media (max-width: 600px)` las cuales dictaminan la destrucción temporal de la columna flex desplegando verticalmente el Sidebar abajo del documento en Móviles, y ordenando los Menús en listas anchas 100% responsivas, pasando de un Menú de Escritura central Horizontal, hacia columnas adaptables amigables al tacto (Touch Targets).
