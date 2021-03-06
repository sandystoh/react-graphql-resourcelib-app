import { gql } from '@apollo/client';
import { RESOURCE_FIELDS, RESOURCE_LIST_FIELDS, GET_OPTIONS } from './fragments';

const ALL_RESOURCES = gql`
  ${RESOURCE_LIST_FIELDS}
  query AllResources($topicId: String) {
    allResources: resources(filter: { topicId: $topicId }) {
      ...resourceListFields
    }
    allTopics {
      id
      name
      description
    }
  }
`;

const GET_RESOURCE_DETAILS = gql`
  ${RESOURCE_FIELDS}
  query getResourceDetailsById($id: String!) {
    resource(id: $id) {
      ...resourceFields
    }
  }
`;

const GET_NEW_RESOURCE_OPTIONS = gql`
  ${GET_OPTIONS}
  query getNewResourceOptions {
    ...getOptions
  }
`;

const GET_RESOURCE_FOR_EDIT = gql`
  ${RESOURCE_FIELDS}
  ${GET_OPTIONS}
  query getResourceById($id: String!) {
    resource(id: $id) {
      ...resourceFields
    }
    ...getOptions
  }
`;

export { ALL_RESOURCES, GET_RESOURCE_DETAILS, GET_RESOURCE_FOR_EDIT, GET_NEW_RESOURCE_OPTIONS };
