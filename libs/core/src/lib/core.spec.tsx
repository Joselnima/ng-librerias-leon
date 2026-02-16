import { render } from '@testing-library/react';

import LeonLibreriasCore from './core';

describe('LeonLibreriasCore', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LeonLibreriasCore />);
    expect(baseElement).toBeTruthy();
  });
});
