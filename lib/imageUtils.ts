/**
 * Image utility functions for BaseCard application
 * Handles image to base64 conversion and data URL generation
 */

/**
 * Convert base64 string and mime type to data URL format
 * @param base64 - Base64 encoded string
 * @param mimeType - Image mime type (e.g., 'image/png', 'image/jpeg')
 * @returns Data URL string (e.g., 'data:image/png;base64,...')
 */
export function imageToDataURL(base64: string, mimeType: string): string {
    return `data:${mimeType};base64,${base64}`;
}

/**
 * Convert File object to base64 data URL
 * @param file - Image file to convert
 * @returns Promise that resolves to data URL string
 */
export async function convertFileToBase64DataURL(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const imageBase64 = buffer.toString("base64");

    return imageToDataURL(imageBase64, file.type);
}

/**
 * Validate if file is a valid image type
 * @param file - File to validate
 * @returns true if valid image type
 */
export function isValidImageType(file: File): boolean {
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    return validTypes.includes(file.type);
}

/**
 * Validate image file size
 * @param file - File to validate
 * @param maxSizeMB - Maximum size in MB (default: 5MB)
 * @returns true if file size is within limit
 */
export function isValidImageSize(file: File, maxSizeMB: number = 5): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
}

/**
 * Validate image file
 * @param file - File to validate
 * @returns Validation result with error message if invalid
 */
export function validateImageFile(file: File): {
    valid: boolean;
    error?: string;
} {
    if (!isValidImageType(file)) {
        return {
            valid: false,
            error: "Invalid file type. Please upload PNG or JPEG image.",
        };
    }

    if (!isValidImageSize(file)) {
        return {
            valid: false,
            error: "File size too large. Maximum size is 5MB.",
        };
    }

    return { valid: true };
}

/**
 * Safely convert imageURI to displayable URL
 * Handles various formats: ipfs://, http://, https://, data:image/...
 * @param imageURI - Image URI from database or API
 * @param fallbackUrl - Fallback URL if imageURI is invalid (default: null)
 * @returns Valid URL string or fallback URL
 */
export function safeImageURI(
    imageURI: string | null | undefined,
    fallbackUrl: string | null = null
): string | null {
    // Handle null, undefined, or empty string
    if (!imageURI || typeof imageURI !== "string" || imageURI.trim() === "") {
        return fallbackUrl;
    }

    const uri = imageURI.trim();

    try {
        // Handle IPFS URIs
        if (uri.startsWith("ipfs://")) {
            const cid = uri.replace("ipfs://", "");
            // Validate CID is not empty
            if (!cid) {
                return fallbackUrl;
            }
            return `https://ipfs.io/ipfs/${cid}`;
        }

        // Handle data URLs (base64 encoded images)
        if (uri.startsWith("data:image/")) {
            // Basic validation for data URL format
            if (uri.includes("base64,")) {
                return uri;
            }
            return fallbackUrl;
        }

        // Handle HTTP/HTTPS URLs
        if (uri.startsWith("http://") || uri.startsWith("https://")) {
            // Optional: Validate URL format
            try {
                new URL(uri);
                return uri;
            } catch {
                return fallbackUrl;
            }
        }

        // Handle relative paths or other formats
        // If it looks like a path, return it
        if (uri.startsWith("/")) {
            return uri;
        }

        // Unknown format, return fallback
        return fallbackUrl;
    } catch (error) {
        console.error("Error processing imageURI:", error);
        return fallbackUrl;
    }
}

/**
 * Check if imageURI is valid (non-null and processable)
 * @param imageURI - Image URI to validate
 * @returns true if valid, false otherwise
 */
export function isValidImageURI(imageURI: string | null | undefined): boolean {
    return safeImageURI(imageURI) !== null;
}

/**
 * File 객체의 이미지를 Base64 data URL로 변환하기 전에,
 * 지정된 최대 크기에 맞춰 압축 및 리사이징하고, 우측 상하단만 라운딩 처리하는 함수
 * @param file - 원본 File 객체 (이미지)
 * @param maxWidth - 이미지의 최대 너비 (픽셀)
 * @param maxHeight - 이미지의 최대 높이 (픽셀)
 * @param quality - 이미지 압축 품질 (0.0 ~ 1.0)
 * @param borderRadius - 우측 모서리 둥글기 반지름 (픽셀) 💡 수정된 파라미터
 * @returns Base64 Data URL 문자열
 */
export const resizeAndCompressImage = (
    file: File,
    maxWidth: number,
    maxHeight: number,
    quality: number = 0.8,
    borderRadius: number = 0 // 💡 우측 모서리에 적용할 반지름
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new (window as any).Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                // 캔버스 크기는 목표 크기로 고정합니다.
                canvas.width = maxWidth;
                canvas.height = maxHeight;

                const imageRatio = img.width / img.height;
                const canvasRatio = maxWidth / maxHeight;

                let sourceX = 0;
                let sourceY = 0;
                let sourceWidth = img.width;
                let sourceHeight = img.height;

                // 🔑 Cover 로직: 이미지의 어떤 부분이 잘릴지 계산
                if (imageRatio > canvasRatio) {
                    // 이미지가 캔버스보다 가로로 길다 (좌우가 잘림)
                    sourceWidth = img.height * canvasRatio;
                    sourceX = (img.width - sourceWidth) / 2; // 중앙 정렬
                } else {
                    // 이미지가 캔버스보다 세로로 길거나 같다 (상하가 잘림)
                    sourceHeight = img.width / canvasRatio;
                    sourceY = (img.height - sourceHeight) / 2; // 중앙 정렬
                }

                if (ctx && borderRadius > 0) {
                    // 캔버스 크기(maxWidth, maxHeight)를 기준으로 라운딩 경로 설정
                    ctx.beginPath();
                    const radius = Math.min(borderRadius, maxWidth / 2, maxHeight / 2);

                    ctx.moveTo(0, 0);
                    ctx.lineTo(maxWidth - radius, 0);
                    ctx.arcTo(maxWidth, 0, maxWidth, radius, radius);
                    ctx.lineTo(maxWidth, maxHeight - radius);
                    ctx.arcTo(maxWidth, maxHeight, maxWidth - radius, maxHeight, radius);
                    ctx.lineTo(0, maxHeight);
                    ctx.lineTo(0, 0);

                    ctx.clip();
                }

                // 캔버스에 이미지 그리기
                ctx?.drawImage(
                    img,
                    sourceX, sourceY, sourceWidth, sourceHeight,
                    0, 0, maxWidth, maxHeight
                );

                // 압축 및 Base64로 변환
                const dataUrl = canvas.toDataURL("image/webp", quality);
                resolve(dataUrl);
            };

            img.onerror = (error: any) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};
