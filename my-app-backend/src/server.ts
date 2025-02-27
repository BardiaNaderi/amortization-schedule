import express from 'express';
import dotenv from 'dotenv';
import { LoanService } from './services/loanService';
import { FederalReserveService } from './services/federalReserveService';
import { LoanController } from './controllers/loanController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

const federalReserveService = new FederalReserveService();
const loanService = new LoanService(federalReserveService);
const loanController = new LoanController(loanService);

app.post('/api/loan/calculate', (req, res) => loanController.calculateAmortization(req, res));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
