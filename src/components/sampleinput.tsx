import React from 'react';

interface InputFieldProps {
  label: string;
  placeholder: string;
  type?: string;
  className?: string;
  wrapperClass?: string;
  borderColor?: string;
  required?: boolean;
  name?: string;
  onChange?:(e:React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  required,
  onChange,
  type = 'text',
 // borderColor = '#E2E2E2',
  wrapperClass = '',
  className = '',
  name,
  ...props
}) => (
  <div className={`input-section input-section__input-group  ${wrapperClass}`}>
    <label className="input-section__label">
      {label}
      {required && '*'}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className={`input-section__input ${className}`}
      onChange={onChange}
      {...props}
    />
  </div>
);

export default InputField;
