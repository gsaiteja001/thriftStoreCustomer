import React, { useState, useEffect, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { auth, googleProvider } from './firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import LocationPicker from './pages/LocationPicker';

import GoogleIcon from './google.png';

import Spline from '@splinetool/react-spline';
import { useNavigate } from 'react-router-dom';

import { LoginContext } from './context/LoginContext';

const Login = () => {
  // State for splash, authentication and slide between login & signup

  const { isLoggedIn, setIsLoggedIn , setCustomerId, setCartId ,setWishIdlist } = useContext(LoginContext);

  const [isLoading, setIsLoading] = useState(true);

  const [showSignUp, setShowSignUp] = useState(false);

  // Login fields
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  // Sign up fields
  const [signupemail, setSignupemail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupDob, setSignupDob] = useState('');
  const [signupContact, setSignupContact] = useState('');

  const [signupAddress, setSignupAddress] = useState('');

  const navigate = useNavigate();



  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/login', { email, password });
      console.log('responsee....',response.data);
      const { token ,customer_id, cartId, wishlistId, addressID1,addressID2,addressID3,addressID4 } = response.data;
      console.log('response.data....',response.data);
      localStorage.setItem('customerId', customer_id);
      localStorage.setItem('wishlistId', wishlistId);
      localStorage.setItem('cartId', cartId);
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      localStorage.setItem('addressID1', addressID1);
      localStorage.setItem('addressID2', addressID2);
      localStorage.setItem('addressID3', addressID3);
      localStorage.setItem('addressID4', addressID4);
      setCartId(cartId);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Invalid credentials');
    }
  };

  const handleSocialLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      navigate('/EcommerceHome');
    } catch (error) {
      console.error('Error signing in with provider', error);
    }
  };


  const handleSignup = async (e) => {
  e.preventDefault();

  const registrationDate = new Date().toISOString(); // Current date as registration date

  // Send the data to the backend with proper fields
  const user = {
    name: signupName,
    email: signupemail,
    password: signupPassword,
    phone: signupContact,
    address: signupAddress, // Make sure address is part of the form
    registration_date: registrationDate, // You can omit this if handled by the backend
  };

  try {
    const response = await axios.post('http://localhost:3000/api/signup', user);
    if (response.status === 201) {
      alert('Signup successful! Please log in.');
      setShowSignUp(false);
    }
  } catch (error) {
    console.error('Error signing up:', error);
    alert('Signup failed');
  }
};




  if (isLoggedIn) {
    return <LocationPicker />;
  }

  return (
    <Container>
      <MainContent>
        {/* LOGIN SECTION */}

        <BrandTitleWrapper>
              <BrandTitle>Thrift Store</BrandTitle>
        </BrandTitleWrapper>
        <LoginSection showSignUp={showSignUp}>
          <LeftPanel>
            <SplineContainer>
              <Spline
                scene="https://prod.spline.design/mOZsw97NrtjZUCaD/scene.splinecode"
                style={{ width: '100%', height: '100%' }}
              />
            </SplineContainer>
          </LeftPanel>
          <LoginRightSide>
            <CardBase isSignUp={false}>
              
              {/* <Title>Welcome to Thrift Store</Title> */}
              <form onSubmit={handleLogin}>
                <InputField
                  type="text"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  placeholder="email"
                  required
                />
                <InputField
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
                <Button type="submit">Login</Button>
              </form>
              <Or>or</Or>
              <SocialLoginButton onClick={handleSocialLogin}>
                <GoogleImg src={GoogleIcon} alt="Google" />
                Continue with Google
              </SocialLoginButton>
              <ToggleLink onClick={() => setShowSignUp(true)}>
                Don’t have an account? <strong>Sign up</strong>
              </ToggleLink>
            </CardBase>
          </LoginRightSide>
        </LoginSection>

        {/* SIGN UP SECTION */}
        <SignUpSection showSignUp={showSignUp}>
          <CardBase isSignUp={true}>
              <Title>Sign Up</Title>
              <form onSubmit={handleSignup}>
                <InputField
                  type="text"
                  value={signupemail}
                  onChange={(e) => setSignupemail(e.target.value)}
                  placeholder="email"
                  required
                />
                <InputField
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
                <InputField
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Name"
                  required
                />
                <InputField
                  type="text"
                  value={signupContact}
                  onChange={(e) => setSignupContact(e.target.value)}
                  placeholder="Phone"
                  required
                />
                <InputField
                  type="text"
                  value={signupAddress}
                  onChange={(e) => setSignupAddress(e.target.value)}
                  placeholder="Address"
                  required
                />
                <Button type="submit">Sign Up</Button>
              </form>
              <ToggleLink onClick={() => setShowSignUp(false)}>
                Already have an account? <strong>Log in</strong>
              </ToggleLink>
            </CardBase>
        </SignUpSection>
      </MainContent>
    </Container>
  );
};

export default Login;

// Styled Components

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(-45deg, #f1f8e9, rgb(216, 243, 185), rgb(155, 194, 111), #8bc34a);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 18s ease infinite;
  font-family: 'Arial, sans-serif';
`;

const MainContent = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`;



const BrandTitleWrapper = styled.div`
  text-align: center;
  padding: 20px 0 10px;
`;

const BrandTitle = styled.h1`
  color: #2d2d2d;
  font-size: 5rem;
  font-weight: bold;
  margin: 0;
  cursor: default;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    transform: scale(1.06);
  }
`;



const LoginSection = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  transform: ${({ showSignUp }) => (showSignUp ? 'translateX(-100%)' : 'translateX(0)')};
  transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1);
`;

const SignUpSection = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  transform: ${({ showSignUp }) => (showSignUp ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1);
`;

const LeftPanel = styled.div`
  flex: 0.45;
  overflow: hidden;
  position: relative;
  margin-top: 30px;
`;

const SplineContainer = styled.div`
margin-top: 90px;
  width: 100%;
  height: 100%;
`;

const LoginRightSide = styled.div`
  flex: 0.55;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
`;

const CardBase = styled.div`
  width: 100%;
  max-width: ${({ isSignUp }) => (isSignUp ? '95vw' : '480px')};
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  padding: 30px;
  margin: 0 auto;
  overflow-y: auto;
  max-height: 65vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
  &:focus {
    border-color: #8ce08a;
  }
`;

const Button = styled.button`
  width: 100%;
  background-color: #8ce08a;
  color: black;
  padding: 15px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #78c57a;
  }
`;

const Or = styled.p`
  color: #666;
  margin-bottom: 20px;
  font-size: 16px;
`;

const SocialLoginButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  color: #333;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 16px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const GoogleImg = styled.img`
  margin-right: 10px;
  width: 20px;
  height: 20px;
`;

const ToggleLink = styled.div`
  margin-top: 15px;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    color: #555;
  }
`;

const SplashScreen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: #5e348b;
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
