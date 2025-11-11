import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import { AppContext } from "../context/AppContext";

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const { setToken, setUser } = useContext(AppContext);

  const validateEmail = (email) => {
    return email.toLowerCase().endsWith('@muj.manipal.edu');
  };

  // Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Only @muj.manipal.edu email addresses are allowed');
      return;
    }

    if (!name || name.trim().length < 2) {
      setError('Please enter your full name');
      return;
    }

    setLoading(true);

    try {
      const result = await api.sendOTP({ email, name });

      if (result.success) {
        setOtpSent(true);
        setStep(2);
        setCountdown(600); // 10 minutes
        alert('OTP sent to your email! Please check your inbox (and spam folder).');
        
        // Start countdown
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(result.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and Register
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const result = await api.verifyOTPAndRegister({
        email,
        otp,
        password,
        phone
      });

      if (result.success) {
        localStorage.setItem('token', result.token);
        setToken(result.token);
        setUser(result.user);
        
        alert('Registration successful! Welcome to UniLost.');
        navigate('/');
      } else {
        setError(result.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Login (no OTP)
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Only @muj.manipal.edu email addresses are allowed');
      return;
    }

    setLoading(true);

    try {
      const result = await api.login({ email, password });

      if (result.success) {
        localStorage.setItem('token', result.token);
        setToken(result.token);
        setUser(result.user);
        
        alert(result.message);
        navigate('/');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format countdown time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Reset form when switching between Sign Up and Login
  const handleStateChange = (newState) => {
    setState(newState);
    setStep(1);
    setOtpSent(false);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setOtp('');
    setCountdown(0);
  };

  return (
    <form 
      className='min-h-[80vh] flex items-center' 
      onSubmit={
        state === 'Login' 
          ? handleLogin 
          : (step === 1 ? handleSendOTP : handleVerifyOTP)
      }
    >
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>
          {state === 'Sign Up' ? "Create Account" : "Login"}
        </p>
        <p>
          {state === 'Sign Up' 
            ? (step === 1 ? "Enter your details to get started" : "Enter the OTP sent to your email")
            : "Please log in to access your account"}
        </p>
        
        {/* Error Message */}
        {error && (
          <div className='w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
            <p className='text-sm'>{error}</p>
          </div>
        )}

        {/* Info Message */}
        <div className='w-full bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded'>
          <p className='text-xs'>
            <strong>Note:</strong> Only Manipal University Jaipur email addresses (@muj.manipal.edu) are allowed.
          </p>
        </div>

        {/* Sign Up - Step 1: Send OTP */}
        {state === 'Sign Up' && step === 1 && (
          <>
            <div className='w-full'>
              <p>Full Name</p>
              <input
                className='border border-zinc-300 rounded w-full p-2 mt-1'
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className='w-full'>
              <p>Email</p>
              <input
                className='border border-zinc-300 rounded w-full p-2 mt-1'
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="yourname@muj.manipal.edu"
                required
              />
            </div>

            <button 
              className='bg-primary text-white w-full py-2 rounded-md text-base disabled:opacity-50 hover:bg-opacity-90 transition-all'
              disabled={loading}
              type="submit"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </>
        )}

        {/* Sign Up - Step 2: Verify OTP */}
        {state === 'Sign Up' && step === 2 && (
          <>
            {countdown > 0 && (
              <div className='w-full bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded'>
                <p className='text-sm'>
                  ⏱️ OTP expires in: <strong>{formatTime(countdown)}</strong>
                </p>
              </div>
            )}

            <div className='w-full'>
              <p>Enter OTP (Check your email)</p>
              <input
                className='border border-zinc-300 rounded w-full p-2 mt-1 text-center text-2xl tracking-widest'
                type="text"
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                value={otp}
                placeholder="000000"
                maxLength="6"
                required
              />
            </div>

            <div className='w-full'>
              <p>Password</p>
              <input
                className='border border-zinc-300 rounded w-full p-2 mt-1'
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Enter password (min 6 characters)"
                required
                minLength="6"
              />
            </div>

            <div className='w-full'>
              <p>Phone (Optional)</p>
              <input
                className='border border-zinc-300 rounded w-full p-2 mt-1'
                type="tel"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                placeholder="+91 1234567890"
              />
            </div>

            <button 
              className='bg-primary text-white w-full py-2 rounded-md text-base disabled:opacity-50 hover:bg-opacity-90 transition-all'
              disabled={loading || countdown === 0}
              type="submit"
            >
              {loading ? 'Verifying...' : 'Verify & Create Account'}
            </button>

            <button 
              type="button"
              onClick={() => {
                setStep(1);
                setOtpSent(false);
                setOtp('');
              }}
              className='text-primary underline cursor-pointer text-sm'
            >
              ← Back to enter email
            </button>
          </>
        )}

        {/* Login Form */}
        {state === 'Login' && (
          <>
            <div className='w-full'>
              <p>Email</p>
              <input
                className='border border-zinc-300 rounded w-full p-2 mt-1'
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="yourname@muj.manipal.edu"
                required
              />
            </div>

            <div className='w-full'>
              <p>Password</p>
              <input
                className='border border-zinc-300 rounded w-full p-2 mt-1'
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Enter your password"
                required
              />
            </div>

            <button 
              className='bg-primary text-white w-full py-2 rounded-md text-base disabled:opacity-50 hover:bg-opacity-90 transition-all'
              disabled={loading}
              type="submit"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </>
        )}

        {/* Toggle between Sign Up and Login */}
        {state === "Sign Up" ? (
          <p>
            Already have an account?
            <span
              onClick={() => handleStateChange('Login')}
              className='text-primary underline cursor-pointer ml-1'
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?
            <span
              onClick={() => handleStateChange('Sign Up')}
              className='text-primary underline cursor-pointer ml-1'
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;