import React from 'react';
import { AmortizationEntry } from '../types/loan';
import './AmortizationTable.css';

interface AmortizationTableProps {
  schedule: AmortizationEntry[];
  termEndDate?: Date;
}

export const AmortizationTable: React.FC<AmortizationTableProps> = ({ schedule, termEndDate }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    const utcDate = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    ));
    
    return utcDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  return (
    <div className="table-container">
      {termEndDate && (
        <div className="term-info">
          <strong>Term Start Date:</strong> {formatDate(schedule[0].date)}
          <br />
          <strong>Term End Date:</strong> {formatDate(termEndDate)}
        </div>
      )}
      <table className="amortization-table">
        <thead>
          <tr>
            <th>Period</th>
            <th>Date</th>
            <th>Starting Balance</th>
            <th>Principal Payment</th>
            <th>Interest Payment</th>
            <th>Total Payment</th>
            <th>Ending Balance</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((entry, index) => (
            <tr key={index}>
              <td>{index}</td>
              <td>{formatDate(entry.date)}</td>
              <td>{formatCurrency(entry.startingBalance)}</td>
              <td>{formatCurrency(entry.principalPayment)}</td>
              <td>{formatCurrency(entry.interestPayment)}</td>
              <td>{formatCurrency(entry.totalPayment)}</td>
              <td>{formatCurrency(entry.endingBalance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 