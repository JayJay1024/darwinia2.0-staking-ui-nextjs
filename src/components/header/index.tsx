import NetworkSelector from "./network-selector";
import User from "./user";

export default function Header() {
  return (
    <div className="p-large">
      <div className="container mx-auto flex items-center justify-between">
        <User />
        <NetworkSelector />
      </div>
    </div>
  );
}
