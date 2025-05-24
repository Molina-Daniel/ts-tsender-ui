"use client";

import InputField from "@/app/components/ui/InputField";
import SpinnerSVG from "@/app/components/ui/SpinnerSVG";
import { formatWei } from "@/utils";
import useAirdropFrom from "./useAirdropFrom";

export default function AirdropForm() {
  const {
    state: {
      tokenAddress,
      recipients,
      amounts,
      isPending,
      totalAmount,
      tokenName,
      tokenDecimals,
    },
    actions: { setTokenAddress, setRecipients, setAmounts, handleSubmit },
  } = useAirdropFrom();

  return (
    <div className="w-full max-w-4xl min-w-full xl:min-w-lg flex flex-col gap-6 p-6">
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
      <div className="flex flex-col gap-4 bg-white border border-zinc-300 rounded-lg p-4">
        <h3>Transaction Details</h3>
        <div className="flex justify-between">
          <p className="text-zinc-500">Token Name:</p>
          <p>{tokenName}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-zinc-500">Amount (wei):</p>
          <p>{totalAmount}</p>
        </div>
        {tokenDecimals && (
          <div className="flex justify-between">
            <p className="text-zinc-500">Amount (tokens):</p>
            <p>{formatWei(totalAmount, tokenDecimals)}</p>
          </div>
        )}
      </div>
      <button
        type="submit"
        className="border rounded-2xl w-full py-3 bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors cursor-pointer"
        onClick={handleSubmit}
      >
        {isPending ? (
          <span className="flex items-center justify-center">
            <SpinnerSVG />
            Confirming in wallet...
          </span>
        ) : (
          "Send Tokens"
        )}
      </button>
    </div>
  );
}
