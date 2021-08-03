import { gql } from '@apollo/client';

const RESOURCE_FIELDS = gql`
  fragment resourceFields on Resource {
    id
    title
    description
    createdDate
    updatedDate
    author {
      id
      name
    }
    platform {
      id
      name
      url
    }
    type
    level
    publicationYear
    length
    topics {
      id
      name
    }
    completed
    url
  }
`;

const GET_OPTIONS = gql`
fragment getOptions on Query {
  allTopics {
    id
    name
    description
  }
  allPlatforms {
    id
    name
    url
  }
  types: __type(name: "Type") {
    values: enumValues {
      name
    }
  }
  levels: __type(name: "Level") {
    values: enumValues {
      name
    }
  }
}
`;
export { RESOURCE_FIELDS, GET_OPTIONS };
