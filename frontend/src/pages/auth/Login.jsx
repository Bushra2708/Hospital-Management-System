import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { FaHospital, FaHeartbeat, FaUserMd, FaAmbulance } from "react-icons/fa";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const features = [
  { icon: FaUserMd, text: "AI-Powered Patient Management" },
  { icon: FaHeartbeat, text: "Real-time Health Monitoring" },
  { icon: FaAmbulance, text: "Emergency Response System" },
];

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, getRoleRoute } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    const result = await login(form.email, form.password);
    setSubmitting(false);
    if (result.success) {
      toast.success(`Welcome back, ${result.user.fullName.split(" ")[0]}!`);
      navigate(getRoleRoute(result.user.role));
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background */}
      <div className="auth-bg">
        <div className="auth-orb" />
      </div>

      {/* Left Panel - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          position: "relative",
          zIndex: 10,
          background: "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.06) 100%)",
          borderRight: "1px solid var(--border)",
          maxWidth: 560,
        }}
        className="hidden-mobile"
      >
        {/* Hospital Logo */}
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: "var(--gradient-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--shadow-blue)",
              marginBottom: 24,
            }}
          >
            <FaHospital size={32} color="white" />
          </div>
          <h1
            style={{
              fontSize: 38,
              fontWeight: 800,
              fontFamily: "Poppins, sans-serif",
              lineHeight: 1.2,
              marginBottom: 16,
            }}
          >
            <span className="gradient-text">MediCare</span>
            <br />
            <span style={{ color: "var(--text-primary)" }}>HMS</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.7, maxWidth: 340 }}>
            The most advanced hospital management platform — built for modern healthcare providers.
          </p>
        </div>

        {/* Feature List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              style={{ display: "flex", alignItems: "center", gap: 14 }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <f.icon size={18} style={{ color: "var(--blue-light)" }} />
              </div>
              <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>{f.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Decorative pulsing dots */}
        <div style={{ marginTop: 60, display: "flex", gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: i === 0 ? "var(--blue)" : i === 1 ? "var(--violet)" : "var(--emerald)",
                animation: `pulse-dot ${1.5 + i * 0.3}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Right Panel - Login Form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="auth-form-card"
          style={{ width: "100%", maxWidth: 420 }}
        >
          {/* Form Header */}
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.2)",
                borderRadius: 999,
                padding: "4px 12px",
                marginBottom: 16,
              }}
            >
              <div className="live-dot" />
              <span style={{ fontSize: 11.5, color: "var(--blue-light)", fontWeight: 500 }}>
                Secure Portal
              </span>
            </div>
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Sign in to access your dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: "relative" }}>
                <FiMail
                  size={15}
                  style={{
                    position: "absolute", left: 13, top: "50%",
                    transform: "translateY(-50%)", color: "var(--text-muted)",
                  }}
                />
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="doctor@medicare.com"
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <FiLock
                  size={15}
                  style={{
                    position: "absolute", left: 13, top: "50%",
                    transform: "translateY(-50%)", color: "var(--text-muted)",
                  }}
                />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="form-input"
                  style={{ paddingLeft: 38, paddingRight: 40 }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  style={{
                    position: "absolute", right: 12, top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", color: "var(--text-muted)", cursor: "pointer",
                    padding: 2,
                  }}
                >
                  {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit"
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-full btn-lg"
            >
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <FiArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: 12,
              margin: "24px 0", color: "var(--text-muted)", fontSize: 12,
            }}
          >
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            Don't have an account?
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <Link
            to="/register"
            className="btn btn-ghost btn-full"
            style={{ justifyContent: "center", textDecoration: "none" }}
          >
            Create Account
          </Link>

          {/* Demo Hint */}
          <div
            style={{
              marginTop: 20, padding: "12px 14px",
              background: "rgba(59,130,246,0.06)",
              border: "1px solid rgba(59,130,246,0.15)",
              borderRadius: 10,
            }}
          >
            <p style={{ fontSize: 11.5, color: "var(--text-muted)", textAlign: "center" }}>
              🔐 Register with role: <strong style={{ color: "var(--blue-light)" }}>admin</strong> / <strong style={{ color: "var(--blue-light)" }}>doctor</strong> / <strong style={{ color: "var(--blue-light)" }}>patient</strong> / <strong style={{ color: "var(--blue-light)" }}>receptionist</strong>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;