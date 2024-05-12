import {
  Box,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { Financing, FinancingStatus } from "../../types/financing";

import ApproveFinancingButton from "./ApproveFinancingButton";
import RejectFinancingButton from "./RejectFinancingButton";

interface Prop {
  address: `0x${string}`;
  financings: Financing[];
}

export default function LenderPool({ address, financings }: Prop) {
  return (
    <Box mt={5}>
      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th isNumeric>Property ID</Th>
              <Th isNumeric>Loaner</Th>
              <Th isNumeric>Loan ID</Th>
              <Th isNumeric>Loan Amount</Th>
              <Th>Status</Th>
              <Th isNumeric>Duration (Months)</Th>
              <Th isNumeric>Paid Months</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {financings.map((financing) => (
              <Tr key={financing.financingId}>
                <Td isNumeric>{financing.propertyId}</Td>
                <Td isNumeric>{financing.loaner}</Td>
                <Td isNumeric>{financing.loanId}</Td>
                <Td isNumeric>{financing.loanAmount}</Td>
                <Td isNumeric>{financing.status}</Td>
                <Td isNumeric>{financing.durationInMonths}</Td>
                <Td isNumeric>{financing.paidMonths}</Td>
                <Td>
                  <ApproveFinancingButton
                    mr={2}
                    address={address}
                    isAccepted={financing.status === FinancingStatus.Active}
                    financingId={financing.financingId}
                    loanAmount={financing.loanAmount}
                  />
                  <RejectFinancingButton
                    address={address}
                    isAccepted={financing.status === FinancingStatus.Active}
                    financingId={financing.financingId}
                    loanAmount={financing.loanAmount}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
