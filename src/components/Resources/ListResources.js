import { useQuery } from '@apollo/client';
import { Card, Chip, CircularProgress, Link } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { ALL_RESOURCES } from '../../graphql/resources';
import classes from './ListResources.module.scss';
import ForwardIcon from '@material-ui/icons/Forward';
import CompleteCheckBox from './CompleteCheckBox';
import EditResource from './EditResource';
import NewResource from './NewResource';
import DeleteResource from './DeleteResource';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';

const ListResources = (props) => {
  const { data, loading, error, refetch } = useQuery(ALL_RESOURCES, { variables: { topicId: null }});
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    if (loading === false && data && data.allTopics) {
      setTopics(data.allTopics.map(topic => ({ id: topic.id, name: topic.name})));
    }
  }, [loading, data]);

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

  const refreshPageHandler = () => {
    refetch();
    scrollToTop();
  };

  const handleTopicChange = (event, newValue) => {
    refetch({ topicId: (newValue && newValue.id) || null});
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div>
      <NewResource onAdd={refreshPageHandler} />
      <Autocomplete  className={classes.topicField}
          id='topics'
          name='topics'
          options={topics}
          onChange={handleTopicChange}
          getOptionLabel={(option) => (option && option.name) || ''}
          getOptionSelected={(option, value) => option.id === value.id}
          renderInput={(params) => <TextField {...params} className={classes.topicField__text} label='Topics' placeholder='Topics' variant="outlined" />}
          selectOnFocus
        />
      <div className={classes.allResources}>
        {data.allResources &&
          data.allResources.map(({ id, title, author, platform, topics, completed, url }) => (
            <Card className={classes.resourceCard} key={id}>
              <div className={classes.resourceCard__detail}>
                <div className={classes.resourceCard__title}>{title}</div>
                <div className={classes.resourceCard__subTitle}>
                  {author && author.name} | {platform && platform.name}
                </div>
                {topics.map((topic) => {
                  return <Chip key={topic.id} className={classes.resourceCard__chip} size='small' label={topic.name} color='secondary' />;
                })}
              </div>
              <div className={classes.resourceCard__iconActions}>
                <Link href={url}>
                  <ForwardIcon className={classes.resourceCard__icon} />
                </Link>
                <EditResource id={id} onEdit={refreshPageHandler} />
                <DeleteResource id={id} onDelete={refreshPageHandler} />
                <CompleteCheckBox id={id} completed={completed} />
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default ListResources;
