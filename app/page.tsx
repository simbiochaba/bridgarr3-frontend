import { Metadata } from "next";
import { BridgarrApp } from "@/components/bridgarr-app";

export const metadata: Metadata = {
  title: "Dashboard - Bridgarr",
  description: "Manage your escrow agreements",
};

export default function HomePage() {
  return <BridgarrApp />;
}
