/**
 * Shared API Types
 * 프론트엔드와 서버 사이드에서 공유하는 API 타입 정의
 *
 * Best Practice:
 * - 타입 불일치 방지
 * - Single Source of Truth
 * - 유지보수성 향상
 */

/**
 * Card Generation API Response
 * /api/generate 엔드포인트의 응답 타입
 */
export interface CardGenerationResponse {
    success: boolean;
    svg?: string;
    ipfs?: {
        id?: string;
        cid?: string;
        url?: string;
    };
    error?: string;
}

/**
 * Card Generation Request Data
 * /api/generate 엔드포인트의 요청 데이터
 */
export interface CardGenerationData {
    name: string;
    role: string;
    baseName: string;
    profileImage: File;
}

/**
 * IPFS Upload Response
 * Pinata SDK 업로드 결과 타입
 */
export interface IPFSUploadResponse {
    success: boolean;
    cid?: string;
    id?: string;
    url?: string;
    error?: string;
}
