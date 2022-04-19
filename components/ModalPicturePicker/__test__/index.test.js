import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import ModalPicturePicker from '../index';

describe('Modal Pciture Picker Component', () => {
  it('should defined', () => {
    expect(ModalPicturePicker).toBeDefined();
  });
});
