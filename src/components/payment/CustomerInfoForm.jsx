import { useState, useEffect } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import styled from 'styled-components';
import { Input } from '../shared/input/Input';
import FormSection from '../shared/FormSection/FormSection';
import { ButtonPrimary } from '../shared/button/Button';

const CustomerInfoForm = ({ onNextClick }) => {
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    isBusiness: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    // Check if user is signed in using Firebase auth
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setIsSignedIn(true);
      // Retrieve user info and pre-fill the form
      setCustomerInfo({
        firstName: user.displayName.split(' ')[0],
        lastName: user.displayName.split(' ')[1] || '',
        email: user.email,
        isBusiness: false, // Or retrieve this info from the database
      });
    }
  }, []);

  const validateForm = () => {
    let tempErrors = {};
    // customer info submitted
    if (!customerInfo.firstName.trim()) {
      tempErrors.firstName = 'First name is required';
    }

    if (!customerInfo.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      tempErrors.email = 'Email is invalid';
    }

    if (customerInfo.isBusiness && !customerInfo.lastName.trim()) {
      tempErrors.lastName = 'Last name is required for businesses';
    }

    // validation errors checked
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Refresh the component after sign-in to update form fields
      setIsSignedIn(true);
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      setErrors({ ...errors, signIn: 'Google sign-in failed. Please try again.' });
    }
  };

  const handleSubmit = async (event) => {
    validateForm();
    event.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        if (!isSignedIn) {
          // Implement account creation or email/password sign-in if needed
          //const auth = getAuth();
          //await signInWithEmailAndPassword(auth, customerInfo.email, 'password');
          setIsSignedIn(true);
        }
        // Proceed to the next form (checkout form)
        onNextClick(customerInfo);
      } catch (error) {
        console.error("Error during form submission:", error);
        setErrors({ ...errors, form: 'Submission failed. Please try again.' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {!isSignedIn ? (
        <>
          <p>Sign in to continue:</p>
          <SignInButton onClick={handleSignIn}>Sign in with Google</SignInButton>
          <p>or</p>
        </>
      ) : (
        <p className='form-title'>Please confirm your details.</p>
      )}
        <FormSection  label={"First Name"} error={errors.firstName}>
        <Input
          type="text"
          id="firstName"
          name="firstName"
          value={customerInfo.firstName}
          onChange={handleChange}
          className={errors.firstName ? 'error' : ''}
          required
          />
          </FormSection>

      <FormSection
        error={errors.lastName}
        label={"Last Name"}
      >
        <Input
          type="text"
          id="lastName"
          name="lastName"
          value={customerInfo.lastName}
          onChange={handleChange}
          className={errors.lastName ? 'error' : ''}
        />
      </FormSection>
      <FormSection label={"Email"} error={errors.email}>
        <Input
          type="email"
          id="email"
          name="email"
          value={customerInfo.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
          required
        />
      </FormSection>
      <div className=''>
        <label className='checkbox-section' htmlFor="isBusiness">
          <input
            type="checkbox"
            id="isBusiness"
            name="isBusiness"
            className='checkbox'
            checked={customerInfo.isBusiness}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, isBusiness: e.target.checked })
            }
          />
          Is this for a business?
        </label>
      </div>
      <ButtonPrimary type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Next'}
      </ButtonPrimary>
      {errors.form && <ErrorMessage>{errors.form}</ErrorMessage>}
    </FormContainer>
  );
};

export default CustomerInfoForm;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  margin-top: 40px;

  .checkbox-section { 
    display: flex;
    align-items: center;
    gap:8px;
    font-weight: 500; 
    font-size: 14px;
    .checkbox {
      height: 20px;
      width: 20px;
      margin-bottom: 0px;
      border: 1px solid ${({theme}) => theme.colors.ui200};
      accent-color: ${({theme}) => theme.colors.primary500};
    }
  }

  .form-title {
    font-size: 18px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.ui800};
  }
`;


const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
`;

const SignInButton = styled.button`
  background-color: #4285F4;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  margin-bottom: 10px;
  border-radius: 4px;

  &:hover {
    background-color: #357ae8;
  }
`;
