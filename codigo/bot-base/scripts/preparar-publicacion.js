const fs = require("node:fs");
const path = require("node:path");

const raiz = path.resolve(__dirname, "..");
const destino = path.join(raiz, "dist");
fs.mkdirSync(destino, { recursive: true });
// El bot actual tiene todos los estilos y scripts de la interfaz en index.html.
// Los archivos del servidor se empaquetan por separado como Netlify Functions.
if (fs.readdirSync(destino).some((nombre) => nombre !== "index.html")) {
  throw new Error("La carpeta dist contiene archivos inesperados. Revisala antes de publicar.");
}
fs.copyFileSync(path.join(raiz, "index.html"), path.join(destino, "index.html"));
console.log("Pagina preparada para publicar en dist/index.html.");
