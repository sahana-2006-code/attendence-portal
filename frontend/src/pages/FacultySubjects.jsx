import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../services/api";

const departments = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"];

const FacultySubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchSubjects = async () => {
    try {
      const response = await api.get("/subjects");
      setSubjects(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load subjects");
    }
  };

  useEffect(() => { fetchSubjects(); }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true); setError(""); setMessage("");
      await api.post("/subjects", data);
      reset();
      setMessage("Subject created successfully.");
      fetchSubjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create subject");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Subjects</h1><p>Create and manage the subjects assigned to you.</p></div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="card form-card">
        <h2 className="section-title">Create a subject</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-grid">
            <div className="form-field"><label>Subject name</label><input className="input-control" placeholder="e.g. Database Management Systems" {...register("subjectName", { required: "Subject name is required" })} />{errors.subjectName && <span className="field-error">{errors.subjectName.message}</span>}</div>
            <div className="form-field"><label>Subject code</label><input className="input-control" placeholder="e.g. CS601" {...register("subjectCode", { required: "Subject code is required" })} />{errors.subjectCode && <span className="field-error">{errors.subjectCode.message}</span>}</div>
            <div className="form-field"><label>Department</label><select className="select-control" {...register("department", { required: "Department is required" })}><option value="">Select department</option>{departments.map((item) => <option key={item} value={item}>{item}</option>)}</select>{errors.department && <span className="field-error">{errors.department.message}</span>}</div>
            <div className="form-field"><label>Semester</label><input className="input-control" type="number" min="1" max="8" placeholder="1–8" {...register("semester", { required: "Semester is required", valueAsNumber: true })} />{errors.semester && <span className="field-error">{errors.semester.message}</span>}</div>
            <div className="form-field"><label>Section</label><input className="input-control" placeholder="e.g. B" {...register("section", { required: "Section is required" })} />{errors.section && <span className="field-error">{errors.section.message}</span>}</div>
            <div className="form-field"><label>Academic year</label><input className="input-control" placeholder="e.g. 2026-27" {...register("academicYear", { required: "Academic year is required" })} />{errors.academicYear && <span className="field-error">{errors.academicYear.message}</span>}</div>
          </div>
          <div className="form-actions"><button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Creating..." : "+ Create subject"}</button></div>
        </form>
      </div>

      <div style={{ marginTop: 26 }}>
        <h2 className="section-title">Your subjects <span style={{ color: "#98a2b3", fontWeight: 500 }}>({subjects.length})</span></h2>
        {subjects.length === 0 ? (
          <div className="card empty-state"><strong>No subjects yet</strong>Create your first subject using the form above.</div>
        ) : (
          <div className="grid grid-3">{subjects.map((subject) => <div className="card subject-card" key={subject._id}><div className="subject-code">{subject.subjectCode}</div><div className="subject-name">{subject.subjectName}</div><div className="meta-row"><span className="meta-chip">{subject.department}</span><span className="meta-chip">Semester {subject.semester}</span><span className="meta-chip">Section {subject.section}</span></div></div>)}</div>
        )}
      </div>
    </div>
  );
};

export default FacultySubjects;
