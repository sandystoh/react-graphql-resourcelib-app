import { gql } from '@apollo/client';

const MARK_COMPLETE = gql`
  mutation markResourceCompleted($id: Int!, $completed: Boolean!) {
    markResourceCompleted(id: $id, completed: $completed)
  }
`;

const ADD_RESOURCE = gql`
  mutation addResource($resourceInput: ResourceInput) {
    addResource(resource: $resourceInput)
  }
`;

const EDIT_RESOURCE = gql`
  mutation updateResource($resourceUpdateInput: ResourceUpdateInput) {
    updateResource(resource: $resourceUpdateInput) {
      id
    }
  }
`;

const DELETE_RESOURCE = gql`
  mutation deleteResource($id: Int!) {
    deleteResource(resourceId: $id)
  }
`;

export { MARK_COMPLETE, ADD_RESOURCE, EDIT_RESOURCE, DELETE_RESOURCE};
