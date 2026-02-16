import { render } from '@testing-library/react';

import LeonLibreriasShared from './shared';

describe('LeonLibreriasShared', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LeonLibreriasShared />);
    expect(baseElement).toBeTruthy();
  });
});
