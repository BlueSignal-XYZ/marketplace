/**
 * Unified Auth Modal — email + wallet connect.
 * Used by both WQT and Cloud platforms.
 * Renders as a centered modal overlay.
 */

import React, { useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { Button } from '../../design-system/primitives/Button';
import { Input } from '../../design-system/primitives/Input';
import { useAppContext } from '../../context/AppContext';

// Firebase
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: ${fadeIn} 0.2s ease;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 40px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: ${slideUp} 0.25s ease;
`;

const Brand = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const BrandName = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const BrandSub = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 4px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0;
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
`;

const SwitchRow = styled.div`
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 16px;
`;

const SwitchLink = styled.button`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 13px;
`;

const ErrorText = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.danger || '#dc3545'};
  text-align: center;
`;

const SuccessText = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.success || '#28a745'};
  text-align: center;
`;

const WalletButton = styled(Button)`
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  &:hover { background: linear-gradient(135deg, #7c3aed, #4f46e5); }
`;

export function AuthModal({ isOpen, onClose, initialMode = 'login', platform = 'wqt' }) {
  const [mode, setMode] = useState(initialMode); // login | signup | reset
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const auth = getAuth();

  const handleEmailAuth = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        onClose?.();
      } else if (mode === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
        onClose?.();
      } else if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        setSuccess('Password reset email sent. Check your inbox.');
      }
    } catch (err) {
      const msg = err.code === 'auth/user-not-found' ? 'No account with that email'
        : err.code === 'auth/wrong-password' ? 'Incorrect password'
        : err.code === 'auth/email-already-in-use' ? 'Email already registered'
        : err.code === 'auth/invalid-email' ? 'Invalid email address'
        : err.message || 'Authentication failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [mode, email, password, confirmPassword, auth, onClose]);

  const handleGoogle = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose?.();
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  }, [auth, onClose]);

  const handleWalletConnect = useCallback(async () => {
    setError('');
    // Placeholder — will integrate with ethers.js / wagmi in production
    setError('Wallet connect coming soon. Please use email for now.');
  }, []);

  if (!isOpen) return null;

  const platformName = platform === 'cloud' ? 'BlueSignal Cloud' : 'WaterQuality.Trading';

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <Modal>
        <Brand>
          <BrandName>{platformName}</BrandName>
          <BrandSub>
            {mode === 'login' ? 'Sign in to your account' :
             mode === 'signup' ? 'Create your account' :
             'Reset your password'}
          </BrandSub>
        </Brand>

        <Form onSubmit={handleEmailAuth}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          {mode !== 'reset' && (
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          )}

          {mode === 'signup' && (
            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          )}

          {error && <ErrorText>{error}</ErrorText>}
          {success && <SuccessText>{success}</SuccessText>}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Processing…' :
             mode === 'login' ? 'Sign In' :
             mode === 'signup' ? 'Create Account' :
             'Send Reset Email'}
          </Button>
        </Form>

        {mode !== 'reset' && (
          <>
            <Divider>or</Divider>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Button variant="outline" fullWidth onClick={handleGoogle} disabled={loading}>
                Continue with Google
              </Button>
              <WalletButton fullWidth onClick={handleWalletConnect} disabled={loading}>
                Connect Wallet
              </WalletButton>
            </div>
          </>
        )}

        <SwitchRow>
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <SwitchLink onClick={() => { setMode('signup'); setError(''); }}>Sign up</SwitchLink>
              {' · '}
              <SwitchLink onClick={() => { setMode('reset'); setError(''); }}>Forgot password?</SwitchLink>
            </>
          ) : mode === 'signup' ? (
            <>
              Already have an account?{' '}
              <SwitchLink onClick={() => { setMode('login'); setError(''); }}>Sign in</SwitchLink>
            </>
          ) : (
            <>
              <SwitchLink onClick={() => { setMode('login'); setError(''); setSuccess(''); }}>Back to sign in</SwitchLink>
            </>
          )}
        </SwitchRow>
      </Modal>
    </Overlay>
  );
}
