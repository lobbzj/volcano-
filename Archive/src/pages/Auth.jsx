import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Config from "../Config";
import { useAuth } from "../functions/AuthContext";

export default function Auth(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const { logged, handleLogin } = useAuth();

  const [isRegistering, setIsRegistering] = useState(props.isRegistering);

  useEffect(() => {
    setIsRegistering(props.isRegistering);
    setError(null);
    setMessage(null);
    setEmail("");
    setPassword("");
    setPassword2("");
  }, [props.isRegistering]);

  if (logged) {
    navigate("/home");
  }

  const handleLogin2 = (event) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    // Basic validation
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    fetch(`${Config.API_BASE_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.message);
        } else {
          handleLogin(data, email);
          navigate("/home");
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleRegister = (event) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    // Basic validation
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!password2 || password2.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== password2) {
      setError("Password must be same.");
      return;
    }
    fetch(`${Config.API_BASE_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.message);
        } else {
          if (data.message) {
            setEmail("");
            setPassword("");
            setPassword2("");
            setMessage(data.message);
          }
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="d-flex">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-10 mx-auto">
            <div className="text-center mt-5">
              <h3 className="mb-3">{isRegistering ? "Register" : "Login"}</h3>
            </div>
            <form onSubmit={isRegistering ? handleRegister : handleLogin2}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email:
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="input your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password:
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="input your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {isRegistering && (
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password again:
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password2"
                    placeholder="input your password again"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    required
                  />
                </div>
              )}
              {error && (
                <div className="alert alert-danger" role="alert">
                  Error: {error}
                </div>
              )}
              {message && (
                <div className="alert alert-info" role="alert">
                  message: {message}
                </div>
              )}
              <button type="submit" className="btn btn-primary">
                {isRegistering ? "Register" : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
