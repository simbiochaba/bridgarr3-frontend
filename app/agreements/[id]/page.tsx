import { Metadata } from "next";
import { AgreementDetails } from "@/components/agreement-details";

export const metadata: Metadata = {
  title: "Agreement Details - Bridgarr",
  description: "View and manage agreement details",
};

interface AgreementPageProps {
  params: {
    id: string;
  };
}

export default function AgreementPage({ params }: AgreementPageProps) {
  return <AgreementDetails id={params.id} />;
}
