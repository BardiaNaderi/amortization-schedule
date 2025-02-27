import { Request, Response } from 'express';
import { LoanService } from '../services/loanService';
import { LoanInputs } from '../types/loan';

export class LoanController {
  constructor(private loanService: LoanService) {}

  async calculateAmortization(req: Request, res: Response): Promise<void> {
    try {
      const startDate = new Date(req.body.startDate);
      startDate.setUTCHours(0, 0, 0, 0);

      const inputs: LoanInputs = {
        ...req.body,
        startDate
      };
      
      const validationErrors = this.loanService.validateLoanInputs(inputs);

      if (validationErrors.length > 0) {
        res.status(400).json({ errors: validationErrors });
        return;
      }

      const result = await this.loanService.generateAmortizationSchedule(inputs);
      res.json(result);
    } catch (error) {
      console.error('Error calculating amortization:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 