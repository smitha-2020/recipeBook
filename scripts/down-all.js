/**
 * Roll back ALL applied migrations in reverse order (one migrate-mongo down per migration).
 * Scalable: works for any number of migrations (category, recipe, and any you add later).
 * Use: npm run db:down:all
 *
 * Production: blocked by default; set ALLOW_DOWN_ALL=1 to allow (e.g. for reset/DR).
 */
import { execSync } from "child_process";
import mongoose from "mongoose";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

const isProduction = process.env.NODE_ENV === "production";
const allowDownAll = process.env.ALLOW_DOWN_ALL === "1" || process.env.ALLOW_DOWN_ALL === "true";

async function getConfig() {
  const configPath = join(__dirname, "..", "migrate-mongo-config.js");
  const mod = await import(pathToFileURL(configPath).href);
  return mod.default;
}

async function getAppliedCount(db, changelogCollectionName) {
  const changelog = db.collection(changelogCollectionName);
  return changelog.countDocuments();
}

async function main() {
  if (isProduction && !allowDownAll) {
    console.error(
      "Refusing to run db:down:all in production (NODE_ENV=production). " +
        "This would roll back all migrations and can cause data loss. " +
        "To allow, set ALLOW_DOWN_ALL=1 and run again."
    );
    process.exit(1);
  }

  const config = await getConfig();
  const url = config.mongodb?.url || "mongodb://localhost:27017/";
  const databaseName = config.mongodb?.databaseName || "recipeBook";
  const changelogCollectionName = config.changelogCollectionName || "changelog";

  await mongoose.connect(url);
  const db = mongoose.connection.useDb(databaseName).db;
  const appliedCount = await getAppliedCount(db, changelogCollectionName);
  await mongoose.disconnect();

  if (appliedCount === 0) {
    console.log("No applied migrations to roll back.");
    process.exit(0);
    return;
  }

  console.log(`Rolling back ${appliedCount} migration(s)...`);
  for (let i = 0; i < appliedCount; i++) {
    try {
      execSync("npx migrate-mongo down", {
        stdio: "inherit",
        cwd: projectRoot,
      });
    } catch (err) {
      console.error(
        `Migration down failed (rollback ${i + 1}/${appliedCount}). ` +
          `Partial rollback: ${i} migration(s) rolled back. Fix the failing migration and re-run if needed.`
      );
      process.exit(1);
    }
  }
  console.log("Done. All migrations rolled back.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
