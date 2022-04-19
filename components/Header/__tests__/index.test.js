import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Header from '../index';

describe('Header Component', () => {
  it('should defined', () => {
    expect(Header).toBeDefined();
  });

  it('should render in document', () => {
    render(
      <Header />,
    );

    const logo = screen.getByText('Propil');

    expect(logo).toBeInTheDocument();
  });
});
