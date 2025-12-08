"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1
        className="text-3xl font-bold text-center cursor-pointer"
        onClick={() => router.push("/contests")}
      >
        Go to Contests
      </h1>
    </div>
  );
}
