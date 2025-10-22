import { NextResponse } from "next/server";
import { deleteFromIPFS } from "@/lib/ipfs";

/**
 * DELETE /api/ipfs/delete
 * Remove a file from IPFS (unpin from Pinata)
 *
 * Use case: Clean up failed mints or unwanted uploads
 */
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, error: "ID is required" },
                { status: 400 }
            );
        }

        // Delete from IPFS via Pinata
        const result = await deleteFromIPFS(id);

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `File ${id} unpinned from IPFS`,
        });
    } catch (error) {
        console.error("DELETE /api/ipfs/delete error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
