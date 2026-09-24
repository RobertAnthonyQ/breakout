#!/usr/bin/env node

import { mkdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const [inputPath, outputPath, widthValue, heightValue] = process.argv.slice(2);

if (!inputPath || !outputPath) {
  console.error(
    "Uso: node render-svg.mjs <entrada.svg> <salida.png> [ancho] [alto]",
  );
  process.exit(2);
}

if (path.extname(inputPath).toLowerCase() !== ".svg") {
  console.error("La entrada debe ser un archivo SVG.");
  process.exit(2);
}

if (path.extname(outputPath).toLowerCase() !== ".png") {
  console.error("La salida debe ser un archivo PNG.");
  process.exit(2);
}

const parseDimension = (value, label) => {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 10_000) {
    console.error(`${label} debe ser un entero entre 1 y 10000.`);
    process.exit(2);
  }
  return parsed;
};

const width = parseDimension(widthValue, "El ancho");
const height = parseDimension(heightValue, "El alto");
await mkdir(path.dirname(path.resolve(outputPath)), { recursive: true });

let pipeline = sharp(path.resolve(inputPath), { density: 144 });
if (width || height) {
  pipeline = pipeline.resize(width, height, { fit: "fill" });
}

await pipeline.png({ compressionLevel: 9 }).toFile(path.resolve(outputPath));
console.log(path.resolve(outputPath));
