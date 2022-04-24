import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import ModalCustomizeLink from '../index';

function MockModalCustomizeLink() {
  return (
    <ModalCustomizeLink
      open
      toggle={() => ''}
      resumeId="j828379h2189"
      username="test"
      isPublic={false}
      afterSubmit={() => ''}
    />
  );
}

describe('Modal Customize Link Component', () => {
  it('should defined', () => {
    expect(ModalCustomizeLink).toBeDefined();
  });

  it('should render correctly', () => {
    render(<MockModalCustomizeLink />);

    const privateButton = screen.getByText('Private');
    const publicButton = screen.getByText('Public');
    const inputUsername = screen.getByTestId('username');

    expect(privateButton).toHaveClass('text-white bg-red-500');
    expect(publicButton).toHaveClass('text-black bg-gray-200');
    expect(inputUsername).toHaveValue('test');
  });

  it('should toggle visibility button to public and viceverse', () => {
    render(<MockModalCustomizeLink />);

    const privateButton = screen.getByText('Private');
    const publicButton = screen.getByText('Public');

    fireEvent.click(privateButton);
    expect(privateButton).toHaveClass('text-white bg-red-500');
    expect(publicButton).toHaveClass('text-black bg-gray-200');

    fireEvent.click(publicButton);
    expect(privateButton).toHaveClass('text-black bg-gray-200');
    expect(publicButton).toHaveClass('text-white bg-green-500');
  });

  it('should changed on input username', () => {
    render(<MockModalCustomizeLink />);

    const inputUsername = screen.getByTestId('username');

    fireEvent.change(inputUsername, { target: { value: 'test2' } });

    expect(inputUsername).toHaveValue('test2');
  });
});
