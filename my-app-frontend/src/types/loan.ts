export interface LoanInputs {
  principalAmount: number;
  amortizationMonths: number;
  termMonths: number;
  marginRate: number;
  startDate: Date;
  interestDays: number;
}

export interface AmortizationEntry {
  date: Date;
  startingBalance: number;
  interestPayment: number;
  principalPayment: number;
  endingBalance: number;
  daysInPeriod: number;
  totalPayment: number;
}

export interface LoanValidationError {
  field: keyof LoanInputs;
  message: string;
} 