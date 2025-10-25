import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { cards } from "../db/schema";

// Database connection
const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://postgres:password@localhost:5432/basecard";
console.log("Connecting to database:", connectionString);
const client = postgres(connectionString);
const db = drizzle(client);

// Base64 인코딩 함수
function encodeImageToBase64(imagePath: string): string {
    try {
        const imageBuffer = readFileSync(imagePath);
        const base64String = imageBuffer.toString("base64");

        // 파일 확장자에 따라 MIME 타입 결정
        const ext = imagePath.split(".").pop()?.toLowerCase();
        let mimeType = "image/png"; // 기본값

        if (ext === "jpg" || ext === "jpeg") {
            mimeType = "image/jpeg";
        } else if (ext === "png") {
            mimeType = "image/png";
        }

        return `data:${mimeType};base64,${base64String}`;
    } catch (error) {
        console.error(`Error encoding image ${imagePath}:`, error);
        throw error;
    }
}

// 프로필 이미지 매핑
const profileImageMapping = {
    "jihwang.png": "0x1234567890123456789012345678901234567890",
    "mozzigom.png": "0x1234567890123456789012345678901234567891",
    "soyverse.png": "0x1234567890123456789012345678901234567892",
    "tomatocat.png": "0x1234567890123456789012345678901234567893",
};

async function insertProfileImages() {
    try {
        console.log("Starting profile image insertion...");

        const profileDir = join(__dirname, "../contracts/mocks/profile");

        for (const [filename, address] of Object.entries(profileImageMapping)) {
            const imagePath = join(profileDir, filename);
            console.log(`Processing ${filename} for address ${address}...`);

            // 이미지를 base64로 인코딩
            const base64DataURL = encodeImageToBase64(imagePath);

            // DB에서 해당 주소의 카드 찾기
            const existingCards = await db
                .select()
                .from(cards)
                .where(eq(cards.address, address));

            if (existingCards.length === 0) {
                console.log(
                    `No card found for address ${address}, skipping...`
                );
                continue;
            }

            // profileImage 필드 업데이트
            await db
                .update(cards)
                .set({ profileImage: base64DataURL })
                .where(eq(cards.address, address));

            console.log(
                `✅ Updated profile image for ${filename} (${address})`
            );
        }

        console.log("🎉 All profile images inserted successfully!");
    } catch (error) {
        console.error("❌ Error inserting profile images:", error);
        throw error;
    } finally {
        await client.end();
    }
}

// 스크립트 실행
if (require.main === module) {
    insertProfileImages()
        .then(() => {
            console.log("Script completed successfully");
            process.exit(0);
        })
        .catch((error) => {
            console.error("Script failed:", error);
            process.exit(1);
        });
}

export { insertProfileImages };
