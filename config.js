// ============================================================
// CONFIGURACIÓN DEL RETO DE AHORRO
// Edita estos valores para personalizar la página.
// ============================================================

const CONFIG = {
  // Nombre corto de la meta, aparece en el encabezado.
  // Ej: "nuestro viaje", "el anillo", "la casa"
  tituloMeta: "nuestra meta",

  // Fecha del día 1 del reto (formato AAAA-MM-DD)
  fechaInicio: "2026-09-10",

  // Un monto por día, en el orden en que se ahorran.
  // La meta total de la página (el "de $X" que aparece arriba)
  // se calcula sola sumando todo lo que haya en esta lista,
  // así que puedes agregar más días cuando quieras, al final
  // de la lista, y la meta va a subir sola. No tienen que sumar
  // ningún número exacto ni quedarse en 60 días.
  montos: [
    1000, 2000, 2000, 3000, 3000, 4000, 4000, 5000, 5000, 6000,
    6000, 7000, 7000, 8000, 8000, 9000, 9000, 10000, 11000, 11000,
    12000, 12000, 13000, 13000, 14000, 14000, 15000, 15000, 16000, 16000,
    17000, 17000, 18000, 19000, 19000, 20000, 20000, 21000, 21000, 22000,
    22000, 23000, 23000, 24000, 24000, 25000, 25000, 26000, 26000, 27000,
    28000, 28000, 29000, 29000, 30000, 30000, 31000, 31000, 32000, 32000
    // Para agregar más días, pon una coma después del último número
    // de arriba y agrega los nuevos aquí, por ejemplo:
    // , 33000, 33000, 34000
  ]
};
