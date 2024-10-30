"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserSession } from "@stacks/auth";
import { useToast } from "@/components/ui/use-toast";
import { Navbar } from "@/components/navbar";
import { Overview } from "@/components/overview";
import { RecentAgreements } from "@/components/recent-agreements";
import { useWallet } from "@/hooks/use-wallet";

export const BridgarrApp = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { address, connect } = useWallet();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeWallet = async () => {
      const userSession = new UserSession();
      if (userSession.isUserSignedIn()) {
        const userData = userSession.loadUserData();
        // Use testnet for development, mainnet for production
        const walletAddress = userData.profile.stxAddress.testnet;
        if (walletAddress) {
          connect(walletAddress);
        }
      }
      setIsLoading(false);
    };

    initializeWallet();
  }, [connect]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {!address ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <h1 className="text-3xl font-bold text-center">
              Welcome to Bridgarr Escrow
            </h1>
            <p className="text-muted-foreground text-center max-w-md">
              Connect your Stacks wallet to start managing your escrow
              agreements
            </p>
            <button
              onClick={() => connect()}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <Overview />
            <RecentAgreements />
          </div>
        )}
      </main>
    </div>
  );
};
