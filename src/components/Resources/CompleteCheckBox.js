import React, { useState } from 'react';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import classes from './ListResources.module.scss';
import { useMutation } from '@apollo/client';
import { MARK_COMPLETE } from '../../graphql/mutations';
import ErrorIcon from '@material-ui/icons/Error';

const CompleteCheckBox = (props) => {
  const [completed, setIsCompleted] = useState(props.completed);
  const [markComplete, { loading, error }] = useMutation(MARK_COMPLETE);
  if (loading) return '...';
  if (error) return <ErrorIcon color='secondary' />;
  const markCompleteHandler = (event) => {
    event.preventDefault();
    markComplete({ variables: { id: props.id, completed: !completed } }).then((resp, error) => {
      if (resp && resp.data && resp.data.markResourceCompleted) {
        setIsCompleted(!completed);
      }
    }).catch(error => {
        console.log(error)
    });
  };
  return completed ? (
    <CheckBoxIcon className={classes.resourceCard__iconComplete} onClick={markCompleteHandler} />
  ) : (
    <CheckBoxOutlineBlankIcon onClick={markCompleteHandler} className={classes.resourceCard__icon} />
  );
};

export default CompleteCheckBox;
