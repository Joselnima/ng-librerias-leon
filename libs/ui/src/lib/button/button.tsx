import React from 'react';
import { BasicButtonProps, ButtonIconProps, FloatingButtonProps } from './interfaces';
import { BasicButton, FloatingButton, ButtonIcon } from './features';

// Nuevo tipo discriminador
export type model = 'basic' | 'floating-action' | 'icon';

type Props =
  | ({ model: 'basic' } & BasicButtonProps)
  | ({ model: 'floating-action' } & FloatingButtonProps)
  | ({ model: 'icon' } & ButtonIconProps);

export const Button: React.FC<Props> = (props) => {
  const { model } = props;

  switch (model) {
    case 'basic':
      return <BasicButton {...(props as BasicButtonProps)} />;
    case 'floating-action':
      return <FloatingButton {...(props as FloatingButtonProps)} />;
    case 'icon':
      return <ButtonIcon {...(props as ButtonIconProps)} />;
    default:
      return null;
  }
};

export default Button;
