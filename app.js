// ============================================================
// No necesitas tocar este archivo para personalizar la página.
// Los datos que sí puedes editar están en config.js y canciones.js
// ============================================================

const MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

function formatCOP(n) {
  return "$" + n.toLocaleString("es-CO");
}

function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatearFechaCorta(fechaStr) {
  const [, m, d] = fechaStr.split("-");
  return `${d}/${m}`;
}

function formatearFechaLarga(fechaStr) {
  const [, m, d] = fechaStr.split("-");
  return `${parseInt(d, 10)} de ${MESES[parseInt(m, 10) - 1]}`;
}

// --- Construir los 60 días a partir de config.js ---
const fechaInicio = new Date(CONFIG.fechaInicio + "T00:00:00");
const dias = CONFIG.montos.map((monto, i) => {
  const fecha = new Date(fechaInicio);
  fecha.setDate(fecha.getDate() + i);
  return { numero: i + 1, fechaStr: toISODate(fecha), monto };
});

const hoyStr = toISODate(new Date());
const diffDias = Math.round((new Date(hoyStr + "T00:00:00") - fechaInicio) / 86400000);
const diaActual = Math.min(Math.max(diffDias + 1, 1), CONFIG.montos.length);

document.getElementById("texto-dia").textContent = `Día ${diaActual} de ${CONFIG.montos.length}`;
document.getElementById("texto-meta").textContent = CONFIG.tituloMeta;

// La meta total se calcula sola sumando todos los montos de config.js,
// así que crece automáticamente si agregas más días a la lista.
const metaTotal = CONFIG.montos.reduce((suma, monto) => suma + monto, 0);
document.getElementById("texto-meta-total").textContent = formatCOP(metaTotal);

// ============================================================
// CALENDARIO DE AHORRO (sincronizado en tiempo real con Firebase)
// ============================================================

let diasMarcados = new Set();

const grid = document.getElementById("grid-tickets");
dias.forEach((dia) => {
  const btn = document.createElement("button");
  btn.className = "ticket";
  btn.dataset.numero = dia.numero;
  btn.innerHTML = `
    <span class="num-dia">Día ${dia.numero} · ${formatearFechaCorta(dia.fechaStr)}</span>
    <span class="monto">${formatCOP(dia.monto)}</span>
  `;
  btn.addEventListener("click", () => toggleDia(dia.numero));
  grid.appendChild(btn);
});

function actualizarVistaAhorro() {
  let total = 0;
  dias.forEach((dia) => {
    const marcado = diasMarcados.has(dia.numero);
    if (marcado) total += dia.monto;
    const ticket = grid.querySelector(`[data-numero="${dia.numero}"]`);
    if (ticket) ticket.classList.toggle("marcado", marcado);
  });
  document.getElementById("total-ahorrado").textContent = formatCOP(total);
  const pct = Math.min((total / metaTotal) * 100, 100);
  document.getElementById("barra-relleno").style.width = pct + "%";
  document.getElementById("dias-marcados").textContent =
    `${diasMarcados.size} de ${CONFIG.montos.length} días ahorrados`;
}

function toggleDia(numero) {
  const yaMarcado = diasMarcados.has(numero);
  docRef.set(
    {
      dias: yaMarcado
        ? firebase.firestore.FieldValue.arrayRemove(numero)
        : firebase.firestore.FieldValue.arrayUnion(numero),
    },
    { merge: true }
  );
}

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const docRef = db.collection("reto").doc("estado");

docRef.onSnapshot(
  (snap) => {
    const data = snap.data();
    diasMarcados = new Set((data && data.dias) || []);
    actualizarVistaAhorro();
  },
  (err) => {
    console.error("No se pudo conectar con Firebase. Revisa firebase-config.js", err);
    document.getElementById("dias-marcados").textContent =
      "No se pudo conectar. Revisa la configuración de Firebase.";
  }
);

// ============================================================
// CANCIÓN DEL DÍA
// ============================================================

let fechaSeleccionada = hoyStr;

function cargarCancion(fechaStr) {
  const entrada = CANCIONES[fechaStr];
  const cont = document.getElementById("cancion-embed");
  const nota = document.getElementById("cancion-nota");
  const fechaEl = document.getElementById("cancion-fecha");

  if (!entrada) {
    cont.innerHTML = '<p class="mensaje-vacio">Todavía no hay canción para este día.</p>';
    nota.textContent = "";
    fechaEl.textContent = "";
    return;
  }

  cont.innerHTML = `<iframe src="https://open.spotify.com/embed/track/${entrada.id}?utm_source=generator&theme=0"
      width="100%" height="152" frameborder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"></iframe>`;
  nota.textContent = entrada.nota || "";
  fechaEl.textContent = formatearFechaLarga(fechaStr);
}

function renderArchivo() {
  const cont = document.getElementById("archivo-strip");
  cont.innerHTML = "";
  const fechas = Object.keys(CANCIONES)
    .filter((f) => f <= hoyStr)
    .sort()
    .reverse();

  if (fechas.length === 0) {
    cont.style.display = "none";
    return;
  }

  fechas.forEach((f) => {
    const btn = document.createElement("button");
    btn.className = "pill-fecha" + (f === fechaSeleccionada ? " activa" : "");
    btn.textContent = formatearFechaCorta(f);
    btn.addEventListener("click", () => {
      fechaSeleccionada = f;
      cargarCancion(f);
      renderArchivo();
    });
    cont.appendChild(btn);
  });
}

cargarCancion(fechaSeleccionada);
renderArchivo();

// ============================================================
// ÁLBUM DE FOTOS
// ============================================================

function renderGaleria() {
  const cont = document.getElementById("galeria");
  if (!FOTOS.length) {
    cont.innerHTML = '<p class="mensaje-vacio">Todavía no hay fotos. Súbelas a la carpeta "fotos" y agrégalas en fotos.js.</p>';
    return;
  }
  FOTOS.forEach((foto) => {
    const img = document.createElement("img");
    img.src = foto.archivo;
    img.alt = foto.texto || "Foto nuestra";
    img.loading = "lazy";
    img.addEventListener("click", () => abrirLightbox(foto));
    cont.appendChild(img);
  });
}

function abrirLightbox(foto) {
  document.getElementById("lightbox-img").src = foto.archivo;
  document.getElementById("lightbox-texto").textContent = foto.texto || "";
  document.getElementById("lightbox").hidden = false;
}

function cerrarLightbox() {
  document.getElementById("lightbox").hidden = true;
}

document.getElementById("lightbox-cerrar").addEventListener("click", cerrarLightbox);
document.getElementById("lightbox").addEventListener("click", (e) => {
  if (e.target.id === "lightbox") cerrarLightbox();
});

renderGaleria();
