import React from 'react';
import classes from './Button.module.scss';

const Button = (props) => {
  return (
    <button className={`${classes.button} ${props.className} ${props.cancel && classes.cancel}`} type={props.type || 'button'} onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export default Button;
