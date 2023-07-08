import dynamic from "next/dynamic";
import NetworkSelector from "./network-selector";

const User = dynamic(() => import("./user"), { ssr: false });

export default function Header({ className }: { className: string }) {
  return (
    <div className={`${className} flex items-center px-large`}>
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <User />
        </div>
        <NetworkSelector />
      </div>
    </div>
  );
}
