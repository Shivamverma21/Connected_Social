import React, { useEffect, useState,useContext } from "react";
import logo3 from "../img/logo3.png";
import "../css/SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import jwt_decode from "jwt-decode";
import { LoginContext } from "../context/LoginContext";
import logouse from "../img/imguse.jpg";


export default function SignUp() {
  const { setUserLogin } = useContext(LoginContext)
  const navigate = useNavigate()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")

  // Toast functions
  const notifyA = (msg) => toast.error(msg)
  const notifyB = (msg) => toast.success(msg)

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/

  const postData = () => {
    //checking email
    if (!emailRegex.test(email)) {
      notifyA("Invalid email")
      return
    } else if (!passRegex.test(password)) {
      notifyA("Password must contain at least 8 characters, including at least 1 number and 1 includes both lower and uppercase letters and special characters for example #,?,!")
      return
    }

    // Sending data to server
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        userName: userName,
        email: email,
        password: password

      })
    }).then(res => res.json())
      .then(data => {
        if (data.error) {
          notifyA(data.error)
        } else {
          notifyB(data.message)
          navigate("/signin")
        }
        console.log(data)
      })
  }

  const continueWithGoogle =(credentialResponse)=>{
    console.log(credentialResponse);
    const jwtDetail = jwt_decode(credentialResponse.credential)
    console.log(jwtDetail)
    fetch("/googleLogin",{
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: jwtDetail.name,
        userName: jwtDetail,
        email:jwtDetail.email,
        email_verified:jwtDetail.email_verified,
        clientId:credentialResponse.clientId,
        Photo:jwtDetail.picture

      })
    }).then(res => res.json())
      .then(data => {
        if (data.error) {
          notifyA(data.error)
        } else {
          notifyB("Signed In Successfully")
          console.log(data)
          localStorage.setItem("jwt", data.token)
          localStorage.setItem("user", JSON.stringify(data.user))
          setUserLogin(true)
          navigate("/")
        }
        console.log(data)
      })
  }

  return (
    <div className="signUp" style={{backgroundImage: `url(${logouse})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
}}>
      <div className="form-container">
        <div className="form">
          <img className="signUpLogo" src={logo3} alt="" />
          <p className="loginPara">
            Sign up to see photos and videos <br /> from your friends
          </p>
          <div>
            <input type="email" name="email" id="email" value={email} placeholder="Email" onChange={(e) => { setEmail(e.target.value) }} />
          </div>
          <div>
            <input type="text" name="name" id="name" placeholder="Full Name" value={name} onChange={((e) => { setName(e.target.value) })} />
          </div>
          <div>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              value={userName}
              onChange={(e) => { setUserName(e.target.value) }}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
            />
          </div>
          <p
            className="loginPara"
            style={{ fontSize: "12px", margin: "3px 0px" }}
          >
            By signing up, you agree to out Terms, <br /> privacy policy and
            cookies policy.
          </p>
          <input type="submit" id="submit-btn" value="Sign Up" onClick={() => { postData() }} />
          <hr/>
          <GoogleLogin
            onSuccess={credentialResponse => {
             continueWithGoogle(credentialResponse)
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </div>
        <div className="form2">
          Already have an account?
          <Link to="/signin">
            <span style={{ color: "blue", cursor: "pointer" }}>Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
