# Nuestro reto — ahorro + canción del día

Página simple para llevar juntos un reto de ahorro (empieza en $1.000.000, pero puedes seguir agregando días cuando quieras) y para que ella pueda ver la canción que le dedicas cada día, con acceso a las anteriores.

No necesitas saber programar para usarla día a día: una vez está montada, solo edites dos archivos (`config.js` y `canciones.js`) directamente desde la página de GitHub en el navegador.

## 1. Publicar la página (GitHub Pages, gratis)

1. Crea un repositorio nuevo en GitHub (puede ser público).
2. Sube estos archivos tal como están (botón "Add file → Upload files").
3. Ve a **Settings → Pages**, y en "Branch" selecciona `main` y la carpeta `/ (root)`. Guarda.
4. En un par de minutos tu página va a estar en `https://tu-usuario.github.io/tu-repositorio/`.

## 2. Activar el ahorro sincronizado (Firebase, gratis)

Como van a marcar los días cada uno desde su celular, necesitan una basecita de datos gratuita que los mantenga sincronizados. Firebase de Google tiene un plan gratis que sobra para esto.

1. Entra a [console.firebase.google.com](https://console.firebase.google.com) e inicia sesión con una cuenta de Google.
2. Crea un proyecto nuevo (el nombre no importa, ej. "nuestro-reto").
3. En el menú lateral entra a **Firestore Database → Crear base de datos**. Elige modo **producción** y la ubicación más cercana (ej. `southamerica-east1`).
4. Ve a la pestaña **Reglas** de Firestore y reemplaza el contenido por esto, luego "Publicar":

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /reto/{docId} {
         allow read, write: if true;
       }
     }
   }
   ```

   Nota: esto deja el documento abierto a quien conozca la URL de tu proyecto. Para un uso privado entre ustedes dos es un riesgo muy bajo (nadie va a adivinar tu proyecto), pero es bueno que lo sepas.

5. Vuelve al panel principal del proyecto, click en el ícono `</>` ("Agregar app web"), ponle un nombre y crea la app. Firebase te va a mostrar un bloque `firebaseConfig = {...}`.
6. Copia esos valores dentro de `firebase-config.js`, reemplazando los `"TU_..."`.
7. Sube de nuevo ese archivo a GitHub (o edítalo directo ahí, ver abajo).

Con eso, cuando cualquiera de los dos marque un día en su celular, el otro lo va a ver marcado también, al instante.

## 3. Agregar la canción del día

1. Busca la canción en Spotify, dale click a los tres puntos (···) → **Compartir → Copiar enlace a la canción**.
2. El enlace se ve así: `https://open.spotify.com/track/3AJwUDP919kvQ9QcozQPxg?si=...` — el código entre `/track/` y `?si=` es el que necesitas.
3. Abre `canciones.js` y agrega una línea con la fecha de ese día y el código:

   ```js
   "2026-09-12": { id: "ESE_CODIGO", nota: "Para cuando te extrañé todo el día" }
   ```

4. Guarda y sube el archivo. La canción va a aparecer automáticamente ese día, ni un día antes.

**Para editar sin instalar nada:** entra a tu repositorio en github.com, abre `canciones.js`, dale click al lápiz (editar) arriba a la derecha, agrega tu línea, y abajo dale "Commit changes". Un par de minutos después ya está en la página. Puedes hacerlo día a día, o dejar cargada toda la semana de una vez — las fechas futuras quedan ocultas solas hasta que llegue el día.

## 4. Agregar fotos al álbum

1. En tu repositorio de GitHub, entra a la carpeta `fotos`.
2. Dale click a **Add file → Upload files** y sube tus fotos (jpg, png o webp).
3. Abre `fotos.js` y agrega una línea por cada foto que subiste, con el nombre exacto del archivo:

   ```js
   { archivo: "fotos/playa.jpg", texto: "Nuestro primer viaje" }
   ```

4. Guarda los cambios. Las fotos van a aparecer en la página, y al tocarlas se ven en grande.

Tip: si las fotos pesan mucho (varios MB cada una), la página va a cargar más lento — si puedes, comprímelas un poco antes de subirlas.

## 5. Personalizar

Abre `config.js` para cambiar:
- `tituloMeta`: el nombre de la meta (ej. `"el viaje a Santa Marta"`).
- `fechaInicio`: el día 1 del reto, si no es hoy.
- `montos`: la lista de montos, uno por día. Trae 60 valores que suman $1.000.000, pero no estás limitado a eso — puedes agregar más números al final de la lista cuando quieras (por ejemplo, si terminan el reto y quieren seguir ahorrando). La meta que aparece arriba en la página se calcula sola sumando todo lo que haya en la lista, así que sube automáticamente.

## Archivos

- `index.html` — la estructura de la página.
- `style.css` — el estilo visual.
- `app.js` — la lógica (no hace falta tocarlo).
- `config.js` — datos del reto de ahorro. **Edítalo tú.**
- `canciones.js` — la lista de canciones. **Edítalo tú, seguido.**
- `fotos.js` — la lista de fotos del álbum. **Edítalo tú, seguido.**
- `fotos/` — carpeta donde van los archivos de las fotos.
- `firebase-config.js` — credenciales de tu proyecto de Firebase. **Edítalo una sola vez.**
