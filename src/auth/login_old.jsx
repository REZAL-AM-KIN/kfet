import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router';

import { setUserToken } from './user';
import Logout from './logout'

function Login(props) {
  const username = useFormInput("");
  const password = useFormInput("");
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const LOGIN_URL = "http://127.0.0.1:8000/api/token/";

  const handleLogin = () => {
    // set loading and state to have user visuals
    setError(null);
    setLoading(true);
    // make the request
    axios.post(LOGIN_URL, { "username": username.value, "password": password.value }).then(response => {
      setLoading(false);
      setUserToken(response.data.refresh, response.data.access) // auth the user
      // if there is a from state, navigate to it
      if (location.state?.from) {
        navigate(location.state.from);
      }
    }).catch(error =>{
      setLoading(false);
      setError(error);
    });
  }

  // here we need to make the login page html (don"t forget to import css)
  return(
    <div>
      <h1>LOGIN!</h1>
      <form>
        <input type="text" name="username" {...username}/>
        <input type="password" name="password" {...password}/>
        <button type="button" onClick={handleLogin}>Submit</button>
      </form>
    <div>{loading ? 'Loading...' : 'loaded'}</div>
    <button type="button" {...Logout()}>Logout</button>
  </div>
  );
}

// funtion to handle inputs
const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);
  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}

export default Login;
