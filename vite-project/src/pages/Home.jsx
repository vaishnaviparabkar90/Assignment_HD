// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import ExperienceCard from "../components/ExperienceCard";

export default function Home() {
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/experiences/");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setExperiences(data);
        setFilteredExperiences(data);
      } catch (err) {
        setError("Unable to load experiences");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredExperiences(experiences);
      return;
    }
    const filtered = experiences.filter((exp) =>
      exp.title.toLowerCase().includes(term)
    );
    setFilteredExperiences(filtered);
  };

  if (loading)
    return <div className="text-center mt-20 text-gray-600">Loading...</div>;
  if (error)
    return <div className="text-center mt-20 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 px-4 py-4">
          {/* Left: Brand */}
          
          <a href="/" className="flex items-center gap-2">
  <img
    src="https://imgs.search.brave.com/AfIEOcNrLg4Nm3KtmAmr9eFZz_IAszKUwF-jWfYeges/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMueW91cnN0b3J5/LmNvbS9jcy9pbWFn/ZXMvY29tcGFuaWVz/LzEyODE5MTgwMTY3/MTkxMjI0NjM5NzE1/Njg0NzEwOTU2NzU3/NjM0MzQyNTNvLTE2/MDIyMTYwNjQzODQu/cG5nP2ZtPWF1dG8m/YXI9MToxJm1vZGU9/ZmlsbCZmaWxsPXNv/bGlkJmZpbGwtY29s/b3I9ZmZmJmZvcm1h/dD1hdXRvJnc9Mzg0/JnE9NzU"
    alt="Highway Delight Logo"
    className="h-12 object-contain"
  />
</a>

          {/* Right: Search bar (responsive) */}
          <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto gap-2">
            <input
              type="text"
              placeholder="Search experiences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-60 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={handleSearch}
              className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition w-full sm:w-auto"
            >
              Search
            </button>
          </div>
        </div>
      </header>

      

      {/* Experience Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl font-semibold mb-6">Available Experiences</h2>
        {filteredExperiences.length === 0 ? (
          <p className="text-gray-500 text-center">No experiences found.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredExperiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
