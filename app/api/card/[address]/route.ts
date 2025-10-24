import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cards } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/card/[address] - Get card by address
export async function GET(
    _: Request,
    { params }: { params: Promise<{ address: string }> }
) {
    try {
        const { address } = await params;

        const card = await db
            .select()
            .from(cards)
            .where(eq(cards.address, address));

        if (card.length === 0) {
            return NextResponse.json(
                { message: "Card not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(card[0]);
    } catch (error) {
        console.error("Error fetching card:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}

// PUT /api/card/[address] - Update card by address
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ address: string }> }
) {
    try {
        const { address } = await params;
        const body = await req.json();
        const {
            nickname,
            bio,
            imageURI,
            profileImage,
            basename,
            role,
            skills,
        } = body;

        // Check if card exists
        const existingCard = await db
            .select()
            .from(cards)
            .where(eq(cards.address, address));

        if (existingCard.length === 0) {
            return NextResponse.json(
                { message: "Card not found" },
                { status: 404 }
            );
        }

        // Update card
        const updatedCard = await db
            .update(cards)
            .set({
                nickname,
                bio,
                imageURI,
                profileImage, // 원본 프로필 이미지도 업데이트 가능
                basename,
                role,
                skills,
            })
            .where(eq(cards.address, address))
            .returning();

        return NextResponse.json(updatedCard[0]);
    } catch (error) {
        console.error("Error updating card:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}

// DELETE /api/card/[address] - Delete card by address
export async function DELETE(
    _: Request,
    { params }: { params: Promise<{ address: string }> }
) {
    try {
        const { address } = await params;

        // Check if card exists
        const existingCard = await db
            .select()
            .from(cards)
            .where(eq(cards.address, address));

        if (existingCard.length === 0) {
            return NextResponse.json(
                { success: false, message: "Card not found" },
                { status: 404 }
            );
        }

        // Delete card
        await db.delete(cards).where(eq(cards.address, address));

        return NextResponse.json({
            success: true,
            message: "Card deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting card:", error);
        return NextResponse.json(
            { success: false, message: "Something went wrong" },
            { status: 500 }
        );
    }
}
