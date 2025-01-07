import React, { useState, useEffect } from 'react';
import Nav from "./Nav";

function RunPage() {
  const [runs, setRuns] = useState([]);
  const [experimentId, setExperimentId] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const expId = urlParams.get('experimentId');
    setExperimentId(expId);
    loadRuns(expId);
  }, []);

  const loadRuns = (expId) => {
    fetch(`http://localhost:8000/run?experimentId=${expId}`)
      .then(response => response.json())
      .then(data => {
        setRuns(data.filter(run => run.experiment_id == expId));
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error loading run data');
      });
  };

  const addNewRun = () => {
    if (!experimentId) {
      alert('Experiment ID is missing.');
      return;
    }

    const newRun = {
      experiment_id: experimentId,
      date: new Date().toISOString().split('T')[0],
      operator_id: 'default_operator',
      note: 'Auto-generated run'
    };

    console.log('Adding new run:', newRun);

    fetch('http://localhost:8000/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newRun)
    })
      .then(response => {
        if (response.ok) {
          alert('New run added successfully!');
          loadRuns(experimentId);
        } else {
          response.text().then(text => {
            console.error('Error response:', text);
            alert('Error adding new run');
          });
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error adding new run');
      });
  };

  return (
    <div>
      <Nav />
      <h1>Run List</h1>
      <div id="runList">
        {runs.length === 0 ? (
          <p>No runs found for this experiment.</p>
        ) : (
          runs.map(run => (
            <div key={run.id}>
              <a href="#">Run ID: {run.id}, Date: {run.date}</a>
            </div>
          ))
        )}
      </div>
      <button onClick={addNewRun}>Add New Run</button>
    </div>
  );
}

export default RunPage;