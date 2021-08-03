import React, { useState, useEffect } from 'react';
import Card from '../UI/Card';
import classes from './AddResources.module.scss';
import Button from '../UI/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useQuery } from '@apollo/client';
import { GET_NEW_RESOURCE_OPTIONS } from '../../graphql/resources';
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
  createStyles({
    textField: {
      margin: theme.spacing(1)
    }
  })
);

const AddResource = (props) => {
  const muiclasses = useStyles();

  const [topics, setTopics] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [types, setTypes] = useState([]);
  const [levels, setLevels] = useState([{ name: 'ALL' }]);
  const { data, loading, error } = useQuery(GET_NEW_RESOURCE_OPTIONS);
  const [submitError, setSubmitError] = useState(null);

  const handleClose = () => {
    setSubmitError(null);
  };

  useEffect(() => {
    if (loading === false && data) {
      setTopics(data.allTopics.map(topic => ({ id: topic.id, name: topic.name})));
      setPlatforms(data.allPlatforms || []);
      setLevels(data.levels.values || []);
      setTypes(data.types.values || []);
    }
  }, [loading, data]);

  const [state, setState] = useState({
    title: '',
    description: '',
    author: '',
    platform: null,
    publicationYear: '',
    type: '',
    level: 'ALL',
    length: '',
    url: '',
    topics: [],
    completed: false
  });
  const handleChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value
    }));
  };
  const handlePlatformChange = (event, value) => {
    if (value && value.id) {
      setState((prevState) => ({
        ...prevState,
        platform: value,
        platformId: value.id
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        platform: null,
        platformId: null
      }));
    }
  };

  const handleTopicChange = (event, value) => {
    if (value) {
      setState((prevState) => ({
        ...prevState,
        topics: value
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        topics: []
      }));
    }
  };
  const addResourceHandler = (event) => {
    event.preventDefault();
    if(!state.title.trim().length || !state.author.trim().length) {
      setSubmitError({title: 'Invalid Input', message: 'Please enter a valid Title and Author (non-Empty values)'})
      return;
    }
    const newResource = {
      title: state.title || '',
      description: state.description || '',
      authorName: state.author || '',
      platformId: (state.platform && state.platform.id) || 0,
      publicationYear: state.publicationYear || null,
      type: state.type || '',
      level: state.level || 'ALL',
      length: state.length || null,
      url: state.url || '',
      topics: (state.topics && state.topics.map(topic => topic.id)) ||[],
      completed: state.completed || false
    };
    props.onSubmit(newResource);
  };

  // const [topics, setTopics] = useState([
  //   { id: '1', name: 'React' },
  //   { id: '2', name: "GraphQL" },
  //   { id: '3', name: 'Spring Boot' },
  //   { id: '4', name: 'Spring Data JPA' },
  //   { id: '5', name: 'Java' },
  //   { id: '6', name: 'Java 8' }
  // ])

  // const platforms = [
  //   { id: '1', name: 'Udemy' },
  //   { id: '2', name: "O'Reilly" },
  //   { id: '3', name: 'PluralSight' },
  //   { id: '4', name: 'Udacity' }
  // ];

  // const types = [{ name: 'COURSE' }, { name: 'BOOK' }, { name: 'GUIDE' }, { name: 'VIDEO' }, { name: 'WEBSITE' }, { name: 'UNKNOWN' }];

  // const levels = [{ name: 'BEGINNER' }, { name: 'INTERMEDIATE' }, { name: 'EXPERT' }, { name: 'ALL' }];

  if (loading) {
    return (
      <div style={{ textAlign: 'center' }}>
        <CircularProgress color='primary' />
      </div>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <Card className={classes.input}>
      <h2 className={muiclasses.textField}>Add a Resource</h2>
      <form onSubmit={addResourceHandler}>
        <TextField
          className={muiclasses.textField}
          id='title'
          name='title'
          label='Title'
          type='text'
          fullWidth
          value={state.title}
          onChange={handleChange}
          required
        />
        <TextField
          className={muiclasses.textField}
          id='description'
          name='description'
          label='Description'
          fullWidth
          multiline
          rows={2}
          value={state.description}
          onChange={handleChange}
        />
        <TextField
          className={muiclasses.textField}
          id='author'
          name='author'
          type='text'
          label='Author'
          fullWidth
          value={state.author}
          onChange={handleChange}
          required
        />
        <Autocomplete
          className={muiclasses.textField}
          id='platformId'
          name='platformId'
          options={platforms}
          onChange={handlePlatformChange}
          value={state.platform}
          getOptionLabel={(option) => option.name}
          getOptionSelected={(option, value) => option.id === value.id}
          renderInput={(params) => <TextField {...params} label='Platform' />}
          fullWidth
        />
        <TextField
          className={muiclasses.textField}
          id='url'
          name='url'
          label='URL'
          fullWidth
          value={state.url}
          onChange={handleChange}
        />
        <FormControl className={muiclasses.textField} fullWidth required>
          <InputLabel id='type'>Type</InputLabel>
          <Select labelId='type' id='type' name="type" value={state.type} onChange={handleChange}>
            {types.map((type, i) => {
              return <MenuItem value={type.name} key={i}>{type.name}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <FormControl className={muiclasses.textField} fullWidth>
          <InputLabel id='level'>Level</InputLabel>
          <Select labelId='level' id='level' name="level" value={state.level} onChange={handleChange}>
            {levels.map((level, i) => {
              return <MenuItem value={level.name} key={i}>{level.name}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <Autocomplete
          multiple
          className={muiclasses.textField}
          id='topics'
          name='topics'
          options={topics}
          onChange={handleTopicChange}
          getOptionLabel={(option) => option.name}
          getOptionSelected={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Topics"
              placeholder="Topics"
            />
          )}
          fullWidth
        />
        <TextField
          className={muiclasses.textField}
          id='publicationYear'
          name='publicationYear'
          label='Publication Year'
          type='number'
          value={state.publicationYear}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          className={muiclasses.textField}
          id='length'
          name='length'
          label='Length'
          type='number'
          value={state.length}
          onChange={handleChange}
          fullWidth
          InputProps={{
            endAdornment: <InputAdornment position='end'>Hours</InputAdornment>
          }}
        />
        <Button type='submit' className={muiclasses.textField}>Add Resource</Button>
        <Button type='button' cancel onClick={props.onCancel}>Cancel</Button>
      </form>
      <Dialog open={!!submitError} onClose={handleClose}>
        <DialogTitle>{submitError?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{submitError?.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button type="button" cancel onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default AddResource;
