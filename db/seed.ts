import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";
import { cards, programs, collections } from "./schema";
import { sampleCards } from "./seed/cards";
import { samplePrograms } from "./seed/programs";
import { sampleCollections } from "./seed/collections";

// Load .env.local file
dotenv.config({ path: ".env.local" });

const DATABASE_URL = process.env.DATABASE_URL!;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not defined in environment variables.");
  console.log("📝 Please create a .env.local file with your database URL:");
  console.log(
    '   DATABASE_URL="postgresql://username:password@localhost:5432/basecard_db"'
  );
  console.log("");
  console.log("💡 Or set it as an environment variable:");
  console.log(
    '   export DATABASE_URL="postgresql://username:password@localhost:5432/basecard_db"'
  );
  process.exit(1);
}

async function seed() {
  try {
    const client = postgres(DATABASE_URL);
    const db = drizzle(client);

    console.log("🌱 Starting BaseCard seed...");

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("🧹 Clearing existing data...");
    await db.delete(collections);
    await db.delete(programs);
    await db.delete(cards);
    console.log("✅ Cleared existing data");

    // Insert cards
    console.log("👤 Adding cards...");
    const insertedCards = await db
      .insert(cards)
      .values(sampleCards)
      .returning()
      .onConflictDoNothing();
    console.log(`✅ Added ${insertedCards.length} cards`);

    if (insertedCards.length === 0) {
      console.log("⚠️ No cards were inserted (they might already exist)");
      // If cards already exist, fetch them
      const existingCards = await db.select().from(cards);
      insertedCards.push(...existingCards);
    }

    // Insert programs
    console.log("📚 Adding programs...");
    const programsWithOwners = samplePrograms.map((program, index) => ({
      ...program,
      ownerCardId: insertedCards[index % insertedCards.length].id,
    }));

    const insertedPrograms = await db
      .insert(programs)
      .values(programsWithOwners)
      .returning()
      .onConflictDoNothing();
    console.log(`✅ Added ${insertedPrograms.length} programs`);

    // Insert collections
    console.log("📦 Adding collections...");
    const collectionValues = sampleCollections.map(
      ({ ownerIndex, collectedIndex }) => ({
        cardId: insertedCards[ownerIndex].id,
        collectedCardId: insertedCards[collectedIndex].id,
      })
    );

    const insertedCollections = await db
      .insert(collections)
      .values(collectionValues)
      .returning()
      .onConflictDoNothing();
    console.log(`✅ Added ${insertedCollections.length} collections`);

    console.log("🎉 BaseCard seed complete!");
    console.log(`📊 Summary:`);
    console.log(`   - Cards: ${insertedCards.length}`);
    console.log(`   - Programs: ${insertedPrograms.length}`);
    console.log(`   - Collections: ${insertedCollections.length}`);

    await client.end();
  } catch (error) {
    console.error("❌ Error in seed:", error);
    process.exit(1);
  }
}

seed();
