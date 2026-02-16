import { render } from '@testing-library/react';

import LeonLibreriasDataView from './data-view';

describe('LeonLibreriasDataView', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LeonLibreriasDataView />);
    expect(baseElement).toBeTruthy();
  });
});
