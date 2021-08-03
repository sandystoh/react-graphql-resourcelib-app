import { useQuery } from '@apollo/client';
import { Chip, CircularProgress, Link } from '@material-ui/core';
import React from 'react';
import { GET_RESOURCE_DETAILS } from '../../graphql/resources';
import classes from './ResourceDetails.module.scss';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const ResourceDetails = (props) => {
  const { data, loading, error } = useQuery(GET_RESOURCE_DETAILS, { variables: { id: props.id }, fetchPolicy: "no-cache" });
  let resource = null;
  if (data && data.resource) {
    resource = data.resource;
  }
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
    <div className={classes.detail}>
      <div className={classes.detail__title}>
        {resource.title} {resource.completed && <CheckCircleIcon fontSize='small' className={classes.detail__icon} />}
      </div>
      <div className={classes.detail__author}>
        {resource.author?.name} | {resource.platform?.name}
        <br />
        {resource.level} LEVEL(S) | {resource.type} | {resource.publicationYear}
        <br />
        <Link href={resource.url} className={classes.detail__link}>
          <span>Go to Resource</span>
        </Link>
      </div>
      <div hidden={!resource.description} className={classes.detail__description}>
        {resource.description}
      </div>
      <div>
        {resource.topics.map((topic) => {
          return <Chip key={topic.id} className={classes.detail__chip} size='small' label={topic.name} color='secondary' />;
        })}
      </div>
    </div>
  );
};

export default ResourceDetails;
