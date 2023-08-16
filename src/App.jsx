import react from "react";
import useLocalStorage from "use-local-storage";

import './index.css';


function App() {
  return (
    <div className="App">
      <div className="login-form">
        <h1>LOGIN</h1>
        <div className="container">
          <div className="top">
            <i class="fab fa-google"></i>
            <i class="fab fa-linkedin"></i>
            <i class="fab fa-instagram"></i>
            <i class="fab fa-apple"></i>
            <i class="fab fa-youtube"></i>
          </div>
          <p className="divider">
            <span>OR</span>
          </p>
          <form action="">
            <label>Email</label>
            <input type="email" placeholder="Please Enter Your Name" />
            <label>Password</label>
            <input type="password" placeholder="Please Enter Your Password" />
            <div className="remember">
              <input type="checkbox" checked="checked" />
              <p>Remember Me</p>
            </div>
            <button>Log In</button>
          </form>

          <div className="bottom">
            <p>Forget Password</p>
            <a href="/">Reset Password</a>
          </div>

          <p className="create">Create Account</p>
        </div>

        <div className="toggle-theme">
          <h2>Light Theme</h2>
          <i class="fas fa-toggle-on"></i>
        </div>
      </div>
    </div>
  );
}

export default App;
