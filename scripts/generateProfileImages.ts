import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

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

async function generateProfileImages() {
    try {
        console.log("Starting profile image generation...");

        const profileDir = join(__dirname, "../contracts/mocks/profile");
        const outputDir = join(__dirname, "../db/seed/profileImages");

        // 출력 디렉토리 생성
        const fs = require("fs");
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const profileImages: Record<string, string> = {};

        for (const [filename, address] of Object.entries(profileImageMapping)) {
            const imagePath = join(profileDir, filename);
            console.log(`Processing ${filename} for address ${address}...`);

            // 이미지를 base64로 인코딩
            const base64DataURL = encodeImageToBase64(imagePath);
            profileImages[address] = base64DataURL;

            console.log(`✅ Generated base64 for ${filename} (${address})`);
        }

        // 결과를 JSON 파일로 저장
        const outputPath = join(outputDir, "profileImages.json");
        writeFileSync(outputPath, JSON.stringify(profileImages, null, 2));

        console.log(`🎉 Profile images saved to ${outputPath}`);

        // TypeScript 파일로도 저장
        const tsOutputPath = join(outputDir, "profileImages.ts");
        const tsContent = `export const profileImages = ${JSON.stringify(
            profileImages,
            null,
            2
        )} as const;`;
        writeFileSync(tsOutputPath, tsContent);

        console.log(`🎉 TypeScript file saved to ${tsOutputPath}`);
    } catch (error) {
        console.error("❌ Error generating profile images:", error);
        throw error;
    }
}

// 스크립트 실행
if (require.main === module) {
    generateProfileImages()
        .then(() => {
            console.log("Script completed successfully");
            process.exit(0);
        })
        .catch((error) => {
            console.error("Script failed:", error);
            process.exit(1);
        });
}

export { generateProfileImages };
