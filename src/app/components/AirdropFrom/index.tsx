"use client";

import InputField from "@/app/components/ui/InputField";
import useAirdropFrom from "./useAirdropFrom";

export default function AirdropForm() {
  const {
    state: { tokenAddress, recipients, amounts, totalAmount },
    actions: { setTokenAddress, setRecipients, setAmounts, handleSubmit },
  } = useAirdropFrom();

  return (
    <div className="w-full max-w-2xl min-w-full xl:min-w-lg flex flex-col gap-6 p-6">
      <InputField
        label="Token Address"
        placeholder="0x"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
      />
      <InputField
        label="Recipients (comma or new line separated)"
        placeholder="0x123..., 0x456..."
        value={recipients}
        onChange={(e) => setRecipients(e.target.value)}
        large={true}
      />
      <InputField
        label="Amounts (wei; comma or new line separated)"
        placeholder="100, 200, 300..."
        value={amounts}
        onChange={(e) => setAmounts(e.target.value)}
        large={true}
      />
      <button
        type="submit"
        className="border rounded-2xl w-full py-3 bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors cursor-pointer"
        onClick={handleSubmit}
      >
        Send Tokens
      </button>
    </div>
  );
}
