import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { programs } from "@/db/schema";

// POST /api/program - Create new program (alternative endpoint)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, ownerCardId, type } = body;

        // Validate required fields
        if (!title || !ownerCardId || !type) {
            return NextResponse.json(
                {
                    message: "Title, ownerCardId, and type are required",
                },
                { status: 400 }
            );
        }

        // Validate type
        if (!["bounty", "project"].includes(type)) {
            return NextResponse.json(
                {
                    message: 'Type must be either "bounty" or "project"',
                },
                { status: 400 }
            );
        }

        // Create new program
        const newProgram = await db
            .insert(programs)
            .values({
                title,
                description,
                ownerCardId: parseInt(ownerCardId),
                type,
            })
            .returning();

        return NextResponse.json(newProgram[0], { status: 201 });
    } catch (error) {
        console.error("Error creating program:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}
