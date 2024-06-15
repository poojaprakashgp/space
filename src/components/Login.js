import React, {useRef} from 'react'
import { useDispatch } from 'react-redux';
import { login } from '../utils/authSlice';
import {useNavigate} from 'react-router-dom'

const Login = () => {
  const email =  useRef(null);
  const password =  useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
   e.preventDefault();
   console.log(email.current.value);
   dispatch(login({email: email.current.value, password: password.current.value}));
   navigate('/launch')
  }

  return (
    <div className="loginContainer">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="loginItem">
        <input type="email" placeholder="Email" ref={email}/>
        <input type="password" placeholder="Password" ref={password}/>
        <button>Submit</button>
      </form>
      </div>
  )
}

export default Login