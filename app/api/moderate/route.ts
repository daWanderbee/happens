import { NextResponse } from "next/server";
import { moderateText } from "@/lib/moderate";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const result = moderateText(text);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
