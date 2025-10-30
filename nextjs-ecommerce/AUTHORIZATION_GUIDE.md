# 🔐 Hướng dẫn Phân Quyền (Authorization)

## 📋 Tổng quan

Hệ thống phân quyền dựa trên **Role-Based Access Control (RBAC)** với 3 roles:

| Role | Quyền hạn | Routes |
|---|---|---|
| **ADMIN** | Full access | `/admin/*`, `/`, `/shop/*`, etc. |
| **MODERATOR** | Admin panel access | `/admin/*`, `/`, `/shop/*`, etc. |
| **USER** | Public access only | `/`, `/shop/*`, `/product/*`, `/cart` |

---

## 🔑 Test Accounts

### 1. Admin Account
```
Email: admin@esim.com
Password: admin123
Role: ADMIN
Access: Full admin panel + all features
```

### 2. Moderator Account
```
Email: moderator@esim.com
Password: mod123
Role: MODERATOR
Access: Admin panel (same as admin)
```

### 3. Regular User
```
Email: user@esim.com
Password: user123
Role: USER
Access: Public pages only (no admin access)
```

---

## 🚀 Testing Authorization

### Test 1: Admin Access
1. **Login**: http://localhost:3000/login
   - Email: `admin@esim.com`
   - Password: `admin123`

2. **Go to Admin Panel**: http://localhost:3000/admin
   - ✅ Should see admin dashboard
   - ✅ Can access all admin features

3. **Logout and test next account**

### Test 2: Moderator Access
1. **Login**: http://localhost:3000/login
   - Email: `moderator@esim.com`
   - Password: `mod123`

2. **Go to Admin Panel**: http://localhost:3000/admin
   - ✅ Should see admin dashboard
   - ✅ Can access admin features

### Test 3: User Access (Should Fail)
1. **Login**: http://localhost:3000/login
   - Email: `user@esim.com`
   - Password: `user123`

2. **Try to access Admin**: http://localhost:3000/admin
   - ❌ Should be redirected to `/unauthorized`
   - ✅ See "Access Denied" page
   - ✅ Shows current role: USER

---

## 🛡️ How It Works

### 1. **Middleware Protection** (`middleware.ts`)

```typescript
// Check if route is /admin/*
if (request.nextUrl.pathname.startsWith("/admin")) {
  if (!token) {
    redirect("/login");
  }
  // Verify JWT token
  jwt.verify(token, JWT_SECRET);
}
```

**What it does:**
- Checks if user has valid session token
- Redirects to `/login` if not authenticated
- Does NOT check role (that's in layout)

### 2. **Layout Authorization** (`app/(admin)/admin/layout.tsx`)

```typescript
const user = await getCurrentUser();

// Check authentication
if (!user) {
  redirect("/login?redirect=/admin");
}

// Check authorization (role)
const allowedRoles = ["ADMIN", "MODERATOR"];
if (!allowedRoles.includes(user.role)) {
  redirect("/unauthorized");
}
```

**What it does:**
- Gets current user from database
- Checks if role is ADMIN or MODERATOR
- Redirects to `/unauthorized` if wrong role

### 3. **Unauthorized Page** (`app/unauthorized/page.tsx`)

Shows when user doesn't have required role:
- Shows "Access Denied" message
- Displays user's current role
- Provides links to go home or login

---

## 🔧 Implementation Details

### Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      String   @default("USER") // ADMIN, MODERATOR, or USER
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### JWT Token

```typescript
// Contains: userId, email, role
const token = jwt.sign(
  { userId, email, role },
  JWT_SECRET,
  { expiresIn: "7d" }
);
```

### Session Cookie

```typescript
// Stored in cookies
cookies().set("session", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7, // 7 days
});
```

---

## 📝 Using Authorization in Code

### Server Components (Recommended)

```typescript
import { requireAdminOrModerator } from "@/lib/check-role";

export default async function AdminPage() {
  // This will redirect if user is not admin/moderator
  const user = await requireAdminOrModerator();

  return (
    <div>
      <h1>Welcome {user.name}</h1>
      <p>Your role: {user.role}</p>
    </div>
  );
}
```

### Check Specific Roles

```typescript
import { requireRole } from "@/lib/check-role";

export default async function SettingsPage() {
  // Only allow ADMIN
  const user = await requireRole(["ADMIN"]);
  
  // Do admin-only stuff
}
```

### Client Components

```typescript
"use client";
import { isAdminOrModerator } from "@/lib/check-role";

export default function MyComponent({ userRole }: { userRole: string }) {
  const canEdit = isAdminOrModerator(userRole);

  return (
    <div>
      {canEdit && (
        <button>Edit</button>
      )}
    </div>
  );
}
```

---

## 🎯 Common Scenarios

### Scenario 1: Restrict entire route

```typescript
// app/admin/settings/page.tsx
import { requireAdmin } from "@/lib/check-role";

export default async function SettingsPage() {
  await requireAdmin(); // Only ADMIN allowed
  return <div>Admin Settings</div>;
}
```

### Scenario 2: Show/hide UI based on role

```typescript
// In any server component
import { getCurrentUser } from "@/lib/get-current-user";

export default async function MyPage() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "ADMIN";

  return (
    <div>
      {isAdmin && <AdminOnlyButton />}
      <RegularContent />
    </div>
  );
}
```

### Scenario 3: API Route Protection

```typescript
// app/api/admin/route.ts
import { getCurrentUser } from "@/lib/get-current-user";

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user || !["ADMIN", "MODERATOR"].includes(user.role)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }

  // Process request
}
```

---

## 🔄 Adding New Roles

### Step 1: Update User Model (if needed)

```typescript
// Role can be any string, but recommend using enum
type UserRole = "ADMIN" | "MODERATOR" | "USER" | "EDITOR";
```

### Step 2: Create User with New Role

```typescript
await prisma.user.create({
  data: {
    email: "editor@esim.com",
    name: "Editor",
    password: hashedPassword,
    role: "EDITOR",
  },
});
```

### Step 3: Update Authorization Logic

```typescript
// Allow EDITOR to access admin panel
const allowedRoles = ["ADMIN", "MODERATOR", "EDITOR"];
if (!allowedRoles.includes(user.role)) {
  redirect("/unauthorized");
}
```

---

## 🚨 Security Best Practices

### ✅ DO:
- Always check auth on server side
- Use `requireRole()` for protected pages
- Store role in JWT token
- Validate role from database
- Use httpOnly cookies

### ❌ DON'T:
- Rely only on client-side checks
- Store sensitive data in JWT
- Skip role validation
- Trust client-provided role
- Use localStorage for tokens

---

## 📚 File Structure

```
app/
├── (admin)/
│   └── admin/
│       ├── layout.tsx          ← Authorization check here
│       ├── page.tsx
│       └── products/
├── unauthorized/
│   └── page.tsx                ← Unauthorized access page
└── login/
    └── page.tsx

lib/
├── auth.ts                     ← JWT functions
├── get-current-user.ts         ← Get user from session
└── check-role.ts               ← Authorization utilities

middleware.ts                   ← Route protection
```

---

## 🧪 Testing Checklist

- [ ] Admin can access `/admin`
- [ ] Moderator can access `/admin`
- [ ] Regular user redirected to `/unauthorized`
- [ ] Unauthenticated user redirected to `/login`
- [ ] Unauthorized page shows correct role
- [ ] After login, redirected to requested page
- [ ] Logout clears session
- [ ] Token expiration works

---

## 🔗 Related Files

- `middleware.ts` - Route protection
- `app/(admin)/admin/layout.tsx` - Role check
- `lib/check-role.ts` - Authorization utilities
- `lib/get-current-user.ts` - Get current user
- `app/unauthorized/page.tsx` - Unauthorized page
- `prisma/seed-admin.ts` - Create test users

---

## 📞 Support

Nếu gặp vấn đề:
1. Check cookies có session token không
2. Verify JWT token valid
3. Check user role trong database
4. Clear cookies và login lại

---

🎉 **Authorization system is ready!** Test it now!

