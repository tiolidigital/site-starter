// Logiczny backup Supabase → katalog na dysku (dane + obrazy z bucketu).
// Używa service_role (omija RLS) — TYLKO do odczytu/backupu.
// Pełny backup = ten zrzut + supabase/migrations/ (schemat). Restore: migracje → import JSON → upload plików.
//
// Uruchom lokalnie:  node --env-file=.env.local scripts/backup.mjs
// W CI (GitHub Actions): env z sekretów, OUT_DIR ustawiany przez workflow.
//
// Wypełnij TABLES i BUCKET przy podpięciu projektu.
// Backup obsługuje jeden bucket — dla wielu rozszerz pętlę (patrz README).
import { createClient } from "@supabase/supabase-js";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const TABLES = []; // {{TABLES}} — np. ["posts", "users"]; dorzuć nowe tabele, gdy powstaną
const BUCKET = ""; // {{STORAGE_BUCKET}} — nazwa bucketu Storage do backupu

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  throw new Error(
    "Brak NEXT_PUBLIC_SUPABASE_URL lub SUPABASE_SERVICE_ROLE_KEY w środowisku.",
  );
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const outDir = process.env.BACKUP_OUT_DIR ?? join("backups", stamp);

const supabase = createClient(url, key, { auth: { persistSession: false } });

// --- Dane tabel → JSON -------------------------------------------------------
await mkdir(join(outDir, "data"), { recursive: true });
const tableCounts = {};
for (const table of TABLES) {
  const { data, error } = await supabase.from(table).select("*");
  if (error) throw new Error(`select ${table}: ${error.message}`);
  await writeFile(
    join(outDir, "data", `${table}.json`),
    JSON.stringify(data, null, 2),
  );
  tableCounts[table] = data.length;
  console.log(`✓ ${table}: ${data.length} wierszy`);
}

// --- Pliki z bucketu Storage (rekurencyjnie) --------------------------------
async function listAll(prefix = "") {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(prefix, { limit: 1000, sortBy: { column: "name", order: "asc" } });
  if (error) throw new Error(`list ${BUCKET}/${prefix}: ${error.message}`);
  const files = [];
  for (const item of data) {
    const path = prefix ? `${prefix}/${item.name}` : item.name;
    // Folder w Storage nie ma metadata.size; wchodzimy głębiej.
    if (item.id === null || item.metadata == null) {
      files.push(...(await listAll(path)));
    } else {
      files.push(path);
    }
  }
  return files;
}

await mkdir(join(outDir, "storage", BUCKET), { recursive: true });
const files = await listAll();
for (const path of files) {
  const { data, error } = await supabase.storage.from(BUCKET).download(path);
  if (error) throw new Error(`download ${path}: ${error.message}`);
  const buf = Buffer.from(await data.arrayBuffer());
  const dest = join(outDir, "storage", BUCKET, path);
  await mkdir(join(dest, ".."), { recursive: true });
  await writeFile(dest, buf);
  console.log(`✓ storage/${BUCKET}/${path} (${buf.length} B)`);
}

// --- Manifest ----------------------------------------------------------------
const manifest = {
  created_at: new Date().toISOString(),
  project_url: url,
  tables: tableCounts,
  bucket: BUCKET,
  files,
};
await writeFile(
  join(outDir, "manifest.json"),
  JSON.stringify(manifest, null, 2),
);
console.log(`\n✅ Backup w: ${outDir}`);
