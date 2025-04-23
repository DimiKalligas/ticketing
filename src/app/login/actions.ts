'use server'

import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { z } from 'zod'

const testUser = {
    id: '1',
    email: 'jim@email.com',
    password: '123',
    role: 'admin',
}

const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address'}).trim(),
    password:z
    .string()
    .min(3, { message: 'Password must be at least 3 characters'})
    .trim(),
})

export async function login(prevState: any, formData: FormData) {
    // convert formData into Object and safe parsing it into loginschema
    const result = loginSchema.safeParse(Object.fromEntries(formData));
  
    if (!result.success) {
      console.log('failed in safeParse');
      
      return {
        errors: result.error.flatten().fieldErrors,
      };
    }
  
    const { email, password } = result.data;
  
    if (email !== testUser.email || password !== testUser.password) {
      return {
        errors: {
          email: ["Invalid email or password"],
        },
      };
    }
  
  // create session for user & store it in cookie
    await createSession(testUser.id);
  
    redirect("/tickets");
  }
  
  export async function logout() {
    await deleteSession();
    redirect("/login");
  }