import Image from "next/image";

export default function CustomRpc() {
  return (
    <>
      <button className="inline-flex h-9 w-9 items-center justify-center border border-primary text-sm font-light text-white transition-opacity hover:opacity-80 active:opacity-60">
        <Image width={16} height={16} alt="Custom rpc" src="/images/setting.svg" />
      </button>
    </>
  );
}
