import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from "../components/Nav";
import './Experiments.css'; 

const API_BASE_URL = 'http://localhost:8000/api/data/experiment';

function Experiments() {
  const [experiments, setExperiments] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        const response = await fetch(API_BASE_URL);
        const data = await response.json();

        if (response.ok) {
          setExperiments(data);
          setError('');
        } else {
          setError('Failed to load experiments');
        }
      } catch (err) {
        setError(`Error: ${err.message}`);
      }
    };

    fetchExperiments();
  }, []);

  const handleViewRuns = (experimentId) => {
    // Navigate to the RunList component with the experimentId as a query parameter
    navigate(`/runs?experimentId=${experimentId}`);
  };

  return (
    <div className="experiment-list">
      <Nav />
      <h1>Experiments</h1>
      {error && <p className="error">{error}</p>}
      {experiments.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {experiments.map((experiment) => (
              <tr key={experiment.id}>
                <td>{experiment.name}</td>
                <td>
                  <button onClick={() => handleViewRuns(experiment.id)}>
                    View Runs
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !error && <p>No experiments found.</p>
      )}
    </div>
  );
}

export default Experiments;
