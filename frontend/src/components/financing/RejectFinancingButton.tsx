import { Button, useToast } from "@chakra-ui/react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import contractAddress from "../../contracts/contract-address.json";
import financingArtifact from "../../contracts/FinancingContract.json";
import { useEffect } from "react";

interface Props {
  address: `0x${string}`;
  isAccepted: boolean;
  financingId: number;
  loanAmount: number;
}

export default function RejectFinancingButton({
  address,
  isAccepted,
  financingId,
}: Props) {
  const toast = useToast();
  const { data: hash, writeContract, status, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Offer Accepted",
        description: "Offer has been accepted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }

    if (isConfirming) {
      toast({
        title: "Accepting Offer",
        description: "Offer is being accepted",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }

    if (status === "pending") {
      toast({
        title: "Accepting Offer",
        description: "Please confirm on wallet",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }

    if (status === "error") {
      toast({
        title: "Rejected",
        description: "Action rejected",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.log(error);
    }
  }, [isConfirmed, isConfirming, status]);

  console.log(financingId);

  return (
    <Button
      colorScheme="red"
      size="xs"
      isDisabled={isAccepted}
      onClick={() =>
        writeContract({
          address: contractAddress.FinancingContractProxy as `0x${string}`,
          account: address,
          abi: financingArtifact.abi,
          functionName: "rejectFinancing",
          args: [BigInt(financingId)],
        })
      }
    >
      Reject
    </Button>
  );
}
