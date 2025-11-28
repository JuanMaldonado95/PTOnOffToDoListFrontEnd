# PruebaTecnica OnOffSolucionesDigitales 

Este proyecto es la solución desarrollada para la prueba técnica .net, cuyo objetivo principal es **evaluar las habilidades técnicas en Angular y .NET 9**, incluyendo arquitectura, gestión de estados, optimización e integración de APIs.
________________________________________________________________________________________________________________________________________________________________________

## 📋 Tabla de Contenidos

- [Características](#características)
- [Arquitectura y Patrones](#arquitectura-y-patrones)
- [Tecnologías](#tecnologías)
- [Prerrequisitos](#prerrequisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Pruebas](#pruebas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Funcionalidades](#funcionalidades)
- [Backend](#backend)

## ✨ Características

- **Autenticación JWT**: Sistema de login con tokens seguros
- **Gestión de Tareas**: CRUD completo (Crear, Leer, Actualizar, Eliminar)
- **Dashboard Interactivo**: Visualización de métricas
- **Interfaz Responsive**: Diseño adaptable a diferentes dispositivos
- **Guards de Rutas**: Protección de rutas con autenticación
- **Interceptores HTTP**: Manejo automático de tokens y errores
- **Notificaciones**: Feedback visual para acciones del usuario
- **Estado Reactivo**: Gestión eficiente del estado con RxJS

## 🏗️ Arquitectura y Patrones

El proyecto implementa las mejores prácticas de Angular:

```
src/
├── app/
│   ├── core/                  # Servicios singleton y guards
│   │   ├── guards/           # Guards de autenticación
│   │   ├── interceptors/     # HTTP interceptors
│   │   └── services/         # Servicios core (auth, API)
│   ├── shared/               # Componentes y módulos compartidos
│   │   ├── components/       # Componentes reutilizables
│   │   ├── models/           # Interfaces y tipos
│   │   └── pipes/            # Pipes personalizados
│   ├── domains/             # Módulos de funcionalidades
│   │   ├── auth/            # Login y autenticación
│   │   ├── dashboard/       # Dashboard
│   │   └── tasks/           # Gestión de tareas
│   └── app.routes.ts        # Configuración de rutas
└── 
```

### Patrones Implementados

| Patrón | Uso | Beneficio |
|--------|-----|-----------|
| **Standalone Components** | Todos los componentes | Mejor tree-shaking y carga modular |
| **Reactive Forms** | Formularios con validación | Control y validación robusta |
| **Guards** | Protección de rutas | Seguridad en navegación |
| **Interceptors** | Manejo de HTTP | Centralización de tokens y errores |
| **Services** | Lógica de negocio | Separación de responsabilidades |
| **RxJS Observables** | Gestión de estado | Programación reactiva eficiente |

## 🛠️ Tecnologías

- **Angular 20** - Framework principal
- **TypeScript 5.6+** - Lenguaje de programación
- **RxJS** - Programación reactiva
- **Angular Router** - Navegación
- **HttpClient** - Comunicación con API
- **SCSS** - Estilos (según configuración)
- **Karma + Jasmine** - Testing

## 📦 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

1. **Node.js** - Versión 18.19 o superior, preferiblemente 22.18.0
   - [Descargar Node.js](https://nodejs.org/)
   - Verificar instalación: `node --version`

2. **npm** - Versión 10 o superior (incluido con Node.js)
   - Verificar instalación: `npm --version`

3. **Angular CLI** - Versión 20.3.12
   ```bash
   npm install -g @angular/cli@20
   ```
   - Verificar instalación: `ng version`

4. **Backend en ejecución** - La API debe estar corriendo en `https://localhost:44363`

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/JuanMaldonado95/PTOnOffToDoListFrontEnd.git
cd PTOnOffToDoListFrontEnd
```

### 2. Instalar Dependencias

```bash
npm install
```

Este comando instalará todas las dependencias necesarias especificadas en `package.json`.

## ⚙️ Configuración

### Configurar URL del Backend

Edita el archivo de entorno correspondiente:

**Para desarrollo** (`src/core/services/api-service`):
```typescript
const BASE_URL = 'https://localhost:44363/api';
```

## ▶️ Ejecución

### Servidor de Desarrollo

Para iniciar el servidor de desarrollo:

```bash
ng serve
```

O para abrir automáticamente en el navegador:

```bash
ng serve --open
```

La aplicación estará disponible en: **http://localhost:4200/**

### Opciones de Desarrollo

```bash
# Servidor en un puerto específico
ng serve --port 4300

### Build de Producción

Para compilar el proyecto para producción:

```bash
ng build
```

Los archivos optimizados se generarán en el directorio `dist/`.

Para build de producción con optimizaciones:

```bash
ng build --configuration production
```

## 🧪 Pruebas

### Pruebas Unitarias

Para ejecutar las pruebas unitarias con Karma:

```bash
ng test
```

Para ejecutar pruebas en modo headless (CI/CD):

```bash
ng test --watch=false --browsers=ChromeHeadless
```

### Cobertura de Código

Para generar reporte de cobertura:

```bash
ng test --code-coverage
```

El reporte se generará en `coverage/`.

## 🎯 Funcionalidades

### 1. Autenticación

- **Login**: Formulario con validación
- **Gestión de Token**: Almacenamiento seguro en localStorage
- **Auto-logout**: En caso de token expirado
- **Protección de Rutas**: Guard para rutas privadas

**Credenciales de prueba:**
- **Usuario**: `user@test.com`
- **Contraseña**: `123456`

### 2. Dashboard

- **Resumen Rápido**: Vista general del estado de tareas

### 3. Gestión de Tareas

- **Listar Tareas**: Vista de todas las tareas del usuario
- **Crear Tarea**: Formulario para nueva tarea
- **Editar Tarea**: Modificación de tareas existentes
- **Eliminar Tarea**: Confirmación antes de eliminar
- **Toggle Estado**: Marcar como completada/pendiente
- **Filtros**: Por estado (todas, completadas, pendientes)

### 4. Notificaciones

- **Mensajes de Éxito**: Confirmación de acciones exitosas
- **Mensajes de Error**: Alertas de errores o validaciones
- **Auto-dismiss**: Desaparición automática después de unos segundos

## 🔌 Integración con Backend

El frontend se comunica con el backend mediante los siguientes endpoints:

### Endpoints Utilizados

| Funcionalidad | Método | Endpoint | Descripción |
|---------------|--------|----------|-------------|
| Login | POST | `/api/auth/login` | Autenticación de usuario |
| Listar Tareas | GET | `/api/tasks` | Obtener todas las tareas |
| Crear Tarea | POST | `/api/tasks` | Crear nueva tarea |
| Actualizar Tarea | PUT | `/api/tasks/{id}` | Modificar tarea |
| Eliminar Tarea | DELETE | `/api/tasks/{id}` | Eliminar tarea |

## 🔧 Scripts Disponibles

```json
{
  "start": "ng serve",                          // Servidor de desarrollo
  "build": "ng build",                          // Build de desarrollo
  "build:prod": "ng build --configuration production",  // Build de producción
  "test": "ng test",                            // Pruebas unitarias
  "test:coverage": "ng test --code-coverage",   // Pruebas con cobertura
  "lint": "ng lint",                            // Linter
  "e2e": "ng e2e"                              // Pruebas E2E
}
```

## 🔐 Seguridad

### Medidas Implementadas

- **JWT Storage**: Token almacenado en localStorage (considera httpOnly cookies en producción)
- **Auth Guard**: Protección de rutas no autorizadas
- **HTTP Interceptor**: Inyección automática de token en requests
- **Error Handling**: Manejo de errores HTTP por petición
- **Sanitización**: Angular sanitiza automáticamente el contenido

### Recomendaciones para Producción

1. Usar **httpOnly cookies** en lugar de localStorage
2. Implementar **refresh tokens**
3. Configurar **CORS** correctamente
4. Usar **HTTPS** en todas las comunicaciones
5. Implementar **rate limiting** en el backend

## 🎨 Personalización

### Estilos

Los estilos globales se encuentran en `src/styles.css`. Para personalizar

```

### Temas

Para implementar temas oscuro/claro, considera usar:
- CSS Variables
- Primeng Theming
- Tailwind CSS

## 🐛 Troubleshooting

### Problemas Comunes

**Error: No se puede conectar al backend**
```
Solución: Verifica que el backend esté corriendo en https://localhost:44363
```

**Error: Token expirado**
```
Solución: Vuelve a iniciar sesión. El token JWT tiene una duración limitada.
```

**Error: CORS**
```
Solución: Configura CORS en el backend para permitir solicitudes desde http://localhost:4200
```

**Error al instalar dependencias**
```bash
# Limpia caché y reinstala
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Despliegue

### Build de Producción

```bash
ng build --configuration production
```

### Opciones de Hosting

- **Vercel**: Despliegue automático desde GitHub
- **Netlify**: Hosting estático con CI/CD
- **Firebase Hosting**: Integración con Firebase
- **AWS S3 + CloudFront**: Hosting escalable
- **Azure Static Web Apps**: Hosting en Azure

### Ejemplo con Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

## 🔗 Backend

Este frontend consume la API del backend desarrollado en .NET 9:

**Repositorio Backend**: [PTOnOffToDoListBackEnd](https://github.com/JuanMaldonado95/PTOnOffToDoListBackEnd)

**Importante**: Asegúrate de tener el backend corriendo antes de iniciar el frontend.

## 📝 Notas Adicionales

- El proyecto usa **Standalone Components** (Angular 20+)
- La autenticación se maneja mediante **JWT tokens**
- Los formularios usan **Reactive Forms** con validación
- El estado se gestiona de forma reactiva con **RxJS**

## 📄 Licencia

Este proyecto fue desarrollado como parte de una prueba técnica para OnOff Soluciones Digitales.

## 👤 Autor

**Juan Maldonado**
- GitHub: [@JuanMaldonado95](https://github.com/JuanMaldonado95)
- Frontend: [PTOnOffToDoListFrontEnd](https://github.com/JuanMaldonado95/PTOnOffToDoListFrontEnd)
- Backend: [PTOnOffToDoListBackEnd](https://github.com/JuanMaldonado95/PTOnOffToDoListBackEnd)

## 📚 Recursos Adicionales

- [Angular Documentation](https://angular.dev/)
- [Angular CLI Reference](https://angular.dev/tools/cli)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

---

**¿Necesitas ayuda?** Si encuentras algún problema durante la instalación o ejecución, por favor abre un issue en el repositorio.


