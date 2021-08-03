import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { GET_RESOURCE_FOR_EDIT } from '../../graphql/resources';
import { useQuery } from '@apollo/client';
import { CircularProgress } from '@material-ui/core';
import Button from '../UI/Button';

const useStyles = makeStyles((theme) =>
  createStyles({
    textField: {
      margin: theme.spacing(1)
    }
  })
);

const EditResourceForm = (props) => {
  const [state, setState] = useState({
    title: '',
    description: '',
    author: '',
    platform: null,
    publicationYear: '',
    type: '',
    level: '',
    length: '',
    url: '',
    topics: [],
    completed: false
  });
  const muiclasses = useStyles();
  const [topics, setTopics] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [types, setTypes] = useState([]);
  const [levels, setLevels] = useState([]);

  const { data, loading, error } = useQuery(GET_RESOURCE_FOR_EDIT, { variables: { id: props.id } });

  useEffect(() => {
    if (loading === false && data && data.resource) {
      console.log(data);
      setState({
        title: data.resource.title || '',
        description: data.resource.description || '',
        author: (data.resource.author && data.resource.author.name) || '',
        platform: data.resource.platform || null,
        publicationYear: data.resource.publicationYear || '',
        type: data.resource.type || '',
        level: data.resource.level || 'ALL',
        length: data.resource.length || '',
        url: data.resource.url || '',
        topics: data.resource.topics || [],
        completed: data.resource.completed || false
      });
      setTopics(data.allTopics.map(topic => ({ id: topic.id, name: topic.name})));
      setPlatforms(data.allPlatforms || []);
      setLevels(data.levels.values || []);
      setTypes(data.types.values || []);
    }
  }, [loading, data]);

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
    console.log(value);
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
    const editedResource = {
      id: props.id,
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
    props.onSubmit(editedResource);
  };

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
    <div>
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
        />
        <Autocomplete
          className={muiclasses.textField}
          id='platformId'
          name='platformId'
          options={platforms}
          onChange={handlePlatformChange}
          value={state.platform}
          getOptionLabel={(option) => (option && option.name) || ''}
          getOptionSelected={(option, value) => option ? option.id === value.id : null}
          renderInput={(params) => <TextField {...params} label='Platform' />}
          fullWidth
        />
        <TextField className={muiclasses.textField} id='url' name='url' label='URL' fullWidth value={state.url} onChange={handleChange} />
        <FormControl className={muiclasses.textField} fullWidth>
          <InputLabel id='type'>Type</InputLabel>
          <Select labelId='type' id='type' name='type' value={state.type} onChange={handleChange}>
            {types.map((type, i) => {
              return (
                <MenuItem value={type.name} key={i}>
                  {type.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl className={muiclasses.textField} fullWidth>
          <InputLabel id='level'>Level</InputLabel>
          <Select labelId='level' id='level' name='level' value={state.level} onChange={handleChange}>
            {levels.map((level, i) => {
              return (
                <MenuItem value={level.name} key={i}>
                  {level.name}
                </MenuItem>
              );
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
          getOptionLabel={(option) => (option && option.name) || ''}
          getOptionSelected={(option, value) => option ? option.id === value.id : null}
          value={state.topics}
          renderInput={(params) => <TextField {...params} label='Topics' placeholder='Topics' />}
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
        <Button type='submit' className={muiclasses.textField}>Edit Resource</Button>
        <Button type='button' cancel onClick={props.onCancel}>Cancel</Button>
      </form>
    </div>
  );
};

export default EditResourceForm;
