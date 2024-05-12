import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Container,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";

import NftCard from "../components/property/NftCard";
import NftCollection from "../components/property/NftCollection";

import { useGetAllPropertiesByOwner } from "../hooks/marketplace/useProperty";

import { Nft } from "../types/listing";
import { CHAIN_ID } from "../types/constant";
import { useGetAllLoansByOwner } from "../hooks/financing/useLoan";
import { Financing, FinancingResult, FinancingStatus, Loan } from "../types/financing";
import LoanPool from "../components/financing/LoanPool";
import LenderPool from "../components/financing/LenderPool";
import contractAddress from "../contracts/contract-address.json";
import financingArtifact from "../contracts/FinancingContract.json";
import { ethers } from "ethers";

export default function Profile() {
  const [nfts, setNfts] = useState<Nft[] | undefined>([]);
  const [loans, setLoans] = useState<Loan[] | undefined>([]);
  const [financings, setFinancings] = useState<Financing[] | undefined>([]);
  const { address, chain, isConnected } = useAccount();
  const { isFetched, data } = useGetAllPropertiesByOwner(address);
  const { isFetched: isLoansFetched, data: loansData } =
    useGetAllLoansByOwner(address);
  const { data: financingsData, isFetched: isFinancingsFetched } =
    useReadContract({
      address: contractAddress.FinancingContractProxy as `0x${string}`,
      account: address,
      abi: financingArtifact.abi,
      functionName: "lenderGetFinancings",
      args: [],
    });

  useEffect(() => {
    if (isConnected && isFetched) {
      console.log("nfts");
      setNfts(data);
    }
  }, [isConnected, isFetched, data]);

  useEffect(() => {
    if (isConnected && isLoansFetched) {
      console.log("loans");
      setLoans(loansData);
    }
  }, [isConnected, isLoansFetched, loansData]);

  useEffect(() => {
    if (isConnected && isFinancingsFetched) {
      console.log(financingsData);
      setFinancings(financingsData.map((financing) => ({
        financingId: Number(financing.financingId),
        propertyId: Number(financing.propertyId),
        loaner: financing.loaner,
        loanId: Number(financing.loanId),
        loanAmount: parseFloat(ethers.formatEther(financing.loanAmount)),
        status: FinancingStatus[Number(financing.status)],
        durationInMonths: Number(financing.durationInMonths),
        paidMonths: Number(financing.paidMonths),
      
      })));
    }
  }, [isConnected, isFinancingsFetched, financingsData]);

  // Wallet not connected
  if (!isConnected || !address) {
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

  // NFTs are loading
  if (
    !isFetched ||
    !isLoansFetched ||
    !isFinancingsFetched ||
    !nfts ||
    !loans ||
    !financings
  ) {
    return (
      <main>
        <Container
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="90vh"
          maxWidth="container.lg"
        >
          <Spinner size="xl" color="green" />
        </Container>
      </main>
    );
  }

  // NFTs are loaded
  return (
    <main>
      <Container maxWidth="container.lg">
        <Heading as="h1" size="xl" mt={8}>
          Properties Owned{" "}
          <Badge
            borderRadius="full"
            fontSize="x-large"
            px="2"
            colorScheme="green"
          >
            {nfts?.length}
          </Badge>
        </Heading>

        <NftCollection>
          {nfts?.map((nft, i) => {
            return (
              <NftCard
                key={i}
                propertyId={nft.property.propertyId}
                beds={nft.pinataContent.bedrooms}
                baths={nft.pinataContent.bathrooms}
                streetAddress={nft.pinataContent.streetAddress}
                price={nft.property.price.toFixed(2).toString()}
                imageUrl={
                  nft.pinataContent.images[0]
                    ? `${import.meta.env.VITE_PINATA_GATEWAY}/ipfs/${
                        nft.pinataContent.images[0]
                      }`
                    : ""
                }
              />
            );
          })}
        </NftCollection>
      </Container>

      <Container maxWidth="container.lg">
        <Heading as="h1" size="xl" mt={8}>
          Loans Listed{" "}
          <Badge
            borderRadius="full"
            fontSize="x-large"
            px="2"
            colorScheme="green"
          >
            {loans?.length}
          </Badge>
        </Heading>

        <LoanPool address={address} loans={loans} />
      </Container>

      <Container maxWidth="container.lg">
        <Heading as="h1" size="xl" mt={8}>
          Financings Owned{" "}
          <Badge
            borderRadius="full"
            fontSize="x-large"
            px="2"
            colorScheme="green"
          >
            {financings?.length}
          </Badge>
        </Heading>

        <LenderPool address={address} financings={financings} />
      </Container>
    </main>
  );
}
