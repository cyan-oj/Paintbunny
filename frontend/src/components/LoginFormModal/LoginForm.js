import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";

function LoginForm() {
  const dispatch = useDispatch();
  
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const handleSubmit = e => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
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

  const demoSignIn = e => {
    e.preventDefault();
    dispatch(sessionActions.login({ credential: "Demo-lition" , password: "password"}))
  }

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      <h1>Login</h1>
        <ul style={{ display: errors.length ? "block" : "none" }}>
          {errors.map(error => <li className="error" key={error}>{error}</li>)}
        </ul>
        <input
          type="text"
          value={credential}
          placeholder="Username or Email"
          onChange={e => setCredential(e.target.value)}
          required
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
          required
        />
      <button type="submit">Log In</button>
      <button onClick={demoSignIn}>Demo User</button>
    </form>
  );
}

export default LoginForm;