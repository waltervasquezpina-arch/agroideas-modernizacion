# Guia de Estilos UI e Interactividad - AGROIDEAS

## Resumen de UI (User Interface)
El portal adopta una estética **Modern Government / Tech**, combinando la sobriedad institucional con elementos visuales de vanguardia como el efecto espejo (Glassmorphism), sombras suaves y tipografía de alta legibilidad.

## 1. Framework y Metodología (Tailwind CSS)
El sitio utiliza **Tailwind CSS** para la construcción de interfaces. Esto permite:
- **Agilidad:** Diseño mediante clases de utilidad directamente en el HTML.
- **Consistencia:** Espaciados, sombras y radios de borde uniformes en todo el proyecto.
- **Optimización:** Menor dependencia de archivos CSS externos de gran tamaño.

## 2. Sistema de Variables Institucionales
Los colores críticos han sido abstraídos en el archivo `css/modern-styles.css` mediante variables CSS nativas, permitiendo un control temático centralizado:

```css
:root {
    --agro-blue: #1e3a8a;      /* Azul profundo Agroideas */
    --agro-green: #10b981;     /* Verde éxito / Productividad */
    --pcm-red: #c9002b;        /* Rojo institucional PCM */
    --glass-bg: rgba(255, 255, 255, 0.8);
}
```

## 3. Componentes Visuales Clave

### A. Glassmorphism Header
El Navbar utiliza un fondo semi-transparente con filtro de desenfoque (`backdrop-blur`), proporcionando una sensación de profundidad y modernidad.

### B. Cards y Elevación
Las tarjetas de contenido y los bloques de los "Ejes de Gestión" utilizan bordes redondeados pronunciados (`rounded-3xl` o `rounded-[3rem]`) y sombras sutiles que se intensifican al pasar el cursor (`hover:shadow-xl`), simulando elevación física.

### C. Sistema de Iconografía (Lucide)
Se ha migrado a **Lucide Icons**, un set de iconos vectoriales ligero y minimalista. Los iconos se utilizan para guiar la lectura y enfatizar secciones clave, manteniendo una escala consistente (`w-5 h-5` para menús, `w-12 h-12` para secciones destacadas).

### D. Dashboard y Formularios
El panel administrativo (`admin.html`) introduce un diseño de **"Admin Moderno"** con:
- **Modales de Cristal:** Fondos desenfocados (`backdrop-blur-xl`) para formularios de edición.
- **Notificaciones Toast:** Alertas flotantes animadas con código de colores (Verde: Éxito, Rojo: Error, Azul: Info).
- **Botones de Visualización:** Implementación de íconos interactivos (ojito) para campos sensibles como contraseñas.

## 4. Interactividad y Animaciones
- **Transiciones de Tab:** Cambio de pestañas en el admin con efectos de fundido suaves.
- **AOS (Animate On Scroll):** Configurado con una duración de 800ms y un easing `ease-out-cubic`.
- **Efectos Hover:**
    - **Botones Activos:** Cambio de color con transiciones suaves (`duration-300`).
    - **Multimedia:** Efecto de escala (`hover:scale-105`) en contenedores.
    - **Tablas Repositorio:** Resaltado de filas y botones de acción tipo "Floating Button".

## 5. Diseño Responsivo
El portal emplea un enfoque **Mobile-First**. Mediante los prefijos de Tailwind (`md:`, `lg:`), se gestiona la visibilidad de elementos:
- **Escritorio:** Barra de navegación completa y menús laterales ("Aside") persistentes.
- **Móvil:** Menú tipo hamburguesa inyectado dinámicamente y colapsado de secciones en una sola columna vertical.

> [!TIP]
> **Consistencia de Botones:** Para botones de acción principal, utilizar siempre la clase base `bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all`.
