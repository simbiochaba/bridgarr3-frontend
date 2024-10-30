// src/components/AgreementCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { STATUS_LABELS, STATUS_COLORS } from "../constants/contract";
import type { Agreement } from "../types/agreement";

interface AgreementCardProps {
  agreement: Agreement;
  isReceived: boolean;
  loading: boolean;
  onFund: (id: number) => void;
  onAccept: (id: number) => void;
  onComplete: (id: number) => void;
  onDispute: (id: number) => void;
}

export const AgreementCard: React.FC<AgreementCardProps> = ({
  agreement,
  isReceived,
  loading,
  onFund,
  onAccept,
  onComplete,
  onDispute,
}) => (
  <Card className="mb-4">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="text-lg">Agreement #{agreement.id}</CardTitle>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            STATUS_COLORS[agreement.status]
          }`}
        >
          {STATUS_LABELS[agreement.status]}
        </span>
      </div>
      <CardDescription>
        Created on {new Date(agreement.createdAt).toLocaleDateString()}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div>
          <Label>Description</Label>
          <p className="text-gray-700">{agreement.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Amount</Label>
            <p className="text-gray-700">{agreement.amount} STX</p>
          </div>
          <div>
            <Label>{isReceived ? "Vendor" : "Buyer"}</Label>
            <p className="text-gray-700 truncate">
              {isReceived ? agreement.vendor : agreement.buyer}
            </p>
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter className="flex justify-end space-x-2">
      {agreement.status === 1 && isReceived && (
        <Button onClick={() => onFund(agreement.id)} disabled={loading}>
          Fund Agreement
        </Button>
      )}
      {agreement.status === 2 && isReceived && (
        <Button onClick={() => onAccept(agreement.id)} disabled={loading}>
          Accept Agreement
        </Button>
      )}
      {agreement.status === 3 && isReceived && (
        <>
          <Button
            variant="outline"
            onClick={() => onDispute(agreement.id)}
            disabled={loading}
          >
            Dispute
          </Button>
          <Button onClick={() => onComplete(agreement.id)} disabled={loading}>
            Complete
          </Button>
        </>
      )}
    </CardFooter>
  </Card>
);