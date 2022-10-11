import React, { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import "./SignupForm.css";

function SignupForm() {
  const dispatch = useDispatch();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState([]); 

  const handleSubmit = e => {
    e.preventDefault();
    if (password === confirmPassword ) {
      setErrors([]);
      return dispatch(sessionActions.signup({ email, username, password }))
      .catch(async (res) => {
        let data;
        try {
          data = await res.clone().json();
        } catch {
          data = await res.text();
        }
        if (data?.errors) setErrors(data.errors);
        else if (data) setErrors([data]);
        else setErrors([res.statusText]);
      });
    }
    return setErrors(['password confirmation does not match']);
  } 

  return (
    <form onSubmit={handleSubmit}>
      <ul>
        {errors.map(error => <li key={error}>{error}</li>)}
      </ul>
        <input
          type="text"
          value={username}
          placeholder="Username"
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          value={email}
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          value={password}
          placeholder="Passowrd"
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          value={confirmPassword}
          placeholder="Confirm Password"
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
      <button type="submit">Sign Up</button>
    </form>
  )
}

export default SignupForm;