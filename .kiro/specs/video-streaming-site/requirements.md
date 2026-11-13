# Requirements Document

## Introduction

Sitio web MVP dockerizado para reproducción de videos, estilo YouTube simplificado. Construido con Python + Flask como backend, HTML/CSS/JS vanilla en el frontend, y empaquetado con Docker. El sitio se despliega dentro de la carpeta `video-project/` y sirve los archivos de video existentes en `videos/` a través de una interfaz web minimalista con diseño oscuro.

## Requirements

### Requirement 1: Listado de Videos en el Sidebar

**User Story:** Como usuario, quiero ver una lista de videos disponibles en el sidebar para poder seleccionar cuál reproducir.

#### Acceptance Criteria

1. WHEN el usuario abre la página principal THEN el sistema SHALL mostrar un sidebar con la lista de videos disponibles obtenida de `/api/videos`
2. WHEN el backend recibe una petición GET `/api/videos` THEN el sistema SHALL retornar un JSON con la lista de archivos `.mp4` encontrados en la carpeta `videos/`, cada uno con `name` (sin extensión) y `filename` (nombre de archivo completo)
3. WHEN no hay videos en la carpeta `videos/` THEN el sistema SHALL retornar un JSON con una lista vacía y el sidebar SHALL mostrar un mensaje indicando que no hay videos disponibles

---

### Requirement 2: Reproducción de Video

**User Story:** Como usuario, quiero reproducir un video seleccionado desde el sidebar para verlo en el reproductor central.

#### Acceptance Criteria

1. WHEN el usuario hace clic en un video del sidebar THEN el sistema SHALL cargar ese video en el elemento `<video>` central usando `src=/videos/<filename>`
2. WHEN el elemento `<video>` tiene un src válido THEN el sistema SHALL mostrar los controles nativos del navegador mediante el atributo `controls`
3. WHEN el backend recibe una petición GET `/videos/<filename>` THEN el sistema SHALL servir el archivo de video con soporte de HTTP range requests para permitir seeking y streaming eficiente

---

### Requirement 3: Pantalla de Bienvenida con Logo

**User Story:** Como usuario, quiero ver el logo del sitio mientras no hay video seleccionado para identificar la plataforma.

#### Acceptance Criteria

1. WHEN el usuario carga la página y no ha seleccionado ningún video THEN el sistema SHALL mostrar `logo.jpeg` en el área central del reproductor
2. WHEN el backend recibe una petición GET `/static/logo` THEN el sistema SHALL servir el archivo `logo/logo.jpeg`
3. WHEN el usuario selecciona un video THEN el sistema SHALL ocultar el logo y mostrar el reproductor de video

---

### Requirement 4: Diseño Oscuro

**User Story:** Como usuario, quiero que el sitio tenga un diseño oscuro y limpio para una experiencia visual agradable.

#### Acceptance Criteria

1. WHEN el usuario accede al sitio THEN el sistema SHALL presentar un diseño oscuro con sidebar izquierdo para la lista de videos y área principal derecha para el reproductor
2. WHEN se renderiza la interfaz THEN el sistema SHALL aplicar estilos que incluyan fondo oscuro, texto claro, y destacado visual al video seleccionado en el sidebar
3. WHEN el sitio es visualizado en un navegador moderno THEN el sistema SHALL ser funcional con HTML/CSS/JS vanilla sin dependencias externas de frontend

---

### Requirement 5: Dockerización

**User Story:** Como operador, quiero que el sitio corra en Docker para facilitar el despliegue y aislamiento del entorno.

#### Acceptance Criteria

1. WHEN se construye la imagen Docker THEN el sistema SHALL usar `python:3.11-slim` como imagen base e instalar las dependencias desde `requirements.txt`
2. WHEN se inicia el contenedor THEN el sistema SHALL exponer el puerto `5000` y la aplicación Flask SHALL ser accesible en `http://localhost:5000`
3. WHEN se ejecuta `docker-compose up` THEN el sistema SHALL montar `video-project/videos/` como volumen en `/app/videos/` y `video-project/logo/` como volumen en `/app/logo/` dentro del contenedor
4. WHEN el contenedor está corriendo THEN el sistema SHALL servir la aplicación Flask con el servidor de desarrollo integrado
