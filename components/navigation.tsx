import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export const Navigation = () => {
  return (
    <nav className="bg-background border-b border-foreground/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="shrink-0 flex items-center gap-4">
            <h1 className="text-xl font-semibold text-foreground">
              <Link href="/">QpiAi</Link>
            </h1>
            <SignedIn>
              <Link href="/uploads" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Uploads
              </Link>
            </SignedIn>
          </div>
          <div className="flex items-center gap-4">
            <SignedIn>
              <UserButton />
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-3 py-2 text-sm rounded-md bg-primary text-white">
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  );
};
