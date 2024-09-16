"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import InputField from "../components/InputField";
import { validatePassword } from "../../utils/validatePassword";
import axios from "axios";

const SignUp = () => {
  // State for form inputs
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  useEffect(() => {
    // Get the target element
    const targetDiv = document.getElementById("profile-div");
    // Scroll to the target div if it exists
    if (targetDiv) {
      targetDiv.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Validate password
    const validationError = validatePassword(newPassword);
    setPasswordError(validationError);
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);

    // Check if passwords match
    if (password !== newConfirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  // const handleEmailChange = (e) => {
  //   setEmail(e.target.value);
  // };
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !userName || !password || !confirmPassword) {
      alert("All fields must be filled.");
      return;
    }
    // Check if all validations are passed
    if (
      !passwordError &&
      !emailError &&
      !confirmPasswordError &&
      password === confirmPassword
    ) {
      console.log("Passwords are valid, proceed with form submission.");
      // Proceed with registration logic
    }
    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        email: email,
        userName: userName,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }});

      if (response.status === 201) {
        alert("Account created successfully!");
        // Redirect to login page or another action
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.error;
        if (errorMessage === "Email is already in use") {
          setEmailError("This email is already registered.");
        } else if (errorMessage === "Username is already taken") {
          setUserNameError("This username is already taken.");
        }
      } else {
        console.error("Error creating account:", error);
        alert("Failed to create account. Please try again.");
      }
    }
  };

  return (
    <div className="">
      <Navbar isHomePage={false} />
      <div className="relative bg-sign-up h-[850px] w-full bg-cover bg-center">
        {/* Gradients */}
        <div
          id="profile-div"
          className="absolute inset-0 h-[250px]  w-full bg-gradient-to-t  to-black from-transparent"
        ></div>
        <div className="absolute bottom-0 h-[250px]  w-full bg-gradient-to-b  to-black from-transparent"></div>

        {/* Frosted Glass Effect */}
        <div className="backdrop-blur-[4px] h-[850px] w-full pt-[200px]">
          <form
            className="flex flex-col items-left justify-between w-[560px] h-[400px] m-auto"
            onSubmit={handleRegister}
          >
            <p className="text-[40px]  font-semibold ">Register account</p>
            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              placeholder="email"
            />

            <InputField
              label="User name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              error={userNameError}
              placeholder="username"
            />

            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              error={passwordError}
              placeholder="password"
            />

            <InputField
              label="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={confirmPasswordError}
              placeholder="confirm password"
            />
    
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-800 drop-shadow-2xl text-white px-6 py-2 rounded-md"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
