import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import ModalPublishResume from '../index';

describe('Modal Publish Resume Component', () => {
  it('should defined', () => {
    expect(ModalPublishResume).toBeDefined();
  });
});
