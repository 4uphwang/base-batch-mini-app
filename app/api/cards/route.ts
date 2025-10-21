import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cards } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/cards?address=0x...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  try {
    // 주소 파라미터가 있으면 해당 카드만 조회
    if (address) {
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
    }

    // 파라미터가 없으면 모든 카드 조회
    const allCards = await db.select().from(cards);
    return NextResponse.json(allCards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

// POST /api/cards - Create new card
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nickname, bio, imageURI, basename, role, skills, address } = body;

    // Validate required fields
    if (!address) {
      return NextResponse.json(
        { message: "Address is required" },
        { status: 400 }
      );
    }

    const newCard = await db
      .insert(cards)
      .values({
        nickname,
        bio,
        imageURI,
        basename,
        role,
        skills,
        address,
      })
      .returning();

    return NextResponse.json(newCard[0], { status: 201 });
  } catch (error) {
    console.error("Error creating card:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
