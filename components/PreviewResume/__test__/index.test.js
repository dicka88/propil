import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import PreviewResume from '../index';

function MockPreviewResume() {
  return (
    <PreviewResume
      picture="https://i.pravatar.cc/300"
      name="John Doe"
      age={25}
      intro="Intro lorem ipsum sit dolor amet"
      jobTitle="Software Engineer"
      links={[
        { label: 'Facebook', url: 'https://facebook.com/johndoe' },
        { label: 'Github', url: 'https://github.com/johndoe' },
        { label: 'Instagram', url: 'https://instagram.com/johndoe' },
      ]}
      workExperiences={[
        {
          company: 'Google',
          companyLogo: 'https://i.pravatar.cc/300',
          jobTitle: 'Frontend Engineer',
          startDate: '2019-01-01',
          endDate: '2020-01-01',
          jobDescription: 'Lorem ipsum sit dolor amet',
        },
      ]}
    />
  );
}

describe('Preview Resume Component', () => {
  it('should defined', () => {
    expect(PreviewResume).toBeDefined();
  });

  it('should render properly', () => {
    render(
      <MockPreviewResume />,
    );

    const name = screen.getByText('John Doe');
    const age = screen.getByText('25 years old');
    const intro = screen.getByText('Intro lorem ipsum sit dolor amet');
    const jobTitle = screen.getByText('Software Engineer');
    const links = screen.getAllByTestId('links');
    const workExperiences = screen.getAllByTestId('workExperiences');

    expect(name).toBeInTheDocument();
    expect(age).toBeInTheDocument();
    expect(intro).toBeInTheDocument();
    expect(jobTitle).toBeInTheDocument();

    expect(links).toHaveLength(3);
    expect(links[0]).toHaveTextContent('Facebook');
    expect(links[0]).toHaveAttribute('href', 'https://facebook.com/johndoe');

    expect(workExperiences).toHaveLength(1);
  });
});
