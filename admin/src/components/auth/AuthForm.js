import { useEffect, useState } from 'react';
import {
  useNavigate,
  useSearchParams,
  Link,
  useLocation,
  useParams,
} from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../../untils/axios';

import stles from './AuthForm.module.css';

import Button from '../UI/Button/Button';
import List from '../UI/List/List';
import Frame from '../UI/Frame/Frame';

const Auth = () => {
  const location = useLocation();
  const params = useParams();
  const [cookies] = useCookies([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (cookies.jwt) {
      navigate('/');
    }
  }, [cookies, navigate]);

  const isResetPass = location.pathname === '/reset-password';
  const isNewPass = location.pathname.includes(`/reset/`);

  const [
    searchParams,
    // setSearchParams
  ] = useSearchParams();
  const isRegister = searchParams.get('mode') === 'register';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [values, setValues] = useState({
    username: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    userId: '',
    resetToken: '',
    isAdmin: false,
  });

  const FetchUrl = (url, func) => {
    useEffect(() => {
      async function fetchData() {
        const request = await axios.get(url);

        func(request.data.prod || request.data);
        return request;
      }
      fetchData();
    }, [url, func]);
  };

  const [resetPass, setResetPass] = useState();
  if (params.token) {
    FetchUrl(`/reset/${params.token}`, setResetPass);
  }

  const handleInput = () => {
    setValues({
      username: username,
      password: password,
      fullName: fullName,
      phoneNumber: phoneNumber,
      email: email,
      userId: isNewPass ? resetPass.userId : '',
      resetToken: isNewPass ? resetPass.resetToken : '',
      isAdmin: false,
    });
  };

  const generateError = error =>
    toast.error(error, {
      position: 'bottom-right',
    });

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const { data } = await axios.post(
        `${
          isNewPass
            ? '/new-password'
            : isResetPass
            ? 'reset'
            : isRegister
            ? 'signup'
            : 'login'
        }`,
        {
          ...values,
        }
      );
      if (data) {
        if (data.errors) {
          const { username, password, fullName, phoneNumber, email } =
            data.errors;
          if (username) generateError(username);
          else if (password) generateError(password);
          else if (isRegister) {
            if (fullName) generateError(fullName);
            else if (phoneNumber) generateError(phoneNumber);
            else if (email) generateError(email);
          }
        } else {
          isRegister ? navigate('/auth?mode=login') : (window.location = '/');
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <List>
      <Frame>
        <form onSubmit={handleSubmit} className={stles.form}>
          {!isNewPass && (
            <div className={stles.formItem}>
              <label>User Name</label>
              <input
                type='text'
                name='username'
                placeholder='User Name'
                onChange={e => setUsername(e.target.value)}
                value={username}
              />
            </div>
          )}
          {!isResetPass && (
            <div className={stles.formItem}>
              <label>Password</label>
              <input
                type='password'
                name='password'
                placeholder='Password'
                onChange={e => setPassword(e.target.value)}
                value={password}
              />
            </div>
          )}
          {!isResetPass && isRegister && (
            <div className={stles.formItem}>
              <label>Full Name</label>
              <input
                type='text'
                name='fullName'
                placeholder='Full Name'
                onChange={e => setFullName(e.target.value)}
                value={fullName}
              />
            </div>
          )}
          {!isResetPass && isRegister && (
            <div className={stles.formItem}>
              <label>Phone Number</label>
              <input
                type='number'
                name='phoneNumber'
                placeholder='Phone Number'
                onChange={e => setPhoneNumber(e.target.value)}
                value={phoneNumber}
              />
            </div>
          )}
          {!isResetPass && isRegister && (
            <div className={stles.formItem}>
              <label>Email</label>
              <input
                type='email'
                name='email'
                placeholder='Email'
                onChange={e => setEmail(e.target.value)}
                value={email}
              />
            </div>
          )}
          <div className={stles.formItem}>
            <Button onClick={handleInput}>
              {isNewPass
                ? 'Update'
                : isResetPass
                ? 'Reset Password'
                : isRegister
                ? 'Register'
                : 'Login'}
            </Button>
            {!isNewPass && !isResetPass && !isRegister && (
              <Link to={`/reset-password`} style={{ textAlign: 'center' }}>
                Reset Password
              </Link>
            )}
          </div>
        </form>
        <ToastContainer />
      </Frame>
    </List>
  );
};

export default Auth;
