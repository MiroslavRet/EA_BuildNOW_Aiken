import { useEffect } from "react";
import { LucidEvolution } from "@lucid-evolution/lucid";

import { network, provider } from "@/config/lucid";
import { useWallet } from "../wallet/WalletContext";

export default function LucidProvider(props: { children: React.ReactNode }) {
  const [walletConnection, setWalletConnection] = useWallet();

  useEffect(() => {
    LucidEvolution.new(provider, network).then((lucid) => {
      setWalletConnection((walletConnection) => {
        return { ...walletConnection, lucid };
      });
    });
  }, [setWalletConnection]);

  return <>{props.children}</>;
}