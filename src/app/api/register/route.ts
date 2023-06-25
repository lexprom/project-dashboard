import { createJWT, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(request: NextRequest, response: NextResponse) {
  const req = await request.json();

  const user = await db.user.create({
    data: {
      email: req.email,
      password: await hashPassword(req.password),
      firstName: req.firstName,
      lastName: req.lastName,
    },
  });

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
