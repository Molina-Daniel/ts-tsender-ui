"use client";

import { useAccount } from "wagmi";
import AirdropFrom from "@/app/components/AirdropFrom";

export default function HomeContent() {
  const { isConnected } = useAccount();

  return (
    <div className="container mx-auto">
      {isConnected ? (
        <div className="grid grid-cols-1 gap-4 justify-items-center">
          <AirdropFrom />
        </div>
      ) : (
        <h1 className="text-xl font-bold my-8 text-center">
          Please connect a wallet...
        </h1>
      )}
    </div>
  );
}
