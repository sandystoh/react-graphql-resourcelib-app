import React, { Fragment, useState } from 'react';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ErrorIcon from '@material-ui/icons/Error';
import classes from './ListResources.module.scss';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import { DELETE_RESOURCE } from '../../graphql/mutations';

const DeleteResource = (props) => {
  const [open, setOpen] = useState(false);
  const [deleteResource, { loading, error }] = useMutation(DELETE_RESOURCE);
  const openConfirmDialog = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const handleDelete = (resource) => {
    deleteResource({ variables: { id: props.id } })
      .then((resp, error) => {
        console.log(resp);
        if (resp && resp.data && resp.data.deleteResource) {
          setOpen(false);
          props.onDelete();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (loading) {
    return <div>...</div>;
  }

  if (error) return <ErrorIcon color='secondary' />;

  return (
    <Fragment>
      <DeleteForeverIcon className={classes.resourceCard__icon} onClick={openConfirmDialog} />
      <Dialog open={open} onClose={handleCancel} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Delete Resource</DialogTitle>
        <DialogContent>
          <DialogContentText>Do you really want to delete this Resource?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleDelete} color='primary'>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default DeleteResource;
