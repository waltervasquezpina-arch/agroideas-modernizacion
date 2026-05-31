# Integración con Sistemas Externos y Escalabilidad

## 1. Integración Futura con SharePoint (Intranet GxP)
El actual "Portal de Gestión del Conocimiento" está diseñado como una solución de Front-End ligera, con miras a ser integrada (o enlazada directamente) desde la futura Intranet Institucional (SharePoint u otra plataforma corporativa).

### Escenarios de Convivencia:
- **IFrame o Web Part:** El portal puede ser incrustado directamente dentro de una página de SharePoint utilizando un componente *Page Viewer* o *Web Part* personalizado de SharePoint Framework (SPFx).
- **Redirección Single Sign-On (SSO):** Al estar bajo el dominio `@agroideas.gob.pe`, se puede integrar el módulo de validación frontend actual con la API de Microsoft Graph o Azure AD para heredar la sesión del usuario logueado en Windows/Office 365.

## 2. API de Repositorio (Proyección Backend)
Actualmente, el sistema consume un `content.json` local. La capa de acceso a datos (`content-loader.js`) está estructurada de forma modular. Para migrar a un backend real (ej. Node.js, Python/Django, o API de SharePoint List):
1. **Endpoint REST:** Reemplazar la ruta `/data/content.json` por una llamada `fetch` a un endpoint REST (ej. `https://api.agroideas.gob.pe/v1/repositorio`).
2. **CORS:** Configurar correctamente los encabezados CORS en el futuro servidor backend.
3. **Paginación del Lado del Servidor:** La integración actual de DataTables soporta `serverSide: true`. Cuando el JSON exceda los 5,000 registros, la carga de datos deberá delegarse al servidor de base de datos para no penalizar el rendimiento del navegador.

## 3. Escalabilidad del Gestor de Contenidos
El panel administrativo (Admin Dashboard) actual genera un JSON. Si se requiere un sistema más robusto:
- El formulario de administración puede enviar un `POST` o `PUT` a una API, en lugar de descargar el archivo.
- Incorporación de **Niveles de Aprobación**: Los cambios guardados pueden pasar a estado *Borrador* (Draft) y enviar un correo electrónico al coordinador GxP para ser pasados a estado *Publicado* (Published).

## 4. Analítica Web y Monitoreo
Para medir el éxito de la plataforma:
- **Google Analytics / MS Clarity:** Los tags de seguimiento deben ser incrustados en `index.html` (dentro del `<head>`) y en todas las páginas de sección para medir:
  - Búsquedas más frecuentes en el repositorio.
  - Tiempo de permanencia por documento.
  - Tasa de descarga de anexos.
- **Auditoría de Errores:** Se recomienda integrar Sentry o equivalente en `main.js` para registrar errores de carga en dispositivos de usuarios finales bajo redes de oficinas remotas.
