import '@testing-library/jest-dom';
jest.mock('jspdf');
import { render, screen } from '@testing-library/react';
import App from '../App.jsx';

test('zeigt Punkte an', () => {
  render(<App />);
  const punktElement = screen.getByTestId('punkte');
  expect(punktElement).toBeInTheDocument();
  expect(punktElement).toHaveTextContent(/Punkte/i);
});
