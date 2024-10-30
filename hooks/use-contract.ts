import { useState, useCallback } from "react";
import { useConnect } from "@stacks/connect-react";
import {
  fetchCallReadOnlyFunction,
  uintCV,
  stringUtf8CV,
  standardPrincipalCV,
  cvToString,
} from "@stacks/transactions";
import {
  CONTRACT_ADDRESS,
  CONTRACT_NAME,
  NETWORK,
} from "../constants/contract";
import type { NewAgreement } from "@/types/agreement";

export const useContract = (userAddress: string) => {
  const { doContractCall } = useConnect();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAgreement = useCallback(
    async (agreementId: number) => {
      try {
        const result = await fetchCallReadOnlyFunction({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: "get-agreement",
          functionArgs: [uintCV(agreementId)],
          network: NETWORK,
          senderAddress: userAddress,
        });

        return result.value;
      } catch (err) {
        console.error("Error fetching agreement:", err);
        return null;
      }
    },
    [userAddress]
  );

  const createAgreement = useCallback(
    async (agreement: NewAgreement) => {
      setLoading(true);
      try {
        await doContractCall({
          network: NETWORK,
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: "create-agreement",
          functionArgs: [
            standardPrincipalCV(agreement.buyer),
            uintCV(parseInt(agreement.amount) * 1000000), // Convert to microSTX
            stringUtf8CV(agreement.description),
          ],
          onFinish: (result) => {
            console.log("Agreement created:", result);
            setLoading(false);
          },
          onCancel: () => {
            setError("Transaction cancelled");
            setLoading(false);
          },
        });
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    },
    [doContractCall]
  );

  const handleContractCall = useCallback(
    async (functionName: string, args: any[], onSuccess?: () => void) => {
      try {
        await doContractCall({
          network: NETWORK,
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName,
          functionArgs: args,
          onFinish: (result) => {
            console.log(`${functionName} completed:`, result);
            onSuccess?.();
          },
        });
      } catch (err: any) {
        setError(err.message);
      }
    },
    [doContractCall]
  );

  const fundAgreement = useCallback(
    (agreementId: number) =>
      handleContractCall("fund-agreement", [uintCV(agreementId)]),
    [handleContractCall]
  );

  const acceptAgreement = useCallback(
    (agreementId: number) =>
      handleContractCall("accept-agreement", [uintCV(agreementId)]),
    [handleContractCall]
  );

  const completeAgreement = useCallback(
    (agreementId: number) =>
      handleContractCall("complete-agreement", [uintCV(agreementId)]),
    [handleContractCall]
  );

  const disputeAgreement = useCallback(
    (agreementId: number) =>
      handleContractCall("dispute-agreement", [uintCV(agreementId)]),
    [handleContractCall]
  );

  const fetchUserAgreements = useCallback(async () => {
    if (!userAddress) return [];

    setLoading(true);
    try {
      const agreementCount = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: "get-agreement-nonce",
        functionArgs: [],
        network: NETWORK,
        senderAddress: userAddress,
      });

      const count = parseInt(cvToString(agreementCount));
      const agreementPromises = [];

      for (let i = 1; i <= count; i++) {
        agreementPromises.push(fetchAgreement(i));
      }

      const agreements = await Promise.all(agreementPromises);
      return agreements.filter((a) => a !== null);
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [userAddress, fetchAgreement]);

  return {
    loading,
    error,
    createAgreement,
    fundAgreement,
    acceptAgreement,
    completeAgreement,
    disputeAgreement,
    fetchUserAgreements,
  };
};
