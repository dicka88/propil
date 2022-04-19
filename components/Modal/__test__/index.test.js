import React, { useState } from 'react';
import {
  render, screen, fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import Modal from '../index';

function MockModal() {
  const [open, setOpen] = useState(true);
  const toggle = () => setOpen(!open);

  return (
    <Modal title="Mock Modal" open={open} toggle={toggle}>
      Mock Modal
    </Modal>
  );
}

describe('Modal Component', () => {
  it('should defined', () => {
    expect(Modal).toBeDefined();
  });

  it('should render correctly', () => {
    render(
      <Modal open title="Alert Modal" toggle={() => ''}>
        <span>Warning, modal is open</span>
      </Modal>,
    );

    expect(screen.getByText('Alert Modal')).toBeInTheDocument();
    expect(screen.getByText('Warning, modal is open')).toBeInTheDocument();
  });

  it('should visible', () => {
    render(
      <Modal open title="Alert Modal" toggle={() => ''}>
        Testing
      </Modal>,
    );

    const modal = screen.getByTestId('modal');
    expect(modal).toHaveClass('!visible');
  });

  it('should invisible', () => {
    render(
      <Modal open={false} title="Alert Modal" toggle={() => ''}>
        testing
      </Modal>,
    );

    const modal = screen.getByTestId('modal');
    expect(modal).not.toHaveClass('visible');
  });

  it('should invisible when press toggle', () => {
    render(<MockModal />);

    const modal = screen.getByTestId('modal');
    const closeButton = screen.getByTestId('close_button');

    expect(modal).toHaveClass('!visible');

    fireEvent.click(closeButton);

    expect(modal).not.toHaveClass('!visible');
  });
});
