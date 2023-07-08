"use client";

import dynamic from "next/dynamic";

const Login = dynamic(() => import("@/components/login"), { ssr: false });

export default function Home() {
  return (
    <div className="p-large pt-0 h-full">
      <div className="container mx-auto bg-component h-full flex flex-col justify-center items-center gap-6">
        <Login />
      </div>
    </div>
  );
}
