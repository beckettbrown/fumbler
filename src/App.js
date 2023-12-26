import React, { useState, useEffect } from 'react';
import fumbles from './fumbles.json';

function App() {
  const [selectedFumble, setSelectedFumble] = useState(null);
  const [userFumbles, setUserFumbles] = useState(() => JSON.parse(localStorage.getItem('userFumbles')) || []);
  const [newFumble, setNewFumble] = useState({ attackStyle: '', name: '', effect: '' });
  const [useUserFumblesOnly, setUseUserFumblesOnly] = useState(false);

  const attackStyles = ['Melee', 'Ranged', 'Natural', 'Magic'];

  useEffect(() => {
    localStorage.setItem('userFumbles', JSON.stringify(userFumbles));
  }, [userFumbles]);

  const generateFumble = (style) => {
    const relevantFumbles = useUserFumblesOnly ? userFumbles : [...fumbles, ...userFumbles];
    const filteredFumbles = relevantFumbles.filter(fumble => fumble.attackStyle === style);
    if (filteredFumbles.length > 0) {
      const randomFumble = filteredFumbles[Math.floor(Math.random() * filteredFumbles.length)];
      setSelectedFumble(randomFumble);
    } else {
      setSelectedFumble(null);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (newFumble.attackStyle && newFumble.name && newFumble.effect) {
      setUserFumbles([...userFumbles, newFumble]);
      setNewFumble({ attackStyle: '', name: '', effect: '' }); // Reset form after submission
    }
  };

  const handleInputChange = (event) => {
    setNewFumble({ ...newFumble, [event.target.name]: event.target.value });
  };

  return (
    <div className="app-container">
      <div className="toggle-container">
        <label className="switch">
          <input 
            type="checkbox"
            checked={useUserFumblesOnly}
            onChange={() => setUseUserFumblesOnly(!useUserFumblesOnly)}
          />
          <span className="slider round"></span>
        </label>
        <span className="toggle-text">Use Only User Submitted Fumbles</span>
      </div>
      
      <h1>Pathfinder Fumble Generator</h1>
      
      <div className="buttons-container">
        {attackStyles.map(style => (
          <button key={style} onClick={() => generateFumble(style)}>{style}</button>
        ))}
      </div>
      
      {selectedFumble && (
        <div className="fumble-display">
          <h2>{selectedFumble.name}</h2>
          <p>{selectedFumble.effect}</p>
        </div>
      )}
      
      <form onSubmit={handleFormSubmit} className="add-fumble-form">
        <select 
          name="attackStyle" 
          value={newFumble.attackStyle} 
          onChange={handleInputChange}
          className="dropdown-style"
        >
          <option value="">Select Attack Style</option>
          {attackStyles.map(style => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>
        <input
          type="text"
          name="name"
          value={newFumble.name}
          onChange={handleInputChange}
          placeholder="Fumble Name"
        />
        <textarea
          name="effect"
          value={newFumble.effect}
          onChange={handleInputChange}
          placeholder="Fumble Effect"
        />
        <button type="submit">Add Fumble</button>
      </form>
    </div>
  );
}

export default App;
