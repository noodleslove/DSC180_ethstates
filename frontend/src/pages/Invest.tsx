import {
  Container,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  FormControl,
  FormLabel,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import React, { useEffect, useState } from "react";
import contractAddress from "../contracts/contract-address.json";
import financingArtifact from "../contracts/FinancingContract.json";
import { CHAIN_ID } from "../types/constant";
import { useGetLoans } from "../hooks/financing/useLoan";

export default function Invest() {
  const toast = useToast();
  const { address, chain, isConnected } = useAccount();
  const {
    data: loans,
    isFetched,
    refetch,
  } = useGetLoans(contractAddress.FinancingContractProxy as `0x${string}`);
  const { data: hash, writeContract, status } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  const [rate, setRate] = useState<number>(5);
  const [durationMonth, setDurationMonth] = useState<number>(12);

  useEffect(() => {
    if (isFetched && loans) {
      console.log(loans);
    }
  }, [isFetched, loans]);

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Loan Added",
        description: "Loan has been added",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }

    if (isConfirming) {
      toast({
        title: "Adding Loan",
        description: "Loan is being added",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }

    if (status === "pending") {
      toast({
        title: "Adding Loan",
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
    }
  }, [isConfirmed, isConfirming, status]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if (!contains) {
      // Add loan
      writeContract({
        address: contractAddress.FinancingContractProxy as `0x${string}`,
        abi: financingArtifact.abi,
        functionName: "addLoan",
        args: [address, rate * 100, durationMonth],
      });
    // } else {
    //   // Update loan
    //   writeContract({
    //     address: contractAddress.FinancingContractProxy as `0x${string}`,
    //     abi: financingArtifact.abi,
    //     functionName: "setAnnualInterestRate",
    //     args: [address, rate * 100],
    //   });

    //   writeContract({
    //     address: contractAddress.FinancingContractProxy as `0x${string}`,
    //     abi: financingArtifact.abi,
    //     functionName: "setMaxDurationInMonths",
    //     args: [address, durationMonth],
    //   });
    // }

    refetch();
  };

  const parseRate = (valueString: string) => {
    return parseFloat(valueString);
  };

  // Wallet not connected
  if (!isConnected) {
    return (
      <main>
        <Container
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="80vh"
          maxWidth="container.sm"
        >
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
          >
            <AlertIcon boxSize={10} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Wallet not found
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              Please connect to your web3 wallet to continue.
            </AlertDescription>
          </Alert>
        </Container>
      </main>
    );
  }

  // Wrong network
  if (isConnected && chain?.id !== CHAIN_ID) {
    return (
      <main>
        <Container
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="80vh"
          maxWidth="container.sm"
        >
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
          >
            <AlertIcon boxSize={10} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Wrong network
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              Please connect to Polygon Amony Testnet to continue.
            </AlertDescription>
          </Alert>
        </Container>
      </main>
    );
  }

  return (
    <main>
      <Container maxWidth={"container.md"}>
        <form onSubmit={handleSubmit}>
          <FormControl id="rate" isRequired mt={3}>
            <FormLabel>Annual interest rate</FormLabel>
            <InputGroup>
              <NumberInput
                onChange={(valueString) => setRate(parseRate(valueString) || 0)}
                value={rate}
                min={0}
                max={100}
              >
                <NumberInputField />
                <InputRightElement
                  pointerEvents="none"
                  color="gray.300"
                  fontSize="1.2em"
                >
                  %
                </InputRightElement>
              </NumberInput>
            </InputGroup>
          </FormControl>

          <FormControl id="duration" isRequired mt={3}>
            <FormLabel>Max Duration in Month</FormLabel>
            <NumberInput
              defaultValue={12}
              precision={0}
              max={360}
              min={12}
              onChange={(value) => setDurationMonth(parseInt(value))}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <Button my={4} colorScheme="teal" type="submit">
            Submit
          </Button>
        </form>
      </Container>
    </main>
  );
}
