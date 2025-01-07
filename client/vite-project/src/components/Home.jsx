import React, { useState, useEffect } from 'react';
import Nav from "../components/Nav";
import AddComputer from '../components/AddComputer';
import AddMinion from '../components/AddMinion';
import AddExperiment from '../components/AddExperiment'; // Updated import
import './Home.css';

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isComputerModalOpen, setIsComputerModalOpen] = useState(false);
  const [isMinionModalOpen, setIsMinionModalOpen] = useState(false);
  const [isExperimentModalOpen, setIsExperimentModalOpen] = useState(false); // State for AddExperiment modal

  useEffect(() => {
    const fetchBioData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setIsLoading(false);
      }
    };

    fetchBioData();
  }, []);

  const handleAddComputerClick = () => {
    setIsComputerModalOpen(true);
  };

  const handleAddMinionClick = () => {
    setIsMinionModalOpen(true);
  };

  const handleAddExperimentClick = () => {
    setIsExperimentModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsComputerModalOpen(false);
    setIsMinionModalOpen(false);
    setIsExperimentModalOpen(false); // Close the AddExperiment modal
  };

  const handleComputerSubmit = (computerName) => {
    console.log('Computer Name:', computerName);
  };

  const handleMinionSubmit = (minionData) => {
    console.log('Minion Data:', minionData);
  };

  const handleExperimentSubmit = (experimentData) => {
    console.log('Experiment Data:', experimentData);
    setIsExperimentModalOpen(false); // Close the modal after submission
  };

  return (
    <div className="home">
      <Nav />
      <main className="main-content">
        {isLoading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}

        <p className="select-message">WARNING: Admin use ONLY!</p>

        <div className="button-container">
          <button className="black-button" onClick={handleAddComputerClick}>Add Computer</button>
          <button className="black-button" onClick={handleAddMinionClick}>Add Minion</button>
          <button className="black-button" onClick={handleAddExperimentClick}>Add Experiment</button>
        </div>

        {/* AddComputer Modal */}
        <AddComputer 
          isOpen={isComputerModalOpen} 
          onClose={handleCloseModal} 
          onSubmit={handleComputerSubmit} 
        />

        {/* AddMinion Modal */}
        <AddMinion 
          isOpen={isMinionModalOpen} 
          onClose={handleCloseModal} 
          onSubmit={handleMinionSubmit} 
        />

        {/* AddExperiment Modal */}
        <AddExperiment 
          isOpen={isExperimentModalOpen} 
          onClose={handleCloseModal} 
          onSubmit={handleExperimentSubmit} 
        />
      </main>
    </div>
  );
}

export default Home;
