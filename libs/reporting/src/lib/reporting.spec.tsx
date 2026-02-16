import { render } from '@testing-library/react';

import LeonLibreriasReporting from './reporting';

describe('LeonLibreriasReporting', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LeonLibreriasReporting />);
    expect(baseElement).toBeTruthy();
  });
});
