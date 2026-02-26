#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import * as XLSXModule from "xlsx";

const XLSX = XLSXModule.default ?? XLSXModule;

const ROOT_DIR = process.cwd();
const INPUT_XLSX = path.join(ROOT_DIR, "faceometer.xlsx");
const OUTPUT_DIR = path.join(ROOT_DIR, "src", "data");
const PHOTOS_DIR = path.join(ROOT_DIR, "public", "photos");
const FACEOMETER_JSON = path.join(OUTPUT_DIR, "faceometer.json");
const COUNTRIES_JSON = path.join(OUTPUT_DIR, "countries.json");

const HEADER_ALIASES = {
  country: ["country", "country en", "country english", "country_en"],
  countryCode: [
    "country code",
    "country_code",
    "iso",
    "iso2",
    "iso 2",
    "iso code",
    "code",
  ],
  firstName: ["name", "first name", "first_name", "given name", "firstname"],
  lastName: ["last name", "last_name", "lastname", "surname", "family name"],
  position: ["title", "position", "cargo", "role"],
  organization: ["institution", "organization", "organisation", "ministry"],
  mode: ["mode", "attendance mode", "ministerial meeting", "som"],
  photo: ["photograph", "photo", "image", "picture", "profile photo"],
};

function normalizeText(value) {
  if (value === undefined || value === null) return "";
  return String(value).replace(/\u00a0/g, " ").trim();
}

function normalizeHeader(value) {
  return normalizeText(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function toSlug(value) {
  const slug = normalizeText(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
  return slug || "unknown";
}

function cleanPhotoValue(value) {
  const raw = normalizeText(value);
  if (!raw) return null;

  const upper = raw.toUpperCase();
  if (
    upper === "#VALUE!" ||
    upper === "#N/A" ||
    upper === "N/A" ||
    upper === "NA" ||
    upper === "NULL" ||
    upper === "NONE"
  ) {
    return null;
  }

  if (raw.startsWith("=")) return null;
  return raw;
}

function normalizeMode(value) {
  const raw = normalizeText(value);
  if (!raw) return null;

  const lower = raw.toLowerCase();
  if (lower.includes("virtual")) return "Virtual";
  if (lower.includes("on-site") || lower.includes("onsite") || lower.includes("in person")) {
    return "On-Site";
  }
  return raw;
}

function pickColumn(headerMap, aliases, required = false) {
  for (const alias of aliases) {
    const normalizedAlias = normalizeHeader(alias);
    for (const [index, headerName] of headerMap.entries()) {
      if (normalizeHeader(headerName) === normalizedAlias) {
        return index;
      }
    }
  }

  if (required) {
    throw new Error(`No se encontró una columna requerida. Alias esperados: ${aliases.join(", ")}`);
  }

  return null;
}

function getCellValue(sheet, rowIndex, colIndex) {
  const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
  const cell = sheet[cellRef];
  if (!cell) return "";

  if (typeof cell.w === "string" && cell.w.length > 0) return cell.w;
  if (cell.v === undefined || cell.v === null) return "";
  return cell.v;
}

function getWorkbookFiles(workbook) {
  const rawFiles = workbook?.files || workbook?.bookFiles?.files || workbook?.bookFiles || {};
  const entries = Object.entries(rawFiles);
  const files = new Map();

  for (const [key, value] of entries) {
    files.set(key.replace(/^\/+/, ""), value);
  }

  return files;
}

function entryToBuffer(entry) {
  const content = entry?.content ?? entry?.data ?? entry;

  if (!content) return null;
  if (Buffer.isBuffer(content)) return content;
  if (content instanceof Uint8Array) return Buffer.from(content);
  if (Array.isArray(content)) return Buffer.from(content);
  if (typeof content === "string") return Buffer.from(content, "binary");

  return null;
}

function getXml(files, filePath) {
  const entry = files.get(filePath);
  if (!entry) return null;

  const buffer = entryToBuffer(entry);
  if (!buffer) return null;
  return buffer.toString("utf8");
}

function parseEmbeddedImageMappings(workbook, photoColumnLetter, sheetFilePath) {
  const files = getWorkbookFiles(workbook);

  const metadataXml = getXml(files, "xl/metadata.xml");
  const rvDataXml = getXml(files, "xl/richData/rdrichvalue.xml");
  const rvRelXml = getXml(files, "xl/richData/richValueRel.xml");
  const rvRelRelsXml = getXml(files, "xl/richData/_rels/richValueRel.xml.rels");
  const sheetXml = getXml(files, sheetFilePath);

  if (!metadataXml || !rvDataXml || !rvRelXml || !rvRelRelsXml || !sheetXml) {
    return new Map();
  }

  const relOrder = [];
  for (const match of rvRelXml.matchAll(/<rel\b[^>]*\br:id="([^"]+)"[^>]*\/?\s*>/g)) {
    relOrder.push(match[1]);
  }

  const relTargets = new Map();
  for (const match of rvRelRelsXml.matchAll(/<Relationship\b[^>]*\bId="([^"]+)"[^>]*\bTarget="([^"]+)"[^>]*\/?\s*>/g)) {
    const relId = match[1];
    const target = match[2];
    const resolved = path.posix.normalize(path.posix.join("xl/richData", target));
    relTargets.set(relId, resolved);
  }

  const rvRelIndexByRv = [];
  for (const match of rvDataXml.matchAll(/<rv\b[^>]*>([\s\S]*?)<\/rv>/g)) {
    const rvBody = match[1];
    const firstV = rvBody.match(/<v>(\d+)<\/v>/);
    rvRelIndexByRv.push(firstV ? Number(firstV[1]) : null);
  }

  const futureBlockMatch = metadataXml.match(
    /<futureMetadata[^>]*name="XLRICHVALUE"[^>]*>([\s\S]*?)<\/futureMetadata>/,
  );
  const valueBlockMatch = metadataXml.match(/<valueMetadata[^>]*>([\s\S]*?)<\/valueMetadata>/);

  if (!futureBlockMatch || !valueBlockMatch) {
    return new Map();
  }

  const rvDataIndexByFuture = [];
  for (const match of futureBlockMatch[1].matchAll(/<bk\b[^>]*>([\s\S]*?)<\/bk>/g)) {
    const bkBody = match[1];
    const rvb = bkBody.match(/<[^:>]*:?rvb\b[^>]*\bi="(\d+)"/);
    rvDataIndexByFuture.push(rvb ? Number(rvb[1]) : null);
  }

  const futureIndexByValueMeta = [];
  for (const match of valueBlockMatch[1].matchAll(/<bk\b[^>]*>([\s\S]*?)<\/bk>/g)) {
    const bkBody = match[1];
    const rc = bkBody.match(/<rc\b[^>]*\bv="(\d+)"/);
    futureIndexByValueMeta.push(rc ? Number(rc[1]) : null);
  }

  const mediaPathByVm = new Map();
  for (let vmIndex = 1; vmIndex <= futureIndexByValueMeta.length; vmIndex += 1) {
    const futureIndex = futureIndexByValueMeta[vmIndex - 1];
    if (futureIndex === null || futureIndex === undefined) continue;

    const rvDataIndex = rvDataIndexByFuture[futureIndex];
    if (rvDataIndex === null || rvDataIndex === undefined) continue;

    const relOrderIndex = rvRelIndexByRv[rvDataIndex];
    if (relOrderIndex === null || relOrderIndex === undefined) continue;

    const relId = relOrder[relOrderIndex];
    if (!relId) continue;

    const mediaPath = relTargets.get(relId);
    if (!mediaPath) continue;

    mediaPathByVm.set(vmIndex, mediaPath);
  }

  const vmByRow = new Map();
  for (const match of sheetXml.matchAll(/<c\b([^>]*)>/g)) {
    const attrs = match[1];
    const refMatch = attrs.match(/\br="([A-Z]+)(\d+)"/);
    const vmMatch = attrs.match(/\bvm="(\d+)"/);

    if (!refMatch || !vmMatch) continue;

    const colLetter = refMatch[1];
    const rowNumber = Number(refMatch[2]);
    const vm = Number(vmMatch[1]);

    if (colLetter !== photoColumnLetter) continue;
    vmByRow.set(rowNumber, vm);
  }

  const imageByRow = new Map();
  for (const [rowNumber, vm] of vmByRow.entries()) {
    const mediaPath = mediaPathByVm.get(vm);
    if (!mediaPath) continue;

    const mediaEntry = files.get(mediaPath);
    const mediaBuffer = mediaEntry ? entryToBuffer(mediaEntry) : null;
    if (!mediaBuffer) continue;

    imageByRow.set(rowNumber, {
      mediaPath,
      buffer: mediaBuffer,
    });
  }

  return imageByRow;
}

function resolveSheetXmlPath(workbook, targetSheetName) {
  const files = getWorkbookFiles(workbook);
  const workbookXml = getXml(files, "xl/workbook.xml");
  const workbookRelsXml = getXml(files, "xl/_rels/workbook.xml.rels");

  if (!workbookXml || !workbookRelsXml) {
    return "xl/worksheets/sheet1.xml";
  }

  const sheetMatch = Array.from(
    workbookXml.matchAll(
      /<sheet\b[^>]*\bname="([^"]+)"[^>]*\br:id="([^"]+)"[^>]*\/?\s*>/g,
    ),
  ).find((match) => match[1] === targetSheetName);

  if (!sheetMatch) return "xl/worksheets/sheet1.xml";

  const targetRelId = sheetMatch[2];
  const relMatch = Array.from(
    workbookRelsXml.matchAll(
      /<Relationship\b[^>]*\bId="([^"]+)"[^>]*\bTarget="([^"]+)"[^>]*\/?\s*>/g,
    ),
  ).find((match) => match[1] === targetRelId);

  if (!relMatch) return "xl/worksheets/sheet1.xml";

  const target = relMatch[2];
  return path.posix.normalize(path.posix.join("xl", target));
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(PHOTOS_DIR, { recursive: true });

  const readOptions = {
    raw: true,
    cellFormula: true,
    cellHTML: false,
    bookFiles: true,
  };

  const workbook =
    typeof XLSX.readFile === "function"
      ? XLSX.readFile(INPUT_XLSX, readOptions)
      : XLSX.read(await fs.readFile(INPUT_XLSX), { ...readOptions, type: "buffer" });

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error("El archivo Excel no tiene hojas.");

  const sheet = workbook.Sheets[sheetName];
  const range = XLSX.utils.decode_range(sheet["!ref"] || "A1:A1");

  const headerRowIndex = range.s.r;
  const headerMap = new Map();

  for (let c = range.s.c; c <= range.e.c; c += 1) {
    const headerName = normalizeText(getCellValue(sheet, headerRowIndex, c));
    if (headerName) headerMap.set(c, headerName);
  }

  const colCountry = pickColumn(headerMap, HEADER_ALIASES.country, true);
  const colCountryCode = pickColumn(headerMap, HEADER_ALIASES.countryCode, false);
  const colFirstName = pickColumn(headerMap, HEADER_ALIASES.firstName, true);
  const colLastName = pickColumn(headerMap, HEADER_ALIASES.lastName, true);
  const colPosition = pickColumn(headerMap, HEADER_ALIASES.position, true);
  const colOrganization = pickColumn(headerMap, HEADER_ALIASES.organization, true);
  const colMode = pickColumn(headerMap, HEADER_ALIASES.mode, false);
  const colPhoto = pickColumn(headerMap, HEADER_ALIASES.photo, true);

  const photoColumnLetter = XLSX.utils.encode_col(colPhoto);
  const sheetXmlFile = resolveSheetXmlPath(workbook, sheetName);
  const embeddedImageByRow = parseEmbeddedImageMappings(workbook, photoColumnLetter, sheetXmlFile);

  const records = [];
  const countriesByName = new Map();
  const authoritySlugCounts = new Map();
  const mediaToPublicPath = new Map();
  const usedPhotoFileNames = new Set();

  let currentCountry = "";
  let currentCountryCode = null;

  for (let r = headerRowIndex + 1; r <= range.e.r; r += 1) {
    const rowNumber = r + 1;

    const countryValue = normalizeText(getCellValue(sheet, r, colCountry));
    if (countryValue) currentCountry = countryValue;

    const codeValue = colCountryCode !== null ? normalizeText(getCellValue(sheet, r, colCountryCode)) : "";
    if (codeValue) currentCountryCode = codeValue;

    const countryEn = currentCountry;
    if (!countryEn) continue;

    const firstName = normalizeText(getCellValue(sheet, r, colFirstName));
    const lastName = normalizeText(getCellValue(sheet, r, colLastName));
    const fullName = normalizeText(`${firstName} ${lastName}`);

    if (!fullName) continue;

    const position = normalizeText(getCellValue(sheet, r, colPosition));
    const organization = normalizeText(getCellValue(sheet, r, colOrganization));

    const modeRaw = colMode !== null ? getCellValue(sheet, r, colMode) : "";
    const mode = normalizeMode(modeRaw);

    const photoFromColumn = cleanPhotoValue(getCellValue(sheet, r, colPhoto));

    let photo = photoFromColumn;

    if (!photo) {
      const embedded = embeddedImageByRow.get(rowNumber);
      if (embedded) {
        const countrySlug = toSlug(countryEn);
        const authorityBase = toSlug(fullName);

        let publicPath = mediaToPublicPath.get(embedded.mediaPath);

        if (!publicPath) {
          const ext = path.extname(embedded.mediaPath) || ".png";
          let baseFileName = `${countrySlug}-${authorityBase}`;
          if (!baseFileName || baseFileName === "-") {
            baseFileName = `row-${rowNumber}`;
          }

          let candidate = `${baseFileName}${ext}`;
          let suffix = 2;
          while (usedPhotoFileNames.has(candidate)) {
            candidate = `${baseFileName}-${suffix}${ext}`;
            suffix += 1;
          }

          usedPhotoFileNames.add(candidate);
          await fs.writeFile(path.join(PHOTOS_DIR, candidate), embedded.buffer);
          publicPath = `/photos/${candidate}`;
          mediaToPublicPath.set(embedded.mediaPath, publicPath);
        }

        photo = publicPath;
      }
    }

    if (!photo) continue;

    const countrySlug = toSlug(countryEn);
    const authorityBaseSlug = toSlug(fullName);
    const currentCount = (authoritySlugCounts.get(authorityBaseSlug) || 0) + 1;
    authoritySlugCounts.set(authorityBaseSlug, currentCount);

    const authoritySlug = currentCount === 1 ? authorityBaseSlug : `${authorityBaseSlug}-${currentCount}`;

    const record = {
      country_en: countryEn,
      country_code: currentCountryCode || null,
      country_slug: countrySlug,
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      authority_slug: authoritySlug,
      position,
      organization,
      mode,
      photo,
    };

    records.push(record);

    if (!countriesByName.has(countryEn)) {
      countriesByName.set(countryEn, {
        country_en: countryEn,
        country_code: currentCountryCode || null,
        country_slug: countrySlug,
      });
    }
  }

  const countries = Array.from(countriesByName.values()).sort((a, b) =>
    a.country_en.localeCompare(b.country_en, "en", { sensitivity: "base" }),
  );

  await fs.writeFile(FACEOMETER_JSON, `${JSON.stringify(records, null, 2)}\n`, "utf8");
  await fs.writeFile(COUNTRIES_JSON, `${JSON.stringify(countries, null, 2)}\n`, "utf8");

  console.log(`Registros con foto: ${records.length}`);
  console.log(`Países únicos: ${countries.length}`);
  console.log(`Salida:`);
  console.log(`- ${path.relative(ROOT_DIR, FACEOMETER_JSON)}`);
  console.log(`- ${path.relative(ROOT_DIR, COUNTRIES_JSON)}`);
}

main().catch((error) => {
  console.error("Error generando dataset Faceometer:", error);
  process.exitCode = 1;
});
