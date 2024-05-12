import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getFinancingContract } from "../../queries/dapp";
import { Loan, LoanResult, LoanResultIndex } from "../../types/financing";

export function useGetLoans(address: `0x${string}` | undefined) {
  address = address || import.meta.env.VITE_MARKETPLACE_DEFAULT_ADDRESS;
  return useQuery({
    queryKey: ["dapp", "getLoans", address],
    queryFn: async (): Promise<Loan[]> => {
      if (address === undefined) return Promise.resolve([]);
      const financing = await getFinancingContract(address);
      const loans: LoanResult[] = await financing.getAllLoans();
      return Promise.resolve(
        loans.map((loan: LoanResult): Loan => {
          return {
            loanId: Number(loan[LoanResultIndex.LOANID]),
            lender: loan[LoanResultIndex.LENDER],
            annualInterestRate: Number(
              loan[LoanResultIndex.ANNUAL_INTEREST_RATE]
            ),
            maxDurationInMonths: Number(
              loan[LoanResultIndex.MAX_DURATION_IN_MONTHS]
            ),
          };
        })
      );
    },
  });
}

export function useGetAllLoansByOwner(
  address: `0x${string}` | undefined
): UseQueryResult<Loan[], Error> {
  address = address || import.meta.env.VITE_MARKETPLACE_DEFAULT_ADDRESS;
  return useQuery({
    queryKey: ["dapp", "getLoans", address],
    queryFn: async (): Promise<Loan[]> => {
      if (address === undefined) return Promise.resolve([]);
      const financing = await getFinancingContract(address);
      const loans: LoanResult[] = await financing.getAllLoans();
      return Promise.resolve(
        loans
          .filter(
            (loan: LoanResult): boolean =>
              loan[LoanResultIndex.LENDER] === address
          )
          .map((loan: LoanResult): Loan => {
            return {
              lender: loan[LoanResultIndex.LENDER],
              annualInterestRate: Number(
                loan[LoanResultIndex.ANNUAL_INTEREST_RATE]
              ) / 100,
              maxDurationInMonths: Number(
                loan[LoanResultIndex.MAX_DURATION_IN_MONTHS]
              ),
              loanId: Number(loan[LoanResultIndex.LOANID]),
            };
          })
      );
    },
  });
}
