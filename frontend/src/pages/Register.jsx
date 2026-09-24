import { useForm } from "react-hook-form";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const departments = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"];
const semesters = [1,2,3,4,5,6,7,8];

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const selectedRole = watch("role");
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError("");
      setSuccessMessage("");
      await api.post("/auth/register", data);
      setSuccessMessage("Registration successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setServerError(error.response?.data?.message || "Registration failed");
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
          <p className="eyebrow">Get started</p>
          <h1>A simpler way to manage attendance.</h1>
          <p>Create your campus account and use one portal for QR attendance, class records and attendance insights.</p>
          <div className="feature-list">
            <div className="feature-item"><span className="feature-dot">1</span>Choose your campus role</div>
            <div className="feature-item"><span className="feature-dot">2</span>Add the required class details</div>
            <div className="feature-item"><span className="feature-dot">3</span>Start using the attendance portal</div>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <p className="eyebrow">New account</p>
          <h2>Create your account</h2>
          <p className="subtitle">Enter your details to register for the portal.</p>

          {serverError && <div className="alert alert-error">{serverError}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-field">
              <label>Name</label>
              <input type="text" placeholder="Full name" {...register("name", { required: "Name is required" })} />
              {errors.name && <span className="field-error">{errors.name.message}</span>}
            </div>
            <div className="form-field">
              <label>Email address</label>
              <input type="email" placeholder="you@example.com" {...register("email", { required: "Email is required" })} />
              {errors.email && <span className="field-error">{errors.email.message}</span>}
            </div>
            <div className="form-field">
              <label>Password</label>
              <input type="password" placeholder="At least 8 characters" {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } })} />
              {errors.password && <span className="field-error">{errors.password.message}</span>}
            </div>
            <div className="form-field">
              <label>Role</label>
              <select {...register("role", { required: "Role is required" })}>
                <option value="">Select role</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
              {errors.role && <span className="field-error">{errors.role.message}</span>}
            </div>

            {selectedRole === "student" && (
              <>
                <div className="form-field">
                  <label>Roll number</label>
                  <input type="text" placeholder="e.g. 22KT1A0501" {...register("rollNumber", { required: "Roll number is required" })} />
                  {errors.rollNumber && <span className="field-error">{errors.rollNumber.message}</span>}
                </div>
                <div className="form-field">
                  <label>Department</label>
                  <select {...register("department", { required: "Department is required" })}>
                    <option value="">Select department</option>
                    {departments.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                  {errors.department && <span className="field-error">{errors.department.message}</span>}
                </div>
                <div className="form-field">
                  <label>Semester</label>
                  <select {...register("semester", { required: "Semester is required", valueAsNumber: true })}>
                    <option value="">Select semester</option>
                    {semesters.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                  {errors.semester && <span className="field-error">{errors.semester.message}</span>}
                </div>
                <div className="form-field">
                  <label>Section</label>
                  <input type="text" placeholder="e.g. B" {...register("section", { required: "Section is required" })} />
                  {errors.section && <span className="field-error">{errors.section.message}</span>}
                </div>
              </>
            )}

            {selectedRole === "faculty" && (
              <>
                <div className="form-field">
                  <label>Employee ID</label>
                  <input type="text" placeholder="e.g. EMP001" {...register("employeeId", { required: "Employee ID is required" })} />
                  {errors.employeeId && <span className="field-error">{errors.employeeId.message}</span>}
                </div>
                <div className="form-field">
                  <label>Department</label>
                  <select {...register("department", { required: "Department is required" })}>
                    <option value="">Select department</option>
                    {departments.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                  {errors.department && <span className="field-error">{errors.department.message}</span>}
                </div>
              </>
            )}

            <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </section>
    </div>
  );
};

export default Register;
