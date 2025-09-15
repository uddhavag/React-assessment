import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [search, setSearch] = useState(""); // debounced value
  const [saved, setSaved] = useState([]);

  // debounce search input (300ms)
  useEffect(() => {
    const t = setTimeout(() => setSearch(input.trim()), 300);
    return () => clearTimeout(t);
  }, [input]);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await res.json();
        const mapped = data.slice(0, 12).map((item) => ({
          id: item.id,
          title: item.title,
          company: `Company ${item.userId}`,
          location: ["New York", "London", "Bengaluru", "Remote"][item.id % 4],
        }));
        setJobs(mapped);
      } catch (e) {
        setError("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const filtered = useMemo(() => {
    if (!search) return jobs;
    const s = search.toLowerCase();
    return jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(s) || j.company.toLowerCase().includes(s)
    );
  }, [jobs, search]);

  const saveJob = (job) => {
    if (!saved.find((j) => j.id === job.id)) {
      setSaved((prev) => [...prev, job]);
    }
  };

  const removeSaved = (id) => {
    setSaved((prev) => prev.filter((j) => j.id !== id));
  };

  return (
    <div className="app">
      <h1 className="title">Job Listing Board</h1>

      <input
        className="search"
        placeholder="Search by title or company..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {loading && <p className="info">Loading jobs…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <section>
            <h2 className="sectionTitle">All Jobs</h2>
            <div className="grid">
              {filtered.map((job) => (
                <div className="card" key={job.id}>
                  <h3 className="jobTitle">{job.title}</h3>
                  <p className="meta"><strong>Company:</strong> {job.company}</p>
                  <p className="meta"><strong>Location:</strong> {job.location}</p>
                  <button className="btn" onClick={() => saveJob(job)}>
                    Save Job
                  </button>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="info">No jobs match your search.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="sectionTitle">Saved Jobs</h2>
            {saved.length === 0 ? (
              <p className="muted">No jobs saved yet.</p>
            ) : (
              <div className="grid">
                {saved.map((job) => (
                  <div className="card" key={job.id}>
                    <h3 className="jobTitle">{job.title}</h3>
                    <p className="meta"><strong>Company:</strong> {job.company}</p>
                    <p className="meta"><strong>Location:</strong> {job.location}</p>
                    <button className="btnOutline" onClick={() => removeSaved(job.id)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
