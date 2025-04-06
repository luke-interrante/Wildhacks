import React from 'react';
import styled from 'styled-components';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

// Styled components
const CheckboxRoot = styled(Checkbox.Root)`
  background-color: white;
  width: 25px;
  height: 25px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.25);
  padding: 0px;
  
  &:hover {
    background-color: #f5f0ff;
  }
  
  &:focus {
    box-shadow: 0 0 0 2px black;
  }
`;

const CheckboxIndicator = styled(Checkbox.Indicator)`
  color: #6e56cf;
`;

const Label = styled.label`
  color: var(--text-color);
  padding-left: 15px;
  font-size: 15px;
  line-height: 1;
  margin-bottom: 0px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`;

// Checkbox component
const CustomCheckbox = ({ id, checked, onChange, label, ...props }) => {
  return (
    <CheckboxContainer>
      <CheckboxRoot 
        id={id} 
        checked={checked} 
        onCheckedChange={onChange}
        {...props}
      >
        <CheckboxIndicator>
          <CheckIcon />
        </CheckboxIndicator>
      </CheckboxRoot>
      {label && <Label htmlFor={id}>{label}</Label>}
    </CheckboxContainer>
  );
};

export default CustomCheckbox;
