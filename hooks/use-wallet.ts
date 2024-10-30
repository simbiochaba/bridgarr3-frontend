import { create } from "zustand";

interface WalletStore {
  address: string | null;
  connect: (address: string) => void;
  disconnect: () => void;
}

export const useWallet = create<WalletStore>((set) => ({
  address: null,
  connect: (address) => set({ address }),
  disconnect: () => set({ address: null }),
}));
