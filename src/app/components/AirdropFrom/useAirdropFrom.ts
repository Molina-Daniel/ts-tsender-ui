import { useEffect, useMemo, useState } from "react";
import {
  useChainId,
  useConfig,
  useAccount,
  useWriteContract,
  useReadContracts,
} from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants";
import { calculateTotal } from "@/utils";

const useAirdropFrom = () => {
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [recipients, setRecipients] = useState<string>("");
  const [amounts, setAmounts] = useState<string>("");

  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();
  const { data } = useReadContracts({
    contracts: [
      {
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "name",
      },
      {
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [account.address],
      },
    ],
  });

  const tokenName = data && (data[0].result as string);
  const tokenDecimals = data && (data[1].result as number);
  const tokenBalance = data && (data[2].result as bigint);

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

  useEffect(() => {
    if (tokenAddress) {
      localStorage.setItem("tokenAddress", tokenAddress);
    }
  }, [tokenAddress]);

  useEffect(() => {
    if (recipients) {
      localStorage.setItem("recipients", recipients);
    }
  }, [recipients]);

  useEffect(() => {
    if (amounts) {
      localStorage.setItem("amounts", amounts);
    }
  }, [amounts]);

  useEffect(() => {
    const savedTokenAddress = localStorage.getItem("tokenAddress");
    const savedRecipients = localStorage.getItem("recipients");
    const savedAmounts = localStorage.getItem("amounts");

    if (savedTokenAddress) setTokenAddress(savedTokenAddress);
    if (savedRecipients) setRecipients(savedRecipients);
    if (savedAmounts) setAmounts(savedAmounts);
  }, []);

  return {
    state: {
      tokenAddress,
      recipients,
      amounts,
      totalAmount,
      isPending,
      tokenName,
      tokenDecimals,
      tokenBalance,
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
