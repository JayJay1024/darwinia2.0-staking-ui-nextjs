import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen gap-6">
      <p>Darwinia Staking App</p>
      <ConnectButton />
    </main>
  );
}
