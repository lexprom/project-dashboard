import { validateJWT } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const req = await request.json();
  const user = await validateJWT(
    request.cookies.get(process.env.COOKIE_NAME)?.value
  );

  await db.project.create({
    data: {
      name: req.name,
      ownerId: user.id,
    },
  });

  return NextResponse.json({ data: { message: "okay" } });
}
