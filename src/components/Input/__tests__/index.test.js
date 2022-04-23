import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useForm } from 'react-hook-form';
import Input from '../index';

function TestComponent() {
  const { register } = useForm();

  return (
    <Input register={register} data-testid="input" name="name" placeholder="Your name" />
  );
}

describe('Input Component', () => {
  it('should defined', () => {
    expect(Input).toBeDefined();
  });

  it('should render in document', () => {
    render(
      <TestComponent />,
    );

    const input = screen.getByTestId('input');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', 'name');
    expect(input).toHaveAttribute('placeholder', 'Your name');

    fireEvent.change(input, { target: { value: 'test' } });

    expect(input).toHaveValue('test');
  });

  it('should show error', () => {
    render(
      <Input data-testid="input" isError />,
    );

    const input = screen.getByTestId('input');
    expect(input).toHaveClass('border border-red-500');
  });
});
