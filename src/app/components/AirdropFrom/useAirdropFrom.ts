import { useMemo, useState } from "react";
import { useChainId, useConfig, useAccount, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants";
import { calculateTotal } from "@/utils";

const useAirdropFrom = () => {
  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [recipients, setRecipients] = useState<string>("");
  const [amounts, setAmounts] = useState<string>("");
  const totalAmount = useMemo(() => calculateTotal(amounts), [amounts]);

  async function getApprovedAmount(
    tSenderAddress: string | null
  ): Promise<bigint> {
    if (!tSenderAddress) {
      alert("tSender contract not found for this chain");
      return BigInt(0);
    }
    if (!tokenAddress) {
      alert("Please enter a valid token address");
      return BigInt(0);
    }

    try {
      console.log("Checking allowance for:");
      console.log("Token address:", tokenAddress);
      console.log("Owner:", account.address);
      console.log("Spender:", tSenderAddress);
      // read from the chain to see if we have approved enough tokens
      const response = await readContract(config, {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "allowance",
        args: [account.address, tSenderAddress],
      });

      console.log("Allowance response:", response);
      return response as bigint;
    } catch (error) {
      console.error("Error getting approved amount:", error);
      alert("Invalid token address or contract doesn't exist");
      return BigInt(0);
    }
  }

  async function handleSubmit() {
    if (!tokenAddress || !recipients || !amounts) {
      alert("Please fill in all fields");
      return;
    }

    try {
      // Debug the addresses to make sure we're using the right ones
      console.log("Token address:", tokenAddress);
      console.log("Chain ID:", chainId);

      const tSenderAddress = chainsToTSender[chainId]?.tsender;
      if (!tSenderAddress) {
        alert("TSender contract not configured for this network");
        return;
      }
      console.log("TSender address:", tSenderAddress);

      // Make sure we're using the token address for ERC20 operations
      // and TSender address as the spender
      const approvedAmount = await getApprovedAmount(tSenderAddress);
      const totalAmountBigInt = BigInt(totalAmount);

      console.log("approvedAmount", approvedAmount.toString());
      console.log("totalAmount", totalAmountBigInt.toString());

      if (approvedAmount < totalAmountBigInt) {
        console.log(
          "Approving tokens:",
          tokenAddress, // ERC20 token address - the target of the approve call
          tSenderAddress, // TSender address - the spender being approved
          totalAmountBigInt.toString() // Amount to approve
        );

        const approvalHash = await writeContractAsync({
          abi: erc20Abi,
          address: tokenAddress as `0x${string}`,
          functionName: "approve",
          args: [tSenderAddress, totalAmountBigInt],
        });
        const approvalReceipt = await waitForTransactionReceipt(config, {
          hash: approvalHash,
        });
        console.log("Approval confirmed: ", approvalReceipt);
      }

      // Now call the TSender contract to perform the airdrop
      console.log("Calling airdropERC20 on TSender:", tSenderAddress);
      console.log("With token:", tokenAddress);

      const recipientAddresses = recipients
        .split(/[,\n]+/)
        .map((addr) => addr.trim())
        .filter((addr) => addr !== "");

      const amountValues = amounts
        .split(/[,\n]+/)
        .map((amt) => amt.trim())
        .filter((amt) => amt !== "");

      console.log("Recipients:", recipientAddresses);
      console.log(
        "Amounts:",
        amountValues.map((a) => a.toString())
      );

      await writeContractAsync({
        abi: tsenderAbi,
        address: tSenderAddress as `0x${string}`, // TSender address
        functionName: "airdropERC20",
        args: [
          tokenAddress, // Token address
          recipientAddresses,
          amountValues,
          totalAmountBigInt,
        ],
      });
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. Please check the console for details.");
    }
  }
  return {
    state: {
      tokenAddress,
      recipients,
      amounts,
      totalAmount,
      isPending,
    },
    actions: {
      setTokenAddress,
      setRecipients,
      setAmounts,
      handleSubmit,
    },
  };
};

export default useAirdropFrom;
