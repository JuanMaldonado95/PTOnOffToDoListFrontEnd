# PruebaTecnica OnOffSolucionesDigitales 

Este proyecto es la solución desarrollada para la prueba técnica .net, cuyo objetivo principal es **evaluar las habilidades técnicas en Angular y .NET 9**, incluyendo arquitectura, gestión de estados, optimización e integración de APIs.

El proyecto implementa una aplicación completa de **Lista de Tareas (To-Do List)** que cumple con los siguientes requisitos funcionales:

* **Autenticación:** Implementación de un flujo de Inicio de Sesión (Login) con autenticación basada en JWT a través de la API de .NET 9.
* **Gestión de Tareas (CRUD):** Funcionalidad completa para ver, agregar, editar, eliminar y marcar tareas como completadas/pendientes.
* **Dashboard:** Visualización de métricas clave (total, completadas, pendientes).
* **Notificaciones:** Retroalimentación al usuario mediante mensajes de éxito o error.

________________________________________________________________________________________________________________________________________________________________________

### A. Arquitectura y Estructura del Frontend (Angular 20)

| Requisito Técnico | Decisión Implementada | Justificación |
| :--- | :--- | :--- |
| **Estructura Base** | Componentes Standalone (Independientes) para toda la aplicación. | Simplifica la estructura del proyecto eliminando la necesidad de NgModules boilerplate. Mejora la claridad del código y la gestión de dependencias directas en cada componente, ademas es el estandar actual para angular. |
| **Optimización** | **Lazy Loading** implementado en `app.route.ts`, `auth.route.ts`, `dashboard.route.ts` y `task.route.ts` . Además, se usó `trackByTask` en la tabla del componente 'Task' para optimizar el rendimiento de renderizado. | Reduce el tamaño del bundle inicial y mejora la experiencia de usuario al cargar los componentes solo cuando se necesitan. |
| **Estilos** | **PrimeNG y Tailwind CSS** | PrimeNG proporciona componentes UI accesibles y listos para producción. Tailwind CSS se utiliza para la creación de layouts flexibles y un diseño completamente responsive, complementando a PrimeNG. |
| **Manejo de API** | Implementación de **HTTP Interceptor**. | Usado para inyectar automáticamente el token JWT en cada solicitud saliente (Auth Interceptor) y para manejar errores HTTP de manera centralizada. |

________________________________________________________________________________________________________________________________________________________________________

### Prerrequisitos Tecnicos


