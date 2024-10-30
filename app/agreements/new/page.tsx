import { Metadata } from "next";
import { NewAgreementForm } from "@/components/new-agreement-form";

export const metadata: Metadata = {
  title: "New Agreement - Bridgarr",
  description: "Create a new escrow agreement",
};

export default function NewAgreementPage() {
  return <NewAgreementForm />;
}
