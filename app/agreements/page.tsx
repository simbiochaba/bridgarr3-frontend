import { Metadata } from "next";
import { AgreementsList } from "@/components/agreements-list";

export const metadata: Metadata = {
  title: "Agreements - Bridgarr",
  description: "View and manage your escrow agreements",
};

export default function AgreementsPage() {
  return <AgreementsList />;
}
