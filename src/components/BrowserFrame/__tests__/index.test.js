import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import BrowserFrame from '../index';

describe('Browser Frame Component', () => {
  it('should defined', () => {
    expect(BrowserFrame).toBeDefined();
  });

  it('should render children', () => {
    render(
      <BrowserFrame>
        <span>Children Component</span>
      </BrowserFrame>,
    );

    const children = screen.getByText('Children Component');

    expect(children).toBeInTheDocument();
  });

  it('should render a url title', () => {
    render(<BrowserFrame url="https://google.com" />);

    const url = screen.getByText('https://google.com');
    expect(url).toBeInTheDocument();
  });
});
