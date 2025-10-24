import { uploadBaseCardToIPFS } from "@/lib/ipfs";
import type { CardGenerationResponse } from "@/lib/types/api";
import fs from "fs/promises";
import path from "path";

// SVG에 삽입할 데이터를 정의하는 타입
type SvgData = {
    nickname: string;
    role: string;
    basename: string;
    profileImage: {
        base64: string;
        mimeType: string;
    };
};

/**
 * SVG 템플릿에 실제 데이터를 삽입하여 최종 SVG 문자열을 생성합니다.
 */
const createBaseCardSvg = (baseTemplate: string, data: SvgData): string => {
    const { nickname, role, basename, profileImage } = data;
    const profileImageDataUrl = `data:${profileImage.mimeType};base64,${profileImage.base64}`;

    // 새로 추가할 SVG 컴포넌트 코드
    const newElements = `
    <defs>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=K2D:wght@400;700&amp;display=swap');
      </style>
    </defs>
    <image href="${profileImageDataUrl}" x="0" y="60" width="225" height="225" clip-path="url(#profileClipPath)" preserveAspectRatio="xMidYMid slice" />

    <text x="258" y="100" font-family="K2D" font-size="36" fill="white" font-weight="bold">${nickname}</text>
    <text x="258" y="130" font-family="K2D" font-size="16" fill="white" font-weight="lighter">${basename}</text>
    <text x="258" y="180" font-family="K2D" font-size="28" fill="white" font-weight="bold">${role}</text>
  `;

    // base-template.svg의 </svg> 태그 바로 앞에 새로운 요소들을 삽입합니다.
    return baseTemplate.replace("</svg>", `${newElements}</svg>`);
};

export async function POST(request: Request) {
    try {
        // 1. FormData 파싱
        const formData = await request.formData();

        const nickname = formData.get("nickname") as string;
        const role = formData.get("role") as string;
        const basename = formData.get("basename") as string;
        const uploadedFile = formData.get("profileImage") as File;
        const uploadToIpfs = formData.get("uploadToIpfs") === "true";

        if (!uploadedFile) {
            return new Response(
                JSON.stringify({ message: "Profile image is required." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // 2. SVG 템플릿 파일 읽기
        const templatePath = path.join(
            process.cwd(),
            "public",
            "assets",
            "basecard-base.svg"
        );
        const baseTemplate = await fs.readFile(templatePath, "utf-8");

        // 3. 업로드된 이미지를 읽어 Base64로 인코딩
        const arrayBuffer = await uploadedFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const imageBase64 = buffer.toString("base64");

        const svgData: SvgData = {
            nickname,
            role,
            basename,
            profileImage: {
                base64: imageBase64,
                mimeType: uploadedFile.type || "image/jpeg",
            },
        };

        // 4. 최종 SVG 생성
        const baseCardSvg = createBaseCardSvg(baseTemplate, svgData);

        // 5. IPFS 업로드 (옵션)
        if (uploadToIpfs) {
            const ipfsResult = await uploadBaseCardToIPFS(baseCardSvg, {
                name: nickname || "BaseCard",
            });

            if (!ipfsResult.success) {
                console.error("❌ IPFS upload failed:", ipfsResult.error);
                // IPFS 실패해도 SVG는 반환
            }

            // 타입 일관성: CardGenerationResponse 형태로 반환
            const response: CardGenerationResponse = {
                success: true,
                svg: baseCardSvg,
                ipfs: ipfsResult.success
                    ? {
                        id: ipfsResult.id,
                        cid: ipfsResult.cid,
                        url: ipfsResult.url,
                    }
                    : undefined,
            };

            return new Response(JSON.stringify(response), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        // 5-1. IPFS 업로드 없이 SVG만 반환
        const response: CardGenerationResponse = {
            success: true,
            svg: baseCardSvg,
        };

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error generating SVG:", error);
        return new Response(
            JSON.stringify({
                message: "Internal Server Error",
                error: error instanceof Error ? error.message : "Unknown error",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
