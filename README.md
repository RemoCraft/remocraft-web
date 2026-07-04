# remocraft-web

## Qué es esta web
RemoCraft Web es el sitio oficial de tu servidor de Minecraft, diseñado para presentar la experiencia Survival Towny RPG y su comunidad. La web ofrece información del servidor, anuncios, reglas, equipo, contacto y una sección de guías en progreso, tanto en inglés como en español.

## Estructura principal
- `index.html`: página principal en inglés.
- `es/index.html`: página principal en español.
- `navbar.html` y `footer.html`: cabecera y pie compartidos que se cargan dinámicamente en cada página.
- `css/global.css`: estilos compartidos por toda la web.
- `css/pages/*.css`: estilos específicos por sección o página.
- `js/navbar-loader.js`: script responsable de cargar el navbar y footer, traducir el menú, ajustar enlaces según idioma y activar la página actual.
- `assets/announcements-en.json` y `assets/announcements-es.json`: datos de anuncios por idioma.

## Idiomas y navegación
- La web es bilingüe: inglés en la raíz (`/`) y español bajo `/es/`.
- `navbar-loader.js` detecta el idioma actual y adapta los enlaces internos y el selector de idioma.
- El comportamiento deseado es mantener al usuario en la misma versión lingüística: al hacer clic en Contacto desde `/es/`, se queda en español; desde `/contact.html` en inglés, se queda en inglés.
- Los enlaces de redes sociales del pie también se ajustan según idioma en el script.

## Páginas y secciones clave
- Página principal: descripción del servidor, modo Survival Towny RPG, Bedwars, Discord, votaciones y preguntas frecuentes.
- Contacto: formulario de contacto con configuración para envío mediante `formsubmit.co`.
- Team: listado del equipo y staff.
- Rules: reglas del servidor.
- Announcements: carga anuncios dinámicamente desde JSON y soporta paginación.
- Guides: sección en desarrollo con ramas para:
  - `guides/` y `es/guides/`
  - `guides/survival_towny/` y sus páginas hijas: `crafts.html`, `towns.html`, `solid_xp.html`
  - `guides/bedwars/`

## Estado actual y prioridades
- La sección de guías está en desarrollo activo.
- La última implementación relevante fue la guía de experiencia sólida (`solid_xp`).
- Es probable que los siguientes días la mayor parte del trabajo quede en las guías, especialmente en contenido sobre crafteos y sistemas internos.
- También conviene tener en cuenta la necesidad de reparar y terminar las secciones relacionadas con libros o tutoriales internos de juego.

## Notas técnicas importantes
- La web se entiende como un sitio estático, optimizado para hospedaje simple.
- Usa `font-awesome` y fuentes de Google para iconos y tipografía.
- La cabecera y el pie se reutilizan en todas las páginas, lo que facilita mantener la navegación y los enlaces sociales consistentes.
- El sitio está preparado para SEO básico con etiquetas `canonical`, `alternate hreflang` y metadatos Open Graph.

## Resumen rápido
RemoCraft Web es un sitio estático bilingüe que presenta el servidor de Minecraft, su comunidad y sus guías. Su arquitectura es modular, con contenidos compartidos para navbar/footer y páginas específicas por idioma. El foco de desarrollo actual está en ampliar y mejorar las guías, especialmente las relacionadas con el sistema de crafteo y la experiencia sólida.

## Notas para desarrolladores
- La web es bilingüe y debe mantener la misma estructura en inglés y español.
- `navbar.html` contiene la navegación principal; `js/navbar-loader.js` carga esta barra y ajusta los enlaces para `/es/` automáticamente.
- Los modos principales en el home usan tarjetas con imagen hover, por ejemplo:
  - `img` con `data-hover-prefix="..."`, `data-hover-count` y `data-hover-extension`.
  - El prefijo debe coincidir con los nombres reales de las imágenes en `images/`.
  - En las tarjetas de los modos deben añadirse enlaces reales `Learn more` / `Saber más` a las ramas de guías correspondientes, no botones vacíos.
- La nueva modalidad debe seguir el mismo patrón que las existentes:
  - `Ores` en inglés y `Minerales` en español.
  - URLs de guía como `/guides/ores/` y `/es/guides/ores/`, no páginas sueltas en la raíz.
  - Las ramas de guías deben tener un `index.html` con estructura de guía en el mismo formato que `guides/bedwars/` y `guides/survival_towny/`.
  - Los subpáginas de una rama de guía deben usar la misma clase de cabecera de modo en `section#header`, por ejemplo `class="survival-header"` para Towny o `class="ores-header"` para Ores, para obtener la imagen de fondo correcta.
  - Si una tarjeta o botón dentro de las guías no apunta a ninguna página, debe eliminarse temporalmente hasta que haya una página real.
- Use el mismo estilo de metadatos Open Graph y `canonical`/`alternate hreflang` para cada idioma y rama de guía.
- La carpeta `images/` puede contener variantes hover numeradas, por ejemplo `ores-minigames-image-1.webp` a `ores-minigames-image-5.webp`, y el código `home.js` generará las rutas.
- Nota importante: cuando el usuario indique que se ha aprendido algo nuevo sobre la estructura de las guías o el comportamiento bilingüe, actualiza explícitamente esta sección de desarrollador con el aprendizaje más reciente.
