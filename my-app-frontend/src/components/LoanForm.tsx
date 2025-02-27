import React, { useState } from 'react';
import { LoanInputs } from '../types/loan';
import './LoanForm.css';

interface LoanFormProps {
  onSubmit: (inputs: LoanInputs) => void;
  isLoading: boolean;
}

export const LoanForm: React.FC<LoanFormProps> = ({ onSubmit, isLoading }) => {
  const [inputs, setInputs] = useState<LoanInputs>({
    principalAmount: 0,
    amortizationMonths: 0,
    termMonths: 0,
    marginRate: 0,
    startDate: new Date(),
    interestDays: 360
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'date') {
      try {
        const dateValue = value ? new Date(value) : new Date();
        if (!isNaN(dateValue.getTime())) {
          setInputs(prev => ({
            ...prev,
            [name]: dateValue
          }));
        }
      } catch (err) {
        console.log('Invalid date:', value);
      }
    } else {
      setInputs(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    }
  };

  const formatDateForInput = (date: Date) => {
    try {
      return date.toISOString().split('T')[0];
    } catch (err) {
      return new Date().toISOString().split('T')[0];
    }
  };

  return (
    <form onSubmit={handleSubmit} className="loan-form">
      <h2>Loan Details</h2>
      
      <div className="form-group">
        <label htmlFor="principalAmount">Principal Amount ($)</label>
        <div className="input-wrapper">
          <span className="currency-symbol">$</span>
          <input
            type="number"
            id="principalAmount"
            name="principalAmount"
            value={inputs.principalAmount || ''}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="Enter loan amount"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="amortizationMonths">Amortization Period (months)</label>
        <input
          type="number"
          id="amortizationMonths"
          name="amortizationMonths"
          value={inputs.amortizationMonths || ''}
          onChange={handleChange}
          min="1"
          placeholder="Enter amortization period"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="termMonths">Term Length (months)</label>
        <input
          type="number"
          id="termMonths"
          name="termMonths"
          value={inputs.termMonths || ''}
          onChange={handleChange}
          min="1"
          placeholder="Enter term length"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="marginRate">Margin Above Prime (%)</label>
        <div className="input-wrapper">
          <input
            type="number"
            id="marginRate"
            name="marginRate"
            value={inputs.marginRate || ''}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="Enter margin rate"
            required
          />
          <span className="percentage-symbol">%</span>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="startDate">Start Date</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formatDateForInput(inputs.startDate)}
          onChange={handleChange}
          required
          className="date-input"
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? (
          <span className="loading-spinner">Calculating...</span>
        ) : (
          'Calculate Amortization Schedule'
        )}
      </button>
    </form>
  );
}; 