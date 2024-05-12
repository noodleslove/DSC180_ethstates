export interface LoanResult {
  0: `0x${string}`; // lender
  1: bigint; // annualInterestRate
  2: bigint; // maxDurationInMonths
  3: bigint; // loanId
}

export enum LoanResultIndex {
  LENDER,
  ANNUAL_INTEREST_RATE,
  MAX_DURATION_IN_MONTHS,
  LOANID,
}

export interface Loan {
  lender: `0x${string}`;
  annualInterestRate: number;
  maxDurationInMonths: number;
  loanId: number;
}

export enum FinancingStatus {
  None,
  Pending,
  Rejected,
  Active,
  Default,
  PaidOff,
}

export interface FinancingResult {
  0: bigint; // financingId
  1: bigint; // propertyId
  2: string; // loaner
  3: bigint; // loanId
  4: FinancingStatus; // status
  5: bigint; // loanAmount
  6: bigint; // durationInMonths
  7: bigint; // paidMonths
}

export enum FinancingResultIndex {
  FINANCING_ID,
  PROPERTY_ID,
  LOANER,
  LOAN_ID,
  STATUS,
  LOAN_AMOUNT,
  DURATION_IN_MONTHS,
  PAID_MONTHS,
}

export interface Financing {
  financingId: number;
  propertyId: number;
  loaner: string;
  loanId: number;
  status: FinancingStatus;
  loanAmount: number;
  durationInMonths: number;
  paidMonths: number;
}

export interface FinancingProps {
  address: `0x${string}`;
  financingId: number;
  propertyId: number;
  loaner?: string;
  loanId: number;
  status?: FinancingStatus;
  loanAmount: number;
  durationInMonths: number;
  paidMonths?: number;
}
