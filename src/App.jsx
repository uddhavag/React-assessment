import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  async function fetchJobs() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      const mapped = data.slice(0, 12).map((item) => ({
        id: item.id,
        title: item.title,
        company: `Company ${item.userId}`,
        location: ["New York", "London", "Delhi", "Remote"][item.id % 4],
      }));
      setJobs(mapped);
    } catch (e) {
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  const filtered = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase())
  );

  const saveJob = (job) => {
    if (!saved.find((j) => j.id === job.id)) {
      setSaved([...saved, job]);
    }
  };

  const removeSaved = (id) => {
    setSaved(saved.filter((j) => j.id !== id));
  };

  return (
    <div className="app">
      <h1 className="title">Job Listing Board</h1>

      <input
        type="search"
        className="search"
        placeholder="Search by title or company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/*loading + error + empty states */}
      {loading && <p className="info">Loading jobs…</p>}
      {error && (
        <p className="error">
          {error}{" "}
          <button className="btnOutline" onClick={fetchJobs}>
            Retry
          </button>
        </p>
      )}
      {!loading && !error && jobs.length === 0 && (
        <p className="muted">No jobs available right now.</p>
      )}

      {/* All Jobs */}
      {!loading && !error && jobs.length > 0 && (
        <>
          <h2 className="sectionTitle">All Jobs</h2>
          <div className="grid">
            {filtered.map((job) => (
              <div className="card" key={job.id}>
                <h3 className="jobTitle">{job.title}</h3>
                <p className="meta">
                  <strong>Company:</strong> {job.company}
                </p>
                <p className="meta">
                  <strong>Location:</strong> {job.location}
                </p>
                <button className="btn" onClick={() => saveJob(job)}>
                  Save Job
                </button>
              </div>
            ))}
            {filtered.length === 0 && <p>No jobs match your search.</p>}
          </div>

          {/* Saved Jobs */}
          <h2 className="sectionTitle">Saved Jobs</h2>
          {saved.length === 0 ? (
            <p className="muted">No jobs saved yet.</p>
          ) : (
            <div className="grid">
              {saved.map((job) => (
                <div className="card" key={job.id}>
                  <h3 className="jobTitle">{job.title}</h3>
                  <p className="meta">
                    <strong>Company:</strong> {job.company}
                  </p>
                  <p className="meta">
                    <strong>Location:</strong> {job.location}
                  </p>
                  <button
                    className="btnOutline"
                    onClick={() => removeSaved(job.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
