import React, { ReactNode } from 'react';
import './button.scss';

export type ButtonProps = {
    onClick: () => any;
    children: ReactNode;
    loading?: boolean;
};

export const Button = (props: ButtonProps) => (
    <button className="icbs-button" onClick={props.onClick}>
        {props.loading ? 'Loading...' : props.children}
    </button>
);

export default Button;
