import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

// type EmailOrId = string | number;

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isNumeric(value: string): boolean {
  return /^\d+$/.test(value);
}

export async function getUser(params: string) {
  // what is sent is serialized, so always a string ->
  // console.log('in getUser received:', typeof params)
  if (isNumeric(params)) { 
    const user = await db.select()
          .from(users)
          .where(eq(users.id, Number(params)))
          .limit(1);
          return user[0]
    } else if (isEmail(params)) {
      const user = await db.select()
      .from(users)
      .where(eq(users.email, params))
      return user[0]
    }

    throw new Error("Invalid parameters: must provide either 'id' or 'email'");
}