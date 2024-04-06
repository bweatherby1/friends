import React, { useState, useEffect } from 'react';

function DateTimeComponent() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <p>Current Date and Time: {currentDateTime.toLocaleString()}</p>
    </div>
  );
}

export default DateTimeComponent; // Export DateTimeComponent as default
