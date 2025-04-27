import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

type GetUserParams =
  | { id: number; email?: never }
  | { email: string; id?: never };

export async function getUser(params: GetUserParams) {
    if ('id' in params) {
        const user = await db.select()
            .from(users)
            .where(eq(users.id, params.id))
            .limit(1);
            return user[0]
      } else if ('email' in params) {
        const user = await db.select()
        .from(users)
        .where(eq(users.email, params.email))
        return user[0]
      }

      throw new Error("Invalid parameters: must provide either 'id' or 'email'");
}