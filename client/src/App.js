import React, { useState } from 'react';
import './App.css';
import Persons from './Persons.js';
import PersonForm from './PersonForm.js';
import { useQuery, useApolloClient } from '@apollo/client';
import { ALL_PERSONS } from './queries';
import PhoneForm from './PhoneForm';
import LoginForm from './LoginForm';

function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(null);
  const result = useQuery(ALL_PERSONS);
  const client = useApolloClient(); // access the client  

  // const result = useQuery(ALL_PERSONS, {
  //   pollInterval: 2000,
  // });

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();  // reset the cache
  };

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm setToken={setToken} setError={notify} />
      </div>
    );
  } else if (result.loading) {
    return <div>loading...</div>;
  } else if(token) {
    return (
      <div>
      <button onClick={()=>logout()} >logout</button>
      <Notify errorMessage={errorMessage} />
      <Persons persons={result.data.allPersons} />
      <PersonForm setError={notify} />
      <PhoneForm notify={notify}/>
    </div>
    );
  }
}

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null;
  }
  return <div style={{ color: 'red' }}> {errorMessage} </div>;
};

export default App;
