import dynamic from "next/dynamic";
import NetworkSelector from "./network-selector";

const User = dynamic(() => import("./user"), { ssr: false });

export default function Header() {
  return (
    <div className="p-large">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <User />
        </div>
        <NetworkSelector />
      </div>
    </div>
  );
}
