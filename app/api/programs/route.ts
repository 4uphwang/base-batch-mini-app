import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { programs, cards } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/programs - Get all programs
export async function GET(req: Request) {
  try {
    const allPrograms = await db
      .select({
        id: programs.id,
        title: programs.title,
        description: programs.description,
        ownerCardId: programs.ownerCardId,
        type: programs.type,
        owner: {
          id: cards.id,
          nickname: cards.nickname,
          bio: cards.bio,
          imageURI: cards.imageURI,
          basename: cards.basename,
          role: cards.role,
          skills: cards.skills,
          address: cards.address,
        },
      })
      .from(programs)
      .innerJoin(cards, eq(programs.ownerCardId, cards.id));

    return NextResponse.json(allPrograms);
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

// POST /api/programs - Create new program
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

    // Check if owner card exists
    const ownerCard = await db
      .select()
      .from(cards)
      .where(eq(cards.id, ownerCardId));

    if (ownerCard.length === 0) {
      return NextResponse.json(
        { message: "Owner card not found" },
        { status: 404 }
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
