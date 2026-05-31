# Informe de Entrega Final: Plataforma ESV - Ciclo SIPA Dual
**Proyecto:** Espacios Seguros Virtuales (ESV)  
**Entidad:** AGROIDEAS - MIDAGRI  
**Versión:** 3.0 (Zero-Setup Architecture)  
**Fecha:** 3 de abril de 2026  

---

## 1. Visión General del Sistema
La plataforma **ESV** es una solución web estática de alto rendimiento diseñada para facilitar la transición entre la **Gestión del Conocimiento (GC)** y la **Innovación Pública (GIP)** dentro de AGROIDEAS. Basada en el ciclo **SIPA (Sistema de Innovación Pública y Aprendizaje)**, la herramienta permite a los especialistas capturar conocimiento, idear con asistencia de IA y prototipar procesos de forma ágil.

### Premisa Dual
El sistema utiliza una infraestructura compartida pero con objetivos y lógicas diferenciadas:
- **Ruta GC:** Enfocada en la elicitación de conocimiento tácito y creación de Activos de Conocimiento.
- **Ruta GIP:** Enfocada en la resolución de problemas públicos mediante PMVs, con una lógica de **Veto DI NO** para evitar la sobre-ingeniería.

---

## 2. Arquitectura Técnica
Se ha implementado una arquitectura **Zero-Setup**, lo que significa que la aplicación no requiere base de datos de servidor ni frameworks pesados (React/Node), permitiendo su ejecución desde cualquier servidor estático o intranet.

| Componente | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend** | Vanilla JS / Tailwind CSS (Play CDN) | Máxima velocidad y diseño premium modular. |
| **Iconografía** | Lucide Icons | Interfaz moderna y técnica. |
| **Persistencia** | `localStorage` API | Almacenamiento local persistente por contexto (GC/GIP). |
| **Seguridad** | SessionStorage (Vault) | Gestión volátil de la API Key de Gemini (no se guarda en disco). |
| **Motor de IA** | Google Gemini 1.5 Flash | Cerebro del sistema con lógica de mentoría y veto. |
| **Editor Visual** | SVG / Canvas Interactivo | Modelado BPMN 2.0 nativo en el navegador. |

---

## 3. Componentes Core de Desarrollo

### 🧠 `gemini.js` (Motor de IA)
Implementa la lógica del **Mentor GIP**. Integra un sistema de prompts restrictivos que detectan "proyectos de elefante blanco" (sobre-ingeniería) y activan el **Veto DI NO**, obligando al usuario a proponer soluciones de 7 días (PMVs).

### 📐 `canvas-board.js` (Pizarra BPMN)
Un editor gráfico desarrollado desde cero en Vanilla JS que permite:
- Arrastrar y soltar nodos (Tareas, Decisiones).
- Conectar elementos visualmente.
- Auto-guardado en tiempo real dentro del JSON del proyecto activo.

### 📁 `storage.js` (Controlador de Datos)
Gestiona la segregación de datos entre GC e Innovación. Cada proyecto tiene su propio ID, historial de chat de IA y datos de la pizarra.

---

## 4. Estructura de Archivos (Auditada)
```text
/APP Prueba v 3.0/
├── index.html                  # Portal de Acceso Dual
├── assets/
│   ├── css/styles.css          # Sistema de diseño (Glassmorphism)
│   └── js/
│       ├── core.js             # UI Shell, Sidebar y Navegación
│       ├── storage.js          # Lógica de persistencia local
│       ├── gemini.js           # Integración con Google AI
│       └── canvas-board.js     # Motor del Editor Visual
└── pages/
    ├── gc/                     # Ruta Gestión del Conocimiento
    │   ├── inventario.html
    │   ├── fase_a_grounding.html
    │   ├── fase_b_consola_ia.html
    │   ├── fase_c_pizarra_bpmn.html
    │   └── fase_d_publicacion.html
    └── gip/                    # Ruta Innovación Pública
        ├── inventario.html
        ├── fase_a_grounding.html
        ├── fase_b_consola_ia.html
        ├── fase_c_pizarra_bpmn.html
        └── fase_d_publicacion.html
```

---

## 5. Logros de esta Entrega
1.  **Validación del Veto:** El sistema bloquea exitosamente propuestas complejas en la Ruta GIP.
2.  **Navegación Unificada:** El Sidebar inyecta dinámicamente las rutas correctas según el contexto activo.
3.  **UI Premium:** Implementación de gradientes institucionales y efectos de desenfoque de fondo.
4.  **Zero Loss:** La persistencia local garantiza que el usuario no pierda su trabajo al recargar la página.

---

## 6. Instrucciones de Operación
1.  **Puesta en Marcha:** Servir la carpeta raíz mediante un servidor HTTP (ej: Live Server de VS Code, NGINX o la intranet de MIDAGRI).
2.  **Acceso IA:** Al entrar a la Fase B, el sistema solicitará una **Gemini API Key**. Ésta debe ingresarse en el "Vault" de seguridad. La llave se destruirá automáticamente al cerrar el navegador.
3.  **Uso de Pizarra:** En la Fase C, use los botones del lateral para añadir nodos. El sistema guarda los cambios automáticamente cada vez que se mueve o edita un elemento.

---
> [!IMPORTANT]
> **Recomendación para Implementación:** Se sugiere que la Fase A (Grounding) sea alimentada previamente con las Directivas de Gestión del Conocimiento (A.R. 012-2024) y de Innovación Pública (D.S. 004-2023) mediante NotebookLM para un "anclaje de verdad" óptimo.

**Reporte generado por Antigravity - El Futuro de la Gestión Pública.**
