# Documentación Técnica: Plataforma de Gestión del Conocimiento GxP

Esta carpeta contiene la documentación técnica y funcional para la Plataforma Web "Gestión del Conocimiento", desarrollada para **AGROIDEAS GxP**.

## Índice de Documentos

1. **[Arquitectura Estructural y Tecnológica](./1_Arquitectura_Estructural.md)**
   Detalla las tecnologías base utilizadas en el desarrollo (HTML5, Bootstrap 5, SCSS/Sass), estructura de directorios, el motor de plantillas visuales y la justificación técnica detrás de su elección.

2. **[Guía de Estilos UI e Identidad Visual](./2_Guia_de_Estilos_UI.md)**
   Explica la identidad corporativa y la guía de diseño adoptada, incluyendo las variables SCSS (colores corporativos de AGROIDEAS), fuentes tipográficas, componentes interactivos y adaptabilidad móvil.

3. **[Manual de Despliegue y Mantenimiento de Servidores](./3_Manual_Despliegue_Mantenimiento.md)**
   Proporciona las instrucciones técnicas para instalar o migrar el código fuente al hosting o servidor institucional de la entidad, usando FTP/IIS/Apache/Nginx, con guías paso a paso.

4. **[Arquitectura de Datos e Interacción Dinámica (Panel de Control)](./4_Arquitectura_Datos_Interaccion.md)**
   Explica la lógica del sistema frontend mediante un JSON desacoplado, el funcionamiento del Panel de Administración (seguridad de correo corporativo), inyección de contenido y el Repositorio de DataTables.

5. **[Integración con Sistemas Externos y Escalabilidad](./5_Integracion_Sistemas_Externos.md)**
   Proyección hacia el futuro. Establece las bases e hitos necesarios para incrustar esta solución en un entorno SharePoint, validaciones con Active Directory u otra API Backend.

## Resumen del Proyecto
La Plataforma "Gestión del Conocimiento GxP" no es solamente una página web, es una solución de repositorio documental e informativo, modular, 100% responsiva y segura. 
Su diseño "Backend-Less" (sin base de datos SQL local) le confiere máxima velocidad, seguridad contra inyecciones SQL y un coste en servidores mínimo. Al estar basada en archivos JSON estructurados, permite la edición de contenidos por usuarios administradores (Coordinador GxP) a través de un Dashboard Frontend autenticado.

> Esta documentación debe ser entregada al área de Tecnologías de la Información (OTI) o a los futuros programadores y consultores encargados del mantenimiento de la plataforma.
