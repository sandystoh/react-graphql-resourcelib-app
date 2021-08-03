import './App.css';
import React from 'react';
import client from './ApolloClient/client';
import { ApolloProvider } from '@apollo/client';
import ListResources from './components/Resources/ListResources';

function App() {
  return (
    <ApolloProvider client={client}>
      <div className='App'>
        <h2>Learning Resources</h2>
        <ListResources />
      </div>
    </ApolloProvider>
  );
}

export default App;
