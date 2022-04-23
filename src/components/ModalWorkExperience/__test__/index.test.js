import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import ModalWorkExperience from '../index';

function MockModal({ data = null }) {
  return (
    <ModalWorkExperience
      open
      toggle={() => ''}
      data={data}
      onSubmit={() => ''}
      onRemove={() => ''}
    />
  );
}

describe('Modal Work Experience Component', () => {
  it('should defined', () => {
    expect(ModalWorkExperience).toBeDefined();
  });

  it('should all form is empty', () => {
    render(<MockModal />);

    const company = screen.getByTestId('company');
    const jobTitle = screen.getByTestId('jobTitle');
    const jobDescription = screen.getByTestId('jobDescription');
    const startDate = screen.getByTestId('startDate');
    const endDate = screen.getByTestId('endDate');

    expect(company).toHaveValue('');
    expect(jobTitle).toHaveValue('');
    expect(jobDescription).toHaveValue('');
    expect(startDate).toHaveValue('');
    expect(endDate).toHaveValue('');
  });

  it('should all form is filled', () => {
    const data = {
      company: 'Google',
      jobTitle: 'Software Engineer',
      jobDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      startDate: '2020-01-01',
      endDate: 'Present',
    };
    render(<MockModal data={data} />);

    const company = screen.getByTestId('company');
    const jobTitle = screen.getByTestId('jobTitle');
    const jobDescription = screen.getByTestId('jobDescription');
    const startDate = screen.getByTestId('startDate');
    const endDate = screen.getByTestId('endDate');

    expect(company).toHaveValue(data.company);
    expect(jobTitle).toHaveValue(data.jobTitle);
    expect(jobDescription).toHaveValue(data.jobDescription);
    expect(startDate).toHaveValue(data.startDate);
    expect(endDate).toHaveValue(data.endDate);
  });

  it('should end date be present', () => {
    render(<MockModal />);

    const checkboxPresent = screen.getByTestId('checkbox-present');
    const endDate = screen.getByTestId('endDate');

    fireEvent.click(checkboxPresent);

    expect(endDate).toHaveValue('Present');
  });
});
