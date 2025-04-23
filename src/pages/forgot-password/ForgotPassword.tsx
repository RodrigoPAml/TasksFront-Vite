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
import styles from './ForgotPassword.module.css';

type FormReset = {
  email: string;
  password?: string;
  verificationCode?: number;
};

const ForgotPassword: React.FC = () => {
  const { authService } = useServices();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { register, handleSubmit, formState: { errors }, trigger } = useForm<FormReset>();
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    logout()
  }, []);

  const onSubmitEmail = async (data: FormReset) => {
    setLoading(true);

    const result = await authService.sendPasswordResetCode(data.email);

    if (result.success) {
      showSnackbar('Reset code sent to your email', 'success');
      setVerificationSent(true);
    } else {
      showSnackbar(result.errorMessage!, 'error');
    }

    setLoading(false);
  };

  const onSubmitReset = async (data: FormReset) => {
    setLoading(true);

    const response = await authService.resetPassword({
      email: data.email,
      newPassword: data.password!,
      verificationCode: data.verificationCode!
    });

    if (response.success) {
      showSnackbar('Password reset successful', 'success');
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
            {verificationSent ? 'Reset Password' : 'Forgot Password'}
          </h2>
        </div>
        <form onSubmit={handleSubmit(verificationSent ? onSubmitReset : onSubmitEmail)}>
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
                return response.data || 'Email not found';
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
              <PasswordField
                id="password"
                label="New Password"
                className='mb-6'
                disabled={loading}
                placeholder="Enter your new password"
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
              {verificationSent ? 'Reset Password' : 'Send Reset Code'}
            </Button>
          </div>
          {!verificationSent && (
            <div className={styles.resetCodeLink}>
              <LinkButton disabled={loading} onClick={handleVerificationCodeClick}>
                Already have a reset code?
              </LinkButton>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};

export default ForgotPassword;