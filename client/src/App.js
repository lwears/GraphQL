import React, { useState } from 'react';
import './App.css';
import Persons from './Persons.js';
import PersonForm from './PersonForm.js';
import LoginForm from './LoginForm';
import { useQuery, useMutation, useSubscription, useApolloClient } from '@apollo/client';
import { ALL_PERSONS, PERSON_ADDED } from './queries';
import PhoneForm from './PhoneForm';

function App() {
  const [errorMessage, setErrorMessage] = React.useState(null);
  const result = useQuery(ALL_PERSONS);
  const [token, setToken] = useState(null);
  const client = useApolloClient();
  // const result = useQuery(ALL_PERSONS, {
  //   pollInterval: 2000,
  // });

  const updateCacheWith = (addedPerson) => {
    const includedIn = (set, object) => set.map((p) => p.id).includes(object.id);

    const dataInStore = client.readQuery({ query: ALL_PERSONS });
    if (!includedIn(dataInStore.allPersons, addedPerson)) {
      client.writeQuery({
        query: ALL_PERSONS,
        data: { allPersons: dataInStore.allPersons.concat(addedPerson) },
      });
    }
  };

  useSubscription(PERSON_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedPerson = subscriptionData.data.personAdded;
      notify(`${addedPerson.name} added`);
      updateCacheWith(addedPerson);
    },
  });

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  if (result.loading) {
    return <div>loading...</div>;
  }

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm setToken={setToken} setError={notify} />
      </div>
    );
  }

  return (
    <div>
      <button onClick={logout}>logout</button>
      <Notify errorMessage={errorMessage} />
      <Persons persons={result.data.allPersons} />
      <PersonForm setError={notify} updateCacheWith={updateCacheWith} />
      <PhoneForm notify={notify} />
    </div>
  );
}

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null;
  }
  return <div style={{ color: 'red' }}> {errorMessage} </div>;
};

export default App;
