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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import type { NewAgreement } from "../types/agreement";

interface NewAgreementFormProps {
  agreement: NewAgreement;
  onChange: (agreement: NewAgreement) => void;
  onSubmit: () => void;
  loading: boolean;
}

export const NewAgreementForm: React.FC<NewAgreementFormProps> = ({
  agreement,
  onChange,
  onSubmit,
  loading,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Create New Agreement</CardTitle>
      <CardDescription>
        Create a new escrow agreement with a buyer
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <Label htmlFor="buyer">Buyer Address</Label>
          <Input
            id="buyer"
            value={agreement.buyer}
            onChange={(e) => onChange({ ...agreement, buyer: e.target.value })}
            placeholder="ST..."
          />
        </div>
        <div>
          <Label htmlFor="amount">Amount (STX)</Label>
          <Input
            id="amount"
            type="number"
            value={agreement.amount}
            onChange={(e) => onChange({ ...agreement, amount: e.target.value })}
            placeholder="0.0"
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={agreement.description}
            onChange={(e) =>
              onChange({ ...agreement, description: e.target.value })
            }
            placeholder="Describe the agreement..."
          />
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button className="w-full" onClick={onSubmit} disabled={loading}>
        {loading ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" /> Creating...
          </>
        ) : (
          "Create Agreement"
        )}
      </Button>
    </CardFooter>
  </Card>
);
