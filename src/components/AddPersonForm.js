import React, { useState } from 'react';
import './AddPersonForm.css';

/**
 * AddPersonForm component - form to add new people to the gift list
 * @param {Function} onAddPerson - Callback function when person is added
 * @param {boolean} loading - Loading state
 */
const AddPersonForm = ({ onAddPerson, loading }) => {
  const [names, setNames] = useState('');
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!names.trim()) {
      alert('請輸入姓名');
      return;
    }

    // Split names by comma, newline, or semicolon and filter out empty strings
    const nameList = names
      .split(/[,\n;]/)
      .map(name => name.trim())
      .filter(name => name.length > 0);

    if (nameList.length === 0) {
      alert('請輸入有效的姓名');
      return;
    }

    // Add each person
    nameList.forEach(name => {
      onAddPerson(name);
    });

    // Clear the form
    setNames('');
  };

  return (
    <div className="add-person-form">
      <h2>新增人員</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="names">
            姓名 (可用逗號、分號或換行分隔多個姓名)
          </label>
          <textarea
            id="names"
            value={names}
            onChange={(e) => setNames(e.target.value)}
            placeholder="請輸入姓名，例如：&#10;張三&#10;李四, 王五&#10;趙六"
            rows={4}
            disabled={loading}
          />
        </div>
        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading || !names.trim()}
        >
          {loading ? '新增中...' : '新增到待送禮'}
        </button>
      </form>
    </div>
  );
};

export default AddPersonForm;
