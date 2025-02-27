import React, { useState } from 'react';
import { LoanForm } from './components/LoanForm';
import { AmortizationTable } from './components/AmortizationTable';
import { LoanInputs, AmortizationEntry, LoanValidationError } from './types/loan';
import './App.css';

function App() {
  const [schedule, setSchedule] = useState<AmortizationEntry[]>([]);
  const [termEndDate, setTermEndDate] = useState<Date | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (inputs: LoanInputs) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/loan/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...inputs,
          startDate: inputs.startDate.toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          const errors = errorData.errors as LoanValidationError[];
          throw new Error(errors.map(e => e.message).join(', '));
        }
        throw new Error('Failed to calculate loan schedule');
      }

      const data = await response.json();
      console.log('Response data:', data);

      setSchedule(data.schedule.map((entry: any) => ({
        ...entry,
        date: new Date(entry.date)
      })));
      
      if (data.termEndDate) {
        const endDate = new Date(data.termEndDate);
        console.log('Term end date:', endDate);
        setTermEndDate(endDate);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Loan Amortization Calculator</h1>
      </header>
      <main>
        <LoanForm onSubmit={handleSubmit} isLoading={isLoading} />
        {error && <div className="error-message">{error}</div>}
        {schedule.length > 0 && <AmortizationTable schedule={schedule} termEndDate={termEndDate} />}
      </main>
    </div>
  );
}

export default App;
