# 🛠️ Migration Guide: Next.js + NextAuth + MongoDB to Supabase

This guide walks through migrating an existing Next.js application using NextAuth v5 and MongoDB (with Mongoose) to a Supabase-based backend with authentication, real-time updates, and Postgres.

---

## 📦 Original Stack

- **Next.js (App Router)**
- **NextAuth v5 + @auth/core**
- **MongoDB with Mongoose**

---

## 🎯 Target Stack (With Supabase)

- **Next.js (App Router)**
- **Supabase Auth (email + OAuth)**
- **Supabase Postgres DB**
- **Supabase Realtime (for chat, notifications, etc.)**
- **Supabase JS Client**

---

## 📁 Folder/File Changes

### Remove:

- `/src/lib/dbConnect.ts`
- `/src/lib/mongoose.adapter.ts`
- `/src/models/data.model.ts`
- `/src/auth.ts`
- API routes using Mongoose

### Add:

- `/src/lib/supabase/client.ts`
- `/src/lib/supabase/server.ts`

---

## ✅ Migration Steps

### 1. 📋 Migrate Database Models to Supabase SQL

Convert Mongoose models to SQL tables using the Supabase dashboard or SQL editor.

#### Example:

```ts
// Mongoose
const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  image: String,
});
```

```sql
-- Supabase SQL
create table profiles (
  id uuid primary key references auth.users,
  email text,
  name text,
  image text,
  created_at timestamp default now()
);
```

### 2. ⚙️ Set Up Supabase Client

#### `/src/lib/supabase/client.ts`

```ts
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

#### `/src/lib/supabase/server.ts`

```ts
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export function createSupabaseServerClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  );
}
```

### 3. 🔐 Setup Supabase Auth

#### Configure in Supabase Dashboard:

- Enable email/password and OAuth providers.

#### Auth Example:

```ts
// Sign in
await supabase.auth.signInWithPassword({ email, password });

// Sign in with Google
await supabase.auth.signInWithOAuth({ provider: 'google' });
```

#### Auto-create profiles:

```sql
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();
```

### 4. 🔄 Replace Mongoose Usage with Supabase Client

#### From:

```ts
await dbConnect();
const user = await UserModel.findById(id);
```

#### To:

```ts
const { data: user } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', id)
  .single();
```

### 5. 🔁 Update API Routes or Remove

- Either replace Mongoose usage inside `/api/*` with Supabase
- Or remove API routes and call Supabase directly from client

### 6. 🛡️ Apply Row-Level Security (RLS)

```sql
alter table profiles enable row level security;

create policy "Users can access own profile"
on profiles for select
using (auth.uid() = id);
```

### 7. 🧑‍💻 Access Auth in Server Components

#### Example: `app/dashboard/page.tsx`

```ts
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return <div>Hello, {profile?.name || user.email}</div>;
}
```

### 8. ✅ Optional: Use in Server Actions

```ts
'use server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function postMessage(content: string) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  await supabase.from('messages').insert({ content, user_id: user.id });
}
```

---

## ✅ Benefits of Supabase Migration

| Feature              | Supabase Equivalent                   |
| -------------------- | ------------------------------------- |
| Database             | Postgres (vs MongoDB)                 |
| ORM                  | Supabase JS client (vs Mongoose)      |
| Auth                 | Built-in email/password + OAuth       |
| Realtime             | Native (for chat, notifications)      |
| Security             | RLS (Row-Level Security)              |
| Server/client access | `@supabase/ssr` for cookies + session |

---

## 📌 Notes

- Supabase manages sessions using JWTs
- For server components, always use `createServerClient()`
- Replace `useSession()` or `getServerSession()` with `supabase.auth.getUser()`

---

## ✅ Migration Complete!

You now have a secure, modern full-stack app using Supabase with real-time capabilities and integrated authentication.

