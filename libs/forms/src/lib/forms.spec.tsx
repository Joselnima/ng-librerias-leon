import { render } from '@testing-library/react';

import LeonLibreriasForms from './forms';

describe('LeonLibreriasForms', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LeonLibreriasForms />);
    expect(baseElement).toBeTruthy();
  });
});
