const fs = require("fs");
const path = require("path");

const sourceDir = path.resolve(
  __dirname,
  "../node_modules/leaflet/dist/images"
);
const destDir = path.resolve(__dirname, "../src/assets/leaflet");

const files = ["marker-icon.png", "marker-icon-2x.png", "marker-shadow.png"];

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

files.forEach((file) => {
  const src = path.join(sourceDir, file);
  const dest = path.join(destDir, file);
  fs.copyFileSync(src, dest);
  console.log(`✔ Copiado: ${file}`);
});

console.log("✅ Ícones do Leaflet copiados com sucesso.");
