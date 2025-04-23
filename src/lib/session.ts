import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  throw new Error("SESSION_SECRET environment variable is not defined");
}
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(userId: string) {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const session = await encrypt({ userId, expiresAt });

  const cookieStore = await cookies()
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
  });
}

export async function deleteSession() {
  (await cookies()).delete("session");
}

// Δηλώνουμε τι είναι το payload μας
type SessionPayload = {
  userId: string;
  expiresAt: number;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("key used", encodedKey);
    console.log("Failed to verify session", error);
    return null;
  }
}

// from the docs
// export async function updateSession() {
//   const session = (await cookies()).get('session')?.value
//   const payload = await decrypt(session)
 
//   if (!session || !payload) {
//     return null
//   }
 
//   const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
 
//   const cookieStore = await cookies()
//   cookieStore.set('session', session, {
//     httpOnly: true,
//     secure: true,
//     expires: expires,
//     sameSite: 'lax',
//     path: '/',
//   })
// }