import { LoanInputs, AmortizationEntry, LoanValidationError, LoanCalculationParams } from '../types/loan';
import { FederalReserveService } from './federalReserveService';
import { LoanServiceResponse } from '../types/loan';

export class LoanService {
  constructor(private federalReserveService: FederalReserveService) {}

  validateLoanInputs(inputs: LoanInputs): LoanValidationError[] {
    const errors: LoanValidationError[] = [];

    if (inputs.principalAmount <= 0) {
      errors.push({
        field: 'principalAmount',
        message: 'Principal amount must be greater than 0'
      });
    }

    if (inputs.amortizationMonths <= 0) {
      errors.push({
        field: 'amortizationMonths',
        message: 'Amortization months must be greater than 0'
      });
    }

    if (inputs.termMonths <= 0 || inputs.termMonths > inputs.amortizationMonths) {
      errors.push({
        field: 'termMonths',
        message: 'Term months must be greater than 0 and less than amortization months'
      });
    }

    if (inputs.marginRate < 0) {
      errors.push({
        field: 'marginRate',
        message: 'Margin rate cannot be negative'
      });
    }

    if (inputs.interestDays !== 360) {
      errors.push({
        field: 'interestDays',
        message: 'Interest days must be 360'
      });
    }

    return errors;
  }

  private calculateParams(
    inputs: LoanInputs,
    primeRate: number
  ): LoanCalculationParams {
    const annualRate = (primeRate + inputs.marginRate) / 100;
    const dailyInterestRate = annualRate / inputs.interestDays;
    const monthlyPrincipalPayment = inputs.principalAmount / inputs.amortizationMonths;
    
    const termEndDate = this.getEndOfMonth(new Date(inputs.startDate));
    termEndDate.setUTCMonth(termEndDate.getUTCMonth() + inputs.termMonths - 1);

    return {
      dailyInterestRate,
      monthlyPrincipalPayment,
      termEndDate
    };
  }

  private getDaysInPeriod(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays + 1;
  }

  private getEndOfMonth(date: Date): Date {
    const endDate = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      0
    ));
    endDate.setUTCHours(0, 0, 0, 0);
    return endDate;
  }

  async generateAmortizationSchedule(inputs: LoanInputs): Promise<LoanServiceResponse> {
    const primeRate = await this.federalReserveService.getPrimeRate();
    const params = this.calculateParams(inputs, primeRate);
    
    const schedule: AmortizationEntry[] = [];
    let balance = inputs.principalAmount;
    
    let currentDate = new Date(inputs.startDate);
    currentDate.setUTCHours(0, 0, 0, 0);

    schedule.push({
      date: new Date(currentDate),
      startingBalance: balance,
      interestPayment: 0,
      principalPayment: 0,
      endingBalance: balance,
      daysInPeriod: 0,
      totalPayment: 0
    });

    for (let month = 1; month <= inputs.termMonths; month++) {
      const startingBalance = balance;
      
      const endDate = this.getEndOfMonth(currentDate);
      const daysInPeriod = this.getDaysInPeriod(currentDate, endDate);
      
      let principalPayment = params.monthlyPrincipalPayment;
      
      const interestPayment = startingBalance * params.dailyInterestRate * daysInPeriod;
      
      balance -= principalPayment;

      schedule.push({
        date: new Date(endDate),
        startingBalance,
        interestPayment,
        principalPayment,
        endingBalance: balance,
        daysInPeriod,
        totalPayment: principalPayment + interestPayment
      });

      currentDate = new Date(Date.UTC(
        endDate.getUTCFullYear(),
        endDate.getUTCMonth() + 1,
        1
      ));
      currentDate.setUTCHours(0, 0, 0, 0);
    }

    if (balance > 0) {
      const startingBalance = balance;
      
      const balloonDate = new Date(inputs.startDate);
      balloonDate.setUTCFullYear(
        balloonDate.getUTCFullYear() + Math.floor(inputs.termMonths / 12),
        balloonDate.getUTCMonth() + (inputs.termMonths % 12),
        balloonDate.getUTCDate()
      );
      balloonDate.setUTCHours(0, 0, 0, 0);
      
      const lastPaymentDate = schedule[schedule.length - 1].date;
      const daysInPeriod = this.getDaysInPeriod(lastPaymentDate, balloonDate);
      
      const interestPayment = startingBalance * params.dailyInterestRate * daysInPeriod;
      
      const principalPayment = balance;
      
      balance = 0;

      schedule.push({
        date: new Date(balloonDate),
        startingBalance,
        interestPayment,
        principalPayment,
        endingBalance: balance,
        daysInPeriod,
        totalPayment: principalPayment + interestPayment
      });
    }

    const totalEntries = inputs.amortizationMonths + 1;
    if (schedule.length < totalEntries) {
      const lastDate = new Date(schedule[schedule.length - 1].date);
      
      for (let i = schedule.length; i < totalEntries; i++) {
        lastDate.setUTCMonth(lastDate.getUTCMonth() + 1);
        
        schedule.push({
          date: new Date(lastDate),
          startingBalance: 0,
          interestPayment: 0,
          principalPayment: 0,
          endingBalance: 0,
          daysInPeriod: 0,
          totalPayment: 0
        });
      }
    }

    return {
      schedule: schedule.map(entry => ({
        ...entry,
        date: entry.date.toISOString()
      })),
      termEndDate: params.termEndDate.toISOString()
    };
  }
} 