import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import { AppContext } from "../context/AppContext";

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken, setUser } = useContext(AppContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      let result;
      if (state === 'Sign Up') {
        result = await api.register({ name, email, password });
      } else {
        result = await api.login({ email, password });
      }

      if (result.success) {
        // Save token
        localStorage.setItem('token', result.token);
        setToken(result.token);
        setUser(result.user);
        
        alert(result.message);
        // Redirect to home
        navigate('/');
      } else {
        alert(result.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className='min-h-[80vh] flex items-center' onSubmit={onSubmitHandler}>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96px border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
        <p>Please {state === 'Sign Up' ? "sign up" : "log in"} to book Appointment.</p>
        
        {state === "Sign Up" && (
          <div className='w-full'>
            <p>Full Name</p>
            <input
              className='border border-zinc-300 rounded w-full p-2 mt-1'
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}
        
        <div className='w-full'>
          <p>Email</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
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
            required
          />
        </div>
        
        <button 
          className='bg-primary text-white w-full py-2 rounded-md text-base disabled:opacity-50'
          disabled={loading}
          type="submit"
        >
          {loading ? 'Loading...' : (state === 'Sign Up' ? "Create Account" : "Login")}
        </button>
        
        {state === "Sign Up" ? (
          <p>
            Already have an account?
            <span
              onClick={() => setState('Login')}
              className='text-primary underline cursor-pointer ml-1'
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?
            <span
              onClick={() => setState('Sign Up')}
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