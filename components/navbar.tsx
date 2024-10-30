"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useWallet } from "@/hooks/use-wallet";

export const Navbar = () => {
  const pathname = usePathname();
  const { address, connect, disconnect } = useWallet();

  const routes = [
    {
      href: "/",
      label: "Dashboard",
    },
    {
      href: "/agreements",
      label: "Agreements",
    },
  ];

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="font-bold text-xl">
              Bridgarr
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "text-sm transition-colors hover:text-primary",
                    pathname === route.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {address ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground hidden md:inline">
                  {`${address.slice(0, 6)}...${address.slice(-4)}`}
                </span>
                <Button onClick={() => connect(address)}>Connect Wallet</Button>
              </div>
            ) : (
              <Button variant="outline" onClick={disconnect}>
                Disconnect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
