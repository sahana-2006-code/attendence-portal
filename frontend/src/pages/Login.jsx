import { useForm } from "react-hook-form";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError("");
      const response = await api.post("/auth/login", data);
      const { token, user } = response.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate(user.role === "faculty" ? "/faculty/dashboard" : "/student/dashboard", { replace: true });
    } catch (error) {
      setServerError(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <div className="auth-brand">
          <div className="brand-mark">A</div>
          <div><strong>Attendly</strong><span>Campus Attendance</span></div>
        </div>
        <div>
          <p className="eyebrow">Smart attendance portal</p>
          <h1>Attendance, without the paperwork.</h1>
          <p>Manage classes, run QR attendance sessions and keep student attendance records in one simple campus portal.</p>
          <div className="feature-list">
            <div className="feature-item"><span className="feature-dot">✓</span>Fast QR-based attendance marking</div>
            <div className="feature-item"><span className="feature-dot">✓</span>Location-aware classroom verification</div>
            <div className="feature-item"><span className="feature-dot">✓</span>Clear attendance history and reports</div>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <p className="eyebrow">Welcome back</p>
          <h2>Sign in to your account</h2>
          <p className="subtitle">Use your campus credentials to continue.</p>

          {serverError && <div className="alert alert-error">{serverError}</div>}

          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <input id="email" type="email" placeholder="you@example.com" {...register("email", { required: "Email is required" })} />
              {errors.email && <span className="field-error">{errors.email.message}</span>}
            </div>
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" placeholder="Enter your password" {...register("password", { required: "Password is required" })} />
              {errors.password && <span className="field-error">{errors.password.message}</span>}
            </div>
            <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="auth-switch">Don't have an account? <Link to="/register">Create one</Link></p>
        </div>
      </section>
    </div>
  );
};

export default Login;
