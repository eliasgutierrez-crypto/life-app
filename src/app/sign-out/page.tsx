"use client";

import { SignOutButton } from "@clerk/nextjs";

export default function SignOutPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <SignOutButton redirectUrl="/sign-in">
        <button type="button" className="rounded bg-black px-4 py-2 text-white">
          Cerrar sesión
        </button>
      </SignOutButton>
    </main>
  );
}
