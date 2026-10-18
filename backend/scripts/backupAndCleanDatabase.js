require("dotenv").config();

const fs = require("fs");
const path = require("path");
const readline = require("readline/promises");
const mongoose = require("mongoose");
const { EJSON } = require("bson");

const connectDB = require("../config/db");
const User = require("../models/User");

const ADMIN_EMAIL = "admin@rentalmarketplace.com";
const CONFIRMATION = "DELETE ALL RENTIFY DATA";

async function run() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  try {
    await connectDB();

    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    const admin = await User.findOne({
      email: ADMIN_EMAIL,
      role: "admin",
    }).select("+password").lean();

    if (!admin) {
      throw new Error(`Expected admin ${ADMIN_EMAIL} was not found. Nothing was deleted.`);
    }

    const collections = await db.listCollections({}, { nameOnly: true }).toArray();
    if (collections.length === 0) {
      throw new Error("No collections were found. Stopping to avoid cleaning the wrong database.");
    }

    console.log("\n=== RENTIFY DATABASE CLEANUP ===");
    console.log("Connected database:", dbName);
    console.log("Admin account to preserve:", ADMIN_EMAIL);
    console.log("\nRecords before cleanup:");

    const counts = {};
    for (const collection of collections) {
      counts[collection.name] = await db.collection(collection.name).countDocuments();
      console.log(`  ${collection.name}: ${counts[collection.name]}`);
    }

    const backupRoot = path.join(__dirname, "..", "backups");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupDir = path.join(backupRoot, `rentify-${dbName}-${timestamp}`);
    fs.mkdirSync(backupDir, { recursive: true });

    console.log("\nCreating a local backup before any deletion...");
    const manifest = {
      database: dbName,
      createdAt: new Date().toISOString(),
      adminPreserved: ADMIN_EMAIL,
      collectionCounts: counts,
      collections: [],
    };

    for (const collection of collections) {
      const documents = await db.collection(collection.name).find({}).toArray();
      const fileName = `${collection.name}.json`;
      fs.writeFileSync(
        path.join(backupDir, fileName),
        EJSON.stringify(documents, null, 2),
        { encoding: "utf8", mode: 0o600 }
      );
      manifest.collections.push({
        name: collection.name,
        count: documents.length,
        file: fileName,
      });
      console.log(`  Backed up ${collection.name}: ${documents.length} records`);
    }

    fs.writeFileSync(
      path.join(backupDir, "manifest.json"),
      JSON.stringify(manifest, null, 2),
      { encoding: "utf8", mode: 0o600 }
    );

    // Verify each collection backup can be read and parsed before proceeding.
    for (const entry of manifest.collections) {
      const filePath = path.join(backupDir, entry.file);
      const parsed = EJSON.parse(fs.readFileSync(filePath, "utf8"));
      if (!Array.isArray(parsed) || parsed.length !== entry.count) {
        throw new Error(`Backup verification failed for ${entry.name}. Nothing was deleted.`);
      }
    }

    console.log("\nBackup verified at:");
    console.log(backupDir);
    console.log("WARNING: the backup may contain personal data and password hashes.");
    console.log("Keep it private and do not commit it to GitHub.");

    const typedDb = await rl.question(`\nType the database name "${dbName}" to continue: `);
    if (typedDb !== dbName) {
      console.log("Database name mismatch. No records were deleted. Backup was retained.");
      return;
    }

    const typedConfirmation = await rl.question(`Type "${CONFIRMATION}" to confirm deletion: `);
    if (typedConfirmation !== CONFIRMATION) {
      console.log("Confirmation mismatch. No records were deleted. Backup was retained.");
      return;
    }

    // Keep the verified admin; remove every other user and all documents in other collections.
    for (const collection of collections) {
      const target = db.collection(collection.name);
      if (collection.name === User.collection.collectionName) {
        const result = await target.deleteMany({ _id: { $ne: admin._id } });
        console.log(`${collection.name}: deleted ${result.deletedCount}; preserved ${ADMIN_EMAIL}`);
      } else {
        const result = await target.deleteMany({});
        console.log(`${collection.name}: deleted ${result.deletedCount}`);
      }
    }

    const adminStillExists = await User.findOne({
      _id: admin._id,
      email: ADMIN_EMAIL,
      role: "admin",
    }).lean();

    if (!adminStillExists) {
      throw new Error("Admin verification failed after cleanup. Check the database immediately.");
    }

    console.log("\nCleanup completed and admin account verified.");
    console.log("Backup retained at:", backupDir);
  } catch (error) {
    console.error("\nCleanup stopped:", error.message);
    process.exitCode = 1;
  } finally {
    rl.close();
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

run();
