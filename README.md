# Brawl Stars Coach

Sitio web estático (HTML, CSS y JavaScript) para ayudar a mejorar en **Brawl Stars** con:

- Consejos de **matchups** (qué brawlers funcionan mejor o peor contra otros).
- Recomendaciones por **mapa y modo de juego**.
- **Academia** con lecciones, progreso y pruebas.
- **Registro/login** y guardado de datos en **Supabase**.

> **Aviso**: Este proyecto es una herramienta fan-made con fines educativos. No está afiliado, respaldado ni patrocinado por Supercell. Brawl Stars y sus nombres/marcas pertenecen a Supercell.

## Estructura

```text
brawl-stars-coach/
├── assets/
├── css/
│   └── styles.css
├── js/
│   ├── supabase-config.js   # Configuración de Supabase (editar)
│   ├── supabase-client.js   # Cliente y helpers de Supabase
│   ├── data.js              # Datos base: brawlers, modos, mapas, matchups
│   ├── app.js               # UI compartida y helpers
│   ├── matchups.js          # Lógica de la página de matchups
│   ├── maps-modes.js        # Lógica de mapas/modos
│   ├── academy.js           # Curso, progreso y pruebas
│   └── profile.js           # Registro, login, perfil y estadísticas
├── supabase/
│   └── schema.sql           # Tablas, RLS y políticas para Supabase
├── index.html
├── matchups.html
├── maps-modes.html
├── academy.html
├── profile.html
└── README.md
```

## Requisitos

- Navegador moderno (Chrome, Edge, Firefox, etc.) en Windows.
- Cuenta de [Supabase](https://supabase.com/).
- Para pruebas locales con Supabase Auth, sirve los archivos por HTTP (no `file://`).

## Configurar Supabase

1. Crea un proyecto en Supabase.
2. En el SQL Editor de Supabase, ejecuta el contenido de [`supabase/schema.sql`](supabase/schema.sql).
3. En **Authentication > Providers**, habilita Email.
4. Copia la **Project URL** y la **anon/public key** desde Project Settings > API.
5. Edita [`js/supabase-config.js`](js/supabase-config.js):

```js
window.SUPABASE_URL = "https://TU-PROYECTO.supabase.co";
window.SUPABASE_ANON_KEY = "TU_ANON_KEY";
```

> Usa solo la clave `anon`. Nunca expongas la `service_role` key en el frontend.

## Ejecutar localmente

Como es un sitio estático, puedes usar cualquier servidor simple. Ejemplos:

```bash
# Python
python -m http.server 5500

# Luego abre
# http://localhost:5500
```

También puedes usar la extensión "Live Server" de VS Code.

## Desplegar en GitHub Pages

1. Sube este repositorio a GitHub.
2. Ve a **Settings > Pages**.
3. Selecciona la rama (por ejemplo `main`) y carpeta `/root`.
4. Guarda. GitHub Pages publicará el sitio.

Asegúrate de que `js/supabase-config.js` tenga los valores correctos del proyecto Supabase público.

## Funciones de la base de datos

El esquema de Supabase guarda:

- **profiles**: datos de perfil del usuario.
- **course_progress**: lecciones completadas y progreso.
- **quiz_attempts**: intentos y puntajes de pruebas.
- **user_brawler_stats**: estadísticas personales opcionales por brawler/mapa/modo.

Las tablas usan **Row Level Security (RLS)** para que cada usuario solo acceda a sus propios datos.

## Personalización

- Edita [`js/data.js`](js/data.js) para agregar más brawlers, mapas, modos, matchups y lecciones.
- Ajusta estilos en [`css/styles.css`](css/styles.css).
- Amplía el esquema en [`supabase/schema.sql`](supabase/schema.sql) si necesitas más métricas.

## Nota sobre datos del juego

Los datos incluidos son ejemplos orientativos para la app. El meta de Brawl Stars cambia con balanceos; revisa y actualiza las recomendaciones periódicamente.
