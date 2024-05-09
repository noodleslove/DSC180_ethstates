import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

import NftCard from "../components/property/NftCard";
import NftCollection from "../components/property/NftCollection";

import { useGetAllPropertiesByOwner } from "../hooks/marketplace/useProperty";

import { Nft } from "../types/listing";
import { CHAIN_ID } from "../types/constant";
import { useGetAllLoansByOwner } from "../hooks/financing/useLoan";
import { Loan } from "../types/financing";

export default function Profile() {
  const [nfts, setNfts] = useState<Nft[] | undefined>([]);
  const [loans, setLoans] = useState<Loan[] | undefined>([]);
  const { address, chain, isConnected } = useAccount();
  const { isFetched, data } = useGetAllPropertiesByOwner(address);
  const { isFetched: isLoansFetched, data: loansData } =
    useGetAllLoansByOwner(address);

  useEffect(() => {
    if (isConnected && isFetched) {
      console.log("data", data);
      setNfts(data);
    }
  }, [isConnected, isFetched]);

  useEffect(() => {
    if (isConnected && isLoansFetched) {
      console.log("loans", loans);
      setLoans(loansData);
    }
  }, [isConnected, isLoansFetched]);

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

  // NFTs are loading
  if (!isFetched) {
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

        <SimpleGrid
          mt={8}
          spacing={8}
          columns={{ base: 1, md: 2, lg: 3 }}
        >
          {loans?.map((loan: Loan) => (
            <Card key={loan.loanId}>
              <CardHeader>
                <Heading size="md">Loan {loan.loanId}</Heading>
              </CardHeader>
              <CardBody>
                <Text>Annual Interest Rate: {loan.annualInterestRate}%</Text>
                <Text>Max Duration (months): {loan.maxDurationInMonths}</Text>
              </CardBody>
              <CardFooter>
                <Button>View here</Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </main>
  );
}
