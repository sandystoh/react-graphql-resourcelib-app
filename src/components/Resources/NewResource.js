import React, { useState } from 'react';
import AddResource from './AddResources';
import classes from './AddResources.module.scss';
import Button from '../UI/Button';
import { useMutation } from '@apollo/client';
import { ADD_RESOURCE } from '../../graphql/mutations';
import { CircularProgress } from '@material-ui/core';

const NewResource = (props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [addResource, { data, loading, error }] = useMutation(ADD_RESOURCE);
  const saveExpenseDataHandler = (enteredExpenseData) => {
    const expenseData = {
      ...enteredExpenseData,
      id: Math.random().toString(16).substring(2)
    };
    props.onAddExpense(expenseData);
    setIsEditing(false);
  };

  const startEditingHandler = () => {
    setIsEditing(true);
  };

  const stopEditingHandler = () => {
    setIsEditing(false);
  };

  const resourceSubmitHandler = (newResource) => {
    console.log(newResource);
    addResource({ variables: { resourceInput: newResource } })
      .then((resp, error) => {
        console.log(resp);
        if (resp && resp.data && resp.data.addResource) {
          setIsEditing(false);
          props.onAdd();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (loading) {
    return (
      <div className={classes.loading}>
        <CircularProgress color='secondary' />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={`${classes['align-center']}`}>
      {!isEditing && <Button onClick={startEditingHandler}>Add New Resource</Button>}
      {isEditing && (
        <AddResource onSaveExpenseData={saveExpenseDataHandler} onSubmit={resourceSubmitHandler} onCancel={stopEditingHandler} />
      )}
    </div>
  );
};

export default NewResource;
