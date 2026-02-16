import { FieldsetProps } from './interface/fieldset-props.interface';

export const Fieldset: React.FC<FieldsetProps> = ({ title, children, style }: FieldsetProps) => {
  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', ...style }}>
      <legend style={{ fontWeight: 'bold', padding: '0 10px' }}>{title}</legend>
      {children}
    </fieldset>
  );
};

export default Fieldset;