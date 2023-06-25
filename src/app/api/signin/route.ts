import { comparePasswords, createJWT } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(req: NextRequest, res: NextResponse) {
  const reqBody = await req.json();
  const user = await db.user.findUnique({
    where: {
      email: reqBody.email,
    },
  });

  const isUser = await comparePasswords(reqBody.password, user?.password);

  if (isUser) {
    const jwt = await createJWT(user);

    return NextResponse.json(
      {},
      {
        status: 201,
        headers: {
          "Set-Cookie": serialize(process.env.COOKIE_NAME, jwt, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          }),
        },
      }
    );
  }
}
