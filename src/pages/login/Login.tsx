import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/auth/AuthContext';
import { useServices } from '../../contexts/services/ServicesContext';
import { useSnackbar } from '../../contexts/snackbar/SnackbarContext';
import Button from '../../components/button/Button';
import Card from '../../components/card/Card';
import LinkButton from '../../components/link-button/LinkButton';
import PasswordField from '../../components/password-field/PasswordField';
import TextField from '../../components/text-field/TextField';
import styles from './Login.module.css';

type FormLogin = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const { authService } = useServices();
  const { showSnackbar } = useSnackbar();
  const { login, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormLogin>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    logout()
  }, []);

  useEffect(() => {
    if (isAuthenticated && loading) {
      showSnackbar('Login successful', 'success');
      navigate('/tasks');
    }
  }, [isAuthenticated])

  const onSubmit = async (data: FormLogin) => {
    setLoading(true);

    const response = await authService.login({
      email: data.email,
      password: data.password
    });

    if (response.success) {
      login(response.data!);
    } else {
      showSnackbar(response.errorMessage!, 'error');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card>
        <h2 className={styles.title}>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            id="email"
            label="Email"
            className='mb-4'
            disabled={loading}
            placeholder="Enter your email"
            error={errors.email?.message}
            registration={register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              },
              maxLength: {
                value: 128,
                message: 'Email must be at most 128 characters'
              },
            })}
          />
          <PasswordField
            id="password"
            label="Password"
            disabled={loading}
            placeholder="Enter your password"
            error={errors.password?.message}
            registration={register('password', {
              required: 'Password is required',
              minLength: {
                value: 10,
                message: 'Password must be at least 10 characters'
              },
              maxLength: {
                value: 32,
                message: 'Password must be at most 32 characters'
              },
            })}
            className="mb-6"
          />
          <div className={styles.formActions}>
            <Button loading={loading} type="submit">
              Sign In
            </Button>
          </div>
          <div className={styles.linkContainer}>
            <LinkButton
              disabled={loading}
              onClick={() => navigate('/forgot-password')}
              className={styles.link}
            >
              Forgot Password?
            </LinkButton>
            <LinkButton
              disabled={loading}
              onClick={() => navigate('/sign-up')}
              className={styles.link}
            >
              Create an account
            </LinkButton>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Login;