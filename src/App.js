import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import GiftColumn from './components/GiftColumn';
import AddPersonForm from './components/AddPersonForm';
import { 
  addPerson, 
  updatePersonStatus, 
  deletePerson,
  listenToPeople 
} from './services/giftService';
import './App.css';

/**
 * Main App component - Gift management system
 */
function App() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Setup real-time listener for Firebase data
  useEffect(() => {
    const unsubscribe = listenToPeople((updatedPeople) => {
      setPeople(updatedPeople);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Group people by status for display in columns
  const groupedPeople = {
    'not-sent': people.filter(person => person.status === 'not-sent'),
    'preparing': people.filter(person => person.status === 'preparing'),
    'sent': people.filter(person => person.status === 'sent')
  };

  // Handle adding new person
  const handleAddPerson = async (name) => {
    setLoading(true);
    setError(null);
    
    try {
      await addPerson(name, 'not-sent');
    } catch (err) {
      console.error('Error adding person:', err);
      setError('新增人員失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  // Handle drag end event - use useCallback to prevent re-renders
  const handleDragEnd = useCallback(async (result) => {
    const { destination, source, draggableId } = result;

    // If dropped outside droppable area
    if (!destination) {
      return;
    }

    // If dropped in same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Update person status in database
    try {
      await updatePersonStatus(draggableId, destination.droppableId);
    } catch (err) {
      console.error('Error updating person status:', err);
      setError('更新狀態失敗，請稍後再試');
    }
  }, []);

  // Handle deleting person
  const handleDeletePerson = async (personId) => {
    try {
      await deletePerson(personId);
    } catch (err) {
      console.error('Error deleting person:', err);
      setError('刪除人員失敗，請稍後再試');
    }
  };

  // Column configuration
  const columns = [
    { id: 'not-sent', title: '還未送禮', people: groupedPeople['not-sent'] },
    { id: 'preparing', title: '準備送禮', people: groupedPeople['preparing'] },
    { id: 'sent', title: '已送禮', people: groupedPeople['sent'] }
  ];

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎁 禮物管理系統</h1>
        <div className="version">v1.0.0</div>
      </header>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="app-content">
        <div className="sidebar">
          <AddPersonForm 
            onAddPerson={handleAddPerson}
            loading={loading}
          />
          
          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">總人數：</span>
              <span className="stat-value">{people.length}</span>
            </div>
            <div className="stat-item not-sent">
              <span className="stat-label">還未送禮：</span>
              <span className="stat-value">{groupedPeople['not-sent'].length}</span>
            </div>
            <div className="stat-item preparing">
              <span className="stat-label">準備送禮：</span>
              <span className="stat-value">{groupedPeople['preparing'].length}</span>
            </div>
            <div className="stat-item sent">
              <span className="stat-label">已送禮：</span>
              <span className="stat-value">{groupedPeople['sent'].length}</span>
            </div>
          </div>
        </div>

        <div className="main-content">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="columns-container">
              {columns.map(column => (
                <GiftColumn
                  key={column.id}
                  id={column.id}
                  title={column.title}
                  people={column.people}
                  onDeletePerson={handleDeletePerson}
                />
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}

export default App;
