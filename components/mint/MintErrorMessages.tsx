import { memo } from "react";

interface MintErrorMessagesProps {
    generationError: string | null;
    mintError: string | null;
}

/**
 * 민팅 에러 메시지 컴포넌트
 */
export const MintErrorMessages = memo(function MintErrorMessages({ generationError, mintError }: MintErrorMessagesProps) {
    // 에러가 없으면 렌더링하지 않음
    if (!generationError && !mintError) {
        return null;
    }

    return (
        <>
            {generationError && (
                <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">❌ {generationError}</p>
                </div>
            )}

            {mintError && (
                <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">❌ Mint Error: {mintError}</p>
                </div>
            )}
        </>
    );
});

