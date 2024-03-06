/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { useAuth } from '../utils/context/authContext'; // Importing auth context

export default function ProfilePage() {
  const { user } = useAuth(); // Assuming you get the user from a context

  // State for storing bio and skill level
  const [bio, setBio] = useState('');
  const [skillLevel, setSkillLevel] = useState('');

  // Function to handle changes in bio input
  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  // Function to handle changes in skill level dropdown
  const handleSkillLevelChange = (e) => {
    setSkillLevel(e.target.value);
  };

  // Function to handle click on time slot bubbles
  const handleTimeSlotClick = (time) => {
    // Toggle selection of time slot or perform other actions
    console.log(`Selected time slot: ${time}`);
  };

  // Generate time slots from 6am to 5pm
  const generateTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 6; hour <= 17; hour++) {
      const time = `${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}`;
      timeSlots.push(
        <div
          key={time}
          className="time-slot"
          onClick={() => handleTimeSlotClick(time)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleTimeSlotClick(time);
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`Select ${time}`}
        >
          {time}
        </div>
      );
    }
    return timeSlots;
  };

  return (
    <div>
      <title>Profile</title>
      <meta name="description" content="User profile page" />
      <link rel="icon" href="/favicon.ico" />

      <main>
        <h1>Profile</h1>
        <p><img className="profilePage-img" src={user.photoURL} alt={user.displayName} /></p>

        {/* Bio input */}
        <div>
          <label htmlFor="bio">Bio:</label>
          <textarea id="bio" value={bio} onChange={handleBioChange} />
        </div>

        {/* Skill level dropdown */}
        <div>
          <label htmlFor="skill-level">Skill Level:</label>
          <select id="skill-level" value={skillLevel} onChange={handleSkillLevelChange}>
            <option value="">Select skill level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Time slots */}
        <div className="time-slots-container">
          {generateTimeSlots()}
        </div>
      </main>
    </div>
  );
}
