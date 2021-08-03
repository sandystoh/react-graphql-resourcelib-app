import React, { useState } from 'react';
import classes from './ListResources.module.scss';
import EditIcon from '@material-ui/icons/Edit';
import { CircularProgress, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import EditResourceForm from './EditResourceForm';
import { useMutation } from '@apollo/client';
import { EDIT_RESOURCE } from '../../graphql/mutations';

const EditResource = (props) => {
  const [open, setOpen] = useState(false);
  const [updateResource, { loading, error }] = useMutation(EDIT_RESOURCE);
  const handleEdit = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = (resource) => {
    console.log(resource);
    updateResource({ variables: { resourceUpdateInput: resource } })
      .then((resp, error) => {
        if (resp && resp.data && resp.data.updateResource && resp.data.updateResource.id) {
          setOpen(false);
          props.onEdit();
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
    <div>
      <EditIcon className={classes.resourceCard__icon} onClick={handleEdit} />
      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Edit Resource</DialogTitle>
        <DialogContent>
          <EditResourceForm id={props.id} onSubmit={handleSubmit} onCancel={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditResource;
