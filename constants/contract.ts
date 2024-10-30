// src/constants/contract.ts
import { STACKS_TESTNET} from "@stacks/network";

export const CONTRACT_ADDRESS = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
export const CONTRACT_NAME = "bridgarr";
export const NETWORK = STACKS_TESTNET; // Change to StacksMainnet for production

export const STATUS_LABELS = {
  1: "Pending",
  2: "Funded",
  3: "Accepted",
  4: "Completed",
  5: "Disputed",
  6: "Refunded",
} as const;

export const STATUS_COLORS = {
  1: "bg-yellow-100",
  2: "bg-blue-100",
  3: "bg-green-100",
  4: "bg-green-200",
  5: "bg-red-100",
  6: "bg-gray-100",
} as const;
