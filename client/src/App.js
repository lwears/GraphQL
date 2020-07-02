import React from 'react';
import './App.css';
import Persons from './Persons.js';
import PersonForm from './PersonForm.js';
import { useQuery } from '@apollo/client';
import { ALL_PERSONS } from './queries';
import PhoneForm from './PhoneForm';

function App() {
  const [errorMessage, setErrorMessage] = React.useState(null);
  const result = useQuery(ALL_PERSONS);
  // const result = useQuery(ALL_PERSONS, {
  //   pollInterval: 2000,
  // });

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <PersonForm setError={notify} />
      {result.data && <Persons persons={result.data.allPersons} />}
      <PhoneForm setError={notify} />
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
