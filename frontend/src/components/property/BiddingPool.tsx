import { Nft } from "../../types/listing";
import {
  Box,
  Badge,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { AcceptButton } from "./buttons/AcceptButton";
import { UnbidButton } from "./buttons/UnbidButton";

interface Props {
  address: `0x${string}` | undefined;
  nft: Nft;
}

export default function BiddingPool({ nft, address }: Props) {
  const isOwner = nft.owner === address;
  const isAccepted = nft.listing?.acceptedBid?.bidPrice !== 0;

  if (isOwner) {
    return (
      <Box mt={5}>
        <Text fontSize="2xl" mb={2}>
          Bidding Pool
        </Text>
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Bidder</Th>
                <Th isNumeric>Price</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {nft.listing?.bids?.map((bid, index) => (
                <Tr key={index}>
                  <Td display="flex" alignItems="center">
                    {bid.bidder}
                    {nft.listing?.acceptedBid?.bidder === bid.bidder ? (
                      <Badge variant="solid" colorScheme="green" ml={2}>
                        Accepted Bid
                      </Badge>
                    ) : (
                      <></>
                    )}
                  </Td>
                  <Td isNumeric>{bid.bidPrice}</Td>
                  <Td>
                    <AcceptButton
                      isAccepted={isAccepted}
                      propertyId={nft.property.propertyId}
                      bidder={bid.bidder}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    );
  } else {
    return (
      <Box mt={5}>
        <Text fontSize="2xl" mb={2}>
          Bidding Pool
        </Text>
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Bidder</Th>
                <Th isNumeric>Price</Th>
              </Tr>
            </Thead>
            <Tbody>
              {nft.listing?.bids?.map((bid, index) => (
                <Tr key={index}>
                  <Td display="flex" alignItems="center">
                    {bid.bidder}
                    {nft.listing?.acceptedBid?.bidder === bid.bidder ? (
                      <Badge variant="solid" colorScheme="green" ml={2}>
                        Accepted Bid
                      </Badge>
                    ) : (
                      <></>
                    )}
                    {address === bid.bidder ? (
                      <Badge variant="solid" colorScheme="blue" ml={2}>
                        You
                      </Badge>
                    ) : (
                      <></>
                    )}
                  </Td>
                  <Td isNumeric>{bid.bidPrice}</Td>
                  <Td>
                    {address === bid.bidder &&
                    nft.listing?.acceptedBid?.bidder !== bid.bidder ? (
                      <UnbidButton propertyId={nft.property.propertyId} />
                    ) : null}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    );
  }
}
