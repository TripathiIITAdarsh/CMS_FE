import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentDash = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    axios.get('https://api.example.com/data')
      .then((response) => setData(response.data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Mock example values — replace with real values from `data`
  const name = data?.name || "John Doe";
  const currDate = new Date().toLocaleDateString();
  const totalCredits = data?.credits || 24;

  return (
    <div className="content">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-info">
          <img src="/asset/5856.jpg" alt="Profile" />
          <div>
            <h2>Welcome, {name}</h2>
            <p>{currDate}</p>
          </div>
        </div>
        <div className="points-meter">
          <div className="meter-container">
            <div className="meter">
              <div className="gauge"></div>
            </div>
          </div>
          <div className="points-info">
            <p>My Total Points</p>
            <h3>{totalCredits}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDash;
