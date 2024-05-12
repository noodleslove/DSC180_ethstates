import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Loan } from "../../types/financing";
import { useWriteContract } from "wagmi";

import contractAddress from "../../contracts/contract-address.json";
import financingArtifact from "../../contracts/FinancingContract.json";

interface Props {
  address: `0x${string}` | undefined;
  loans: Loan[];
  refetch: () => void;
}

export default function LoanPool({ loans, refetch }: Props) {
  const toast = useToast();
  const { writeContract, status } = useWriteContract();

  useEffect(() => {
    if (status === "success") {
      toast({
        title: "Loan Removed",
        description: "Loan has been removed",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      refetch();
    }

    if (status === "pending") {
      toast({
        title: "Removing Loan",
        description: "Loan is being removed",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }

    if (status === "error") {
      toast({
        title: "Error",
        description: "Error removing loan",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [status]);

  return (
    <Box mt={5}>
      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th isNumeric>Loan ID</Th>
              <Th isNumeric>Annual Interest Rate</Th>
              <Th isNumeric>Max Duration (Months)</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loans.map((loan) => (
              <Tr key={loan.loanId}>
                <Td isNumeric>{loan.loanId}</Td>
                <Td isNumeric>{loan.annualInterestRate}%</Td>
                <Td isNumeric>{loan.maxDurationInMonths}</Td>
                <Td>
                  <Button
                    colorScheme="red"
                    size="xs"
                    onClick={() =>
                      writeContract({
                        address:
                          contractAddress.FinancingContractProxy as `0x${string}`,
                        abi: financingArtifact.abi,
                        functionName: "removeLoan",
                        args: [loan.loanId],
                      })
                    }
                  >
                    Remove
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
