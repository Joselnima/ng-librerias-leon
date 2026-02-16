import { render } from '@testing-library/react';

import LeonLibreriasTheme from './theme';

describe('LeonLibreriasTheme', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LeonLibreriasTheme />);
    expect(baseElement).toBeTruthy();
  });
});
