import "./login.css";
import {useRef, useContext } from "react";
import { loginCall } from "../../apiCall";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const {user, isFetching, dispatch} = useContext(AuthContext);

  const handleSubmit = (e) =>{
    e.preventDefault();
    loginCall(
      {
        email: email.current.value,
        password: password.current.value
      },
      dispatch
    )
  }

  console.log(user);

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Lamasocial</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Lamasocial.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleSubmit}>
            <input placeholder="Email" type="email" required ref={email} className="loginInput" />
            <input placeholder="Password" type="password" required minLength="6" ref={password} className="loginInput" />
            <button className="loginButton" type="submit" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="primary" size="20px" />
              ) : (
                "Log In"
              )}
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <button className="loginRegisterButton">
                {isFetching ? (
                  <CircularProgress color="primary" size="20px" />
                ) : (
                  "Create a New Account"
                )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}