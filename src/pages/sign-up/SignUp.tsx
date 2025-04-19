import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../../components/button/Button';
import Card from '../../components/card/Card';
import LinkButton from '../../components/link-button/LinkButton';
import PasswordField from '../../components/password-field/PasswordField';
import TextField from '../../components/text-field/TextField';
import styles from './SignUp.module.css';
import { useAuth } from '../../contexts/auth/AuthContext';
import { useServices } from '../../contexts/services/ServicesContext';
import { useSnackbar } from '../../contexts/snackbar/SnackbarContext';

type FormRegister = {
  email: string;
  username?: string;
  password?: string;
  verificationCode?: number;
};

const SignUp: React.FC = () => {
  const { authService } = useServices();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { register, handleSubmit, formState: { errors }, trigger } = useForm<FormRegister>();
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    logout()
  }, []);

  const onSubmitEmail = async (data: FormRegister) => {
    setLoading(true);

    const result = await authService.sendEmailVerification(data.email);

    if (result.success) {
      showSnackbar('Verification code sent to your email', 'success');
      setVerificationSent(true);
    } else {
      showSnackbar(result.errorMessage!, 'error');
    }

    setLoading(false);
  };

  const onSubmitRegistration = async (data: FormRegister) => {
    setLoading(true);

    const response = await authService.createAccount({
      email: data.email,
      username: data.username!,
      password: data.password!,
      verificationCode: data.verificationCode!
    });

    if (response.success) {
      showSnackbar('Registration successful', 'success');
      navigate('/login');
    } else {
      showSnackbar(response.errorMessage!, 'error');
    }

    setLoading(false);
  };

  const handleVerificationCodeClick = async () => {
    const isValid = await trigger('email');
    if (isValid) {
      setVerificationSent(true);
    }
  };

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <button
            onClick={() => navigate('/login')}
            disabled={loading}
            className={styles.backButton}
          >
            <svg
              width="20"
              height="20"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
            </svg>
          </button>
          <h2 className={styles.title}>
            {verificationSent ? 'Complete Registration' : 'Create Account'}
          </h2>
        </div>
        <form onSubmit={handleSubmit(verificationSent ? onSubmitRegistration : onSubmitEmail)}>
          <TextField
            id="email"
            label="Email"
            className='mb-4'
            disabled={loading || verificationSent}
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
              validate: async (value) => {
                const response = await authService.verifyEmailUsed(value);
                if (!response.success) {
                  return 'Unable to verify email. Please try again later.';
                }
                return !response.data || 'Email is already in use';
              }
            })}
          />
          {verificationSent && (
            <>
              <TextField
                id="verificationCode"
                label="Verification Code"
                className='mb-4'
                type='number'
                disabled={loading}
                placeholder="Enter the code sent to your email"
                error={errors.verificationCode?.message}
                registration={register('verificationCode', {
                  required: 'Verification code is required',
                  maxLength: {
                    value: 6,
                    message: 'Verification code must be at most 6 characters'
                  },
                })}
              />
              <TextField
                id="username"
                label="Username"
                className='mb-4'
                disabled={loading}
                placeholder="Enter your username"
                error={errors.username?.message}
                registration={register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 4,
                    message: 'Username must be at least 4 characters'
                  },
                  maxLength: {
                    value: 64,
                    message: 'Username must be at most 64 characters'
                  },
                })}
              />
              <PasswordField
                id="password"
                label="Password"
                className='mb-6'
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
              />
            </>
          )}
          <div className={styles.formActions}>
            <Button loading={loading} type="submit">
              {verificationSent ? 'Create Account' : 'Send Verification Code'}
            </Button>
          </div>
          {!verificationSent && (
            <div className={styles.verificationLink}>
              <LinkButton disabled={loading} onClick={handleVerificationCodeClick}>
                Already have a verification code?
              </LinkButton>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};

export default SignUp;