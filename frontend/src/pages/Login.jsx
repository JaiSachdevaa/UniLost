import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import { AppContext } from "../context/AppContext";

const Login = () => {
  const [state, setState] = useState("Login");
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();
  const { setToken, setUser } = useContext(AppContext);

  const validateEmail = (email) =>
    email.toLowerCase().endsWith("@muj.manipal.edu");

  /** Returns normalised 10-digit number or null */
  const parseIndianPhone = (raw) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.startsWith("91") && digits.length === 12) return digits.slice(2);
    if (digits.startsWith("0") && digits.length === 11) return digits.slice(1);
    if (digits.length === 10) return digits;
    return null;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startCountdown = () => {
    setCountdown(600);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleStateChange = (newState) => {
    setState(newState);
    setStep(1);
    setError("");
    setEmail("");
    setPassword("");
    setName("");
    setPhone("");
    setOtp("");
    setNewPassword("");
    setCountdown(0);
  };

  // ── Send OTP for Registration ───────────────────────────────────────────────
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Only @muj.manipal.edu email addresses are allowed");
      return;
    }
    if (!name || name.trim().length < 2) {
      setError("Please enter your full name");
      return;
    }

    setLoading(true);
    try {
      const result = await api.sendOTP({ email, name });
      if (result.success) {
        setStep(2);
        startCountdown();
        alert("OTP sent to your email! Please check your inbox (and spam folder).");
      } else {
        setError(result.message || "Failed to send OTP");
      }
    } catch {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Verify OTP and Register ─────────────────────────────────────────────────
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Phone validation — required
    const normalised = parseIndianPhone(phone);
    if (!normalised) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    try {
      const result = await api.verifyOTPAndRegister({
        email,
        otp,
        password,
        phone: normalised,
      });

      if (result.success) {
        localStorage.setItem("token", result.token);
        setToken(result.token);
        setUser(result.user);
        alert("Registration successful! Welcome to UniLost.");
        navigate("/");
      } else {
        setError(result.message || "Verification failed");
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot Password ─────────────────────────────────────────────────────────
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Only @muj.manipal.edu email addresses are allowed");
      return;
    }

    setLoading(true);
    try {
      const result = await api.forgotPassword({ email });
      if (result.success) {
        setStep(2);
        startCountdown();
        alert("Password reset OTP sent to your email!");
      } else {
        setError(result.message || "Failed to send OTP");
      }
    } catch {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Reset Password ──────────────────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const result = await api.resetPassword({ email, otp, newPassword });
      if (result.success) {
        alert("Password reset successful! You can now login with your new password.");
        handleStateChange("Login");
      } else {
        setError(result.message || "Password reset failed");
      }
    } catch {
      setError("Password reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Admin Login ─────────────────────────────────────────────────────────────
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await api.adminLogin({ email, password });
      if (result.success) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("isAdmin", "true");
        setToken(result.token);
        setUser(result.user);
        alert("Admin login successful!");
        navigate("/admin");
      } else {
        setError(result.message || "Admin login failed");
      }
    } catch {
      setError("Admin login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Regular Login ───────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Only @muj.manipal.edu email addresses are allowed");
      return;
    }

    setLoading(true);
    try {
      const result = await api.login({ email, password });
      if (result.success) {
        localStorage.setItem("token", result.token);
        setToken(result.token);
        setUser(result.user);
        alert(result.message);
        navigate("/");
      } else {
        setError(result.message || "Login failed");
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <form
      className="min-h-[80vh] flex items-center"
      onSubmit={
        state === "Login"
          ? handleLogin
          : state === "Admin Login"
          ? handleAdminLogin
          : state === "Forgot Password"
          ? step === 1
            ? handleForgotPassword
            : handleResetPassword
          : step === 1
          ? handleSendOTP
          : handleVerifyOTP
      }
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">

        {/* Title */}
        <p className="text-2xl font-semibold">
          {state === "Sign Up"
            ? "Create Account"
            : state === "Forgot Password"
            ? "Reset Password"
            : state === "Admin Login"
            ? "Admin Login"
            : "Login"}
        </p>

        {/* Sub-title */}
        <p>
          {state === "Sign Up"
            ? step === 1
              ? "Enter your details to get started"
              : "Enter the OTP sent to your email"
            : state === "Forgot Password"
            ? step === 1
              ? "Enter your email to receive OTP"
              : "Enter OTP and new password"
            : state === "Admin Login"
            ? "Enter admin credentials"
            : "Please log in to access your account"}
        </p>

        {/* Error banner */}
        {error && (
          <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* MUJ email note */}
        {state !== "Admin Login" && (
          <div className="w-full bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            <p className="text-xs">
              <strong>Note:</strong> Only Manipal University Jaipur email
              addresses (@muj.manipal.edu) are allowed.
            </p>
          </div>
        )}

        {/* ════ SIGN UP — Step 1 ════ */}
        {state === "Sign Up" && step === 1 && (
          <>
            <div className="w-full">
              <p>Full Name</p>
              <input
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="w-full">
              <p>Email</p>
              <input
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="yourname@muj.manipal.edu"
                required
              />
            </div>
            <button
              className="bg-primary text-white w-full py-2 rounded-md text-base disabled:opacity-50"
              disabled={loading}
              type="submit"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {/* ════ SIGN UP — Step 2: OTP + Phone + Password ════ */}
        {state === "Sign Up" && step === 2 && (
          <>
            {countdown > 0 && (
              <div className="w-full bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                <p className="text-sm">
                  ⏱️ OTP expires in: <strong>{formatTime(countdown)}</strong>
                </p>
              </div>
            )}

            <div className="w-full">
              <p>Enter OTP (Check your inbox)</p>
              <input
                className="border border-zinc-300 rounded w-full p-2 mt-1 text-center text-2xl tracking-widest"
                type="text"
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                value={otp}
                placeholder="000000"
                maxLength="6"
                required
              />
            </div>

            {/* Phone — required, no OTP */}
            <div className="w-full">
              <p>
                Phone Number <span className="text-red-500">*</span>
              </p>
              <div className="flex mt-1">
                <span className="inline-flex items-center px-3 border border-r-0 border-zinc-300 rounded-l bg-gray-50 text-gray-500 text-sm">
                  +91
                </span>
                <input
                  className="border border-zinc-300 rounded-r w-full p-2"
                  type="tel"
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                    setError("");
                  }}
                  value={phone}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Indian mobile number, digits only.
              </p>
            </div>

            <div className="w-full">
              <p>Password</p>
              <input
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Enter password (min 6 characters)"
                required
                minLength="6"
              />
            </div>

            <button
              className="bg-primary text-white w-full py-2 rounded-md text-base disabled:opacity-50"
              disabled={loading || countdown === 0}
              type="submit"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-primary underline cursor-pointer text-sm"
            >
              ← Back to enter email
            </button>
          </>
        )}

        {/* ════ FORGOT PASSWORD — Step 1 ════ */}
        {state === "Forgot Password" && step === 1 && (
          <>
            <div className="w-full">
              <p>Email</p>
              <input
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="yourname@muj.manipal.edu"
                required
              />
            </div>
            <button
              className="bg-primary text-white w-full py-2 rounded-md text-base disabled:opacity-50"
              disabled={loading}
              type="submit"
            >
              {loading ? "Sending OTP..." : "Send Reset OTP"}
            </button>
            <button
              type="button"
              onClick={() => handleStateChange("Login")}
              className="text-primary underline cursor-pointer text-sm"
            >
              ← Back to login
            </button>
          </>
        )}

        {/* ════ FORGOT PASSWORD — Step 2 ════ */}
        {state === "Forgot Password" && step === 2 && (
          <>
            {countdown > 0 && (
              <div className="w-full bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                <p className="text-sm">
                  ⏱️ OTP expires in: <strong>{formatTime(countdown)}</strong>
                </p>
              </div>
            )}
            <div className="w-full">
              <p>Enter OTP (Check your email)</p>
              <input
                className="border border-zinc-300 rounded w-full p-2 mt-1 text-center text-2xl tracking-widest"
                type="text"
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                value={otp}
                placeholder="000000"
                maxLength="6"
                required
              />
            </div>
            <div className="w-full">
              <p>New Password</p>
              <input
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                placeholder="Enter new password (min 6 characters)"
                required
                minLength="6"
              />
            </div>
            <button
              className="bg-primary text-white w-full py-2 rounded-md text-base disabled:opacity-50"
              disabled={loading || countdown === 0}
              type="submit"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-primary underline cursor-pointer text-sm"
            >
              ← Back to enter email
            </button>
          </>
        )}

        {/* ════ ADMIN LOGIN ════ */}
        {state === "Admin Login" && (
          <>
            <div className="w-full bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded">
              <p className="text-xs">
                <strong>⚠️ Admin Access:</strong> For authorized personnel only.
              </p>
            </div>
            <div className="w-full">
              <p>Admin Email</p>
              <input
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="admin@muj.manipal.edu"
                required
              />
            </div>
            <div className="w-full">
              <p>Admin Password</p>
              <input
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Enter admin password"
                required
              />
            </div>
            <button
              className="bg-orange-600 text-white w-full py-2 rounded-md text-base disabled:opacity-50"
              disabled={loading}
              type="submit"
            >
              {loading ? "Logging in..." : "Admin Login"}
            </button>
            <button
              type="button"
              onClick={() => handleStateChange("Login")}
              className="text-primary underline cursor-pointer text-sm"
            >
              ← Back to user login
            </button>
          </>
        )}

        {/* ════ REGULAR LOGIN ════ */}
        {state === "Login" && (
          <>
            <div className="w-full">
              <p>Email</p>
              <input
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="yourname@muj.manipal.edu"
                required
              />
            </div>
            <div className="w-full">
              <p>Password</p>
              <input
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="button"
              onClick={() => handleStateChange("Forgot Password")}
              className="text-primary underline cursor-pointer text-xs self-end"
            >
              Forgot Password?
            </button>
            <button
              className="bg-primary text-white w-full py-2 rounded-md text-base disabled:opacity-50"
              disabled={loading}
              type="submit"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              onClick={() => handleStateChange("Admin Login")}
              className="w-full text-orange-600 underline cursor-pointer text-sm"
            >
              🔐 Admin Login
            </button>
          </>
        )}

        {/* Toggle Sign Up / Login */}
        {state === "Sign Up" ? (
          <p>
            Already have an account?
            <span
              onClick={() => handleStateChange("Login")}
              className="text-primary underline cursor-pointer ml-1"
            >
              Login here
            </span>
          </p>
        ) : state === "Login" ? (
          <p>
            Create a new account?
            <span
              onClick={() => handleStateChange("Sign Up")}
              className="text-primary underline cursor-pointer ml-1"
            >
              Click here
            </span>
          </p>
        ) : null}
      </div>
    </form>
  );
};

export default Login;