import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { FiUser, FiMail, FiLock, FiPhone, FiArrowRight, FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import { FaUserMd, FaUser, FaHospitalUser, FaUserNurse } from "react-icons/fa";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const roles = [
  {
    id: "patient",
    label: "Patient",
    icon: FaUser,
    desc: "Book appointments and manage health",
    gradient: "var(--gradient-patient)",
    color: "#f59e0b",
  },
  {
    id: "doctor",
    label: "Doctor",
    icon: FaUserMd,
    desc: "Manage patients and appointments",
    gradient: "var(--gradient-doctor)",
    color: "#10b981",
  },
  {
    id: "receptionist",
    label: "Receptionist",
    icon: FaUserNurse,
    desc: "Handle check-ins and scheduling",
    gradient: "var(--gradient-receptionist)",
    color: "#8b5cf6",
  },
  {
    id: "admin",
    label: "Admin",
    icon: FaHospitalUser,
    desc: "Full system administration",
    gradient: "var(--gradient-admin)",
    color: "#3b82f6",
  },
];

const Register = () => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phone: "" });
  const { register, getRoleRoute } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleNext = () => {
    if (!selectedRole) { toast.error("Please select your role"); return; }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    const result = await register({ ...form, role: selectedRole });
    setSubmitting(false);
    if (result.success) {
      toast.success("Account created successfully!");
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
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "40px 24px",
      }}
    >
      <div className="auth-bg"><div className="auth-orb" /></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="auth-form-card"
        style={{ width: "100%", maxWidth: 520, position: "relative", zIndex: 10 }}
      >
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}
              >
                <FiArrowLeft size={15} /> Back
              </button>
            )}
            <div
              style={{ display: "flex", gap: 6, marginLeft: "auto" }}
            >
              {[1, 2].map((s) => (
                <div
                  key={s}
                  style={{
                    width: s === step ? 24 : 8,
                    height: 8,
                    borderRadius: 999,
                    background: s <= step ? "var(--blue)" : "var(--border)",
                    transition: "all 0.3s",
                  }}
                />
              ))}
            </div>
          </div>
          <h2 className="auth-title">
            {step === 1 ? "Join MediCare" : "Create Account"}
          </h2>
          <p className="auth-subtitle">
            {step === 1 ? "Select your role to get started" : "Fill in your details below"}
          </p>
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              {roles.map((role) => (
                <button
                  key={role.id}
                  id={`role-${role.id}`}
                  onClick={() => setSelectedRole(role.id)}
                  style={{
                    background: selectedRole === role.id
                      ? `linear-gradient(135deg, ${role.color}20, ${role.color}10)`
                      : "var(--bg-card)",
                    border: `1.5px solid ${selectedRole === role.id ? role.color : "var(--border)"}`,
                    borderRadius: 14,
                    padding: "16px 14px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                    transform: selectedRole === role.id ? "translateY(-2px)" : "none",
                    boxShadow: selectedRole === role.id ? `0 8px 24px ${role.color}25` : "none",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: role.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 10,
                    }}
                  >
                    <role.icon size={18} color="white" />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
                    {role.label}
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)", lineHeight: 1.4 }}>
                    {role.desc}
                  </div>
                </button>
              ))}
            </div>

            <button
              id="register-next"
              onClick={handleNext}
              className="btn btn-primary btn-full btn-lg"
            >
              Continue <FiArrowRight size={17} />
            </button>
          </motion.div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Selected Role Badge */}
            <div
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "5px 12px", borderRadius: 999,
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.2)",
                marginBottom: 20,
              }}
            >
              <span style={{ fontSize: 12, color: "var(--blue-light)", fontWeight: 500, textTransform: "capitalize" }}>
                Registering as: {selectedRole}
              </span>
            </div>

            <div style={{ display: "grid", gap: 0 }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <div style={{ position: "relative" }}>
                  <FiUser size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    id="reg-name"
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Dr. John Smith"
                    className="form-input"
                    style={{ paddingLeft: 38 }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <div style={{ position: "relative" }}>
                  <FiMail size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    id="reg-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="form-input"
                    style={{ paddingLeft: 38 }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div style={{ position: "relative" }}>
                  <FiPhone size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    id="reg-phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="form-input"
                    style={{ paddingLeft: 38 }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label">Password *</label>
                <div style={{ position: "relative" }}>
                  <FiLock size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className="form-input"
                    style={{ paddingLeft: 38, paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                  >
                    {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-full btn-lg"
            >
              {submitting ? <><LoadingSpinner size="sm" /> Creating Account...</> : <>Create Account <FiArrowRight size={17} /></>}
            </button>
          </motion.form>
        )}

        {/* Sign In Link */}
        <div style={{ textAlign: "center", marginTop: 20, color: "var(--text-muted)", fontSize: 13 }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "var(--blue-light)", textDecoration: "none", fontWeight: 500 }}>
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;