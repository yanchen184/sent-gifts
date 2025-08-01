import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import PersonCard from './PersonCard';
import './GiftColumn.css';

/**
 * GiftColumn component - represents one of the three gift status columns
 * @param {string} id - Column ID
 * @param {string} title - Column title
 * @param {Array} people - Array of people in this column
 * @param {Function} onDeletePerson - Delete person callback
 */
const GiftColumn = ({ id, title, people, onDeletePerson }) => {
  // Get column-specific styling
  const getColumnClass = () => {
    switch (id) {
      case 'not-sent':
        return 'column-not-sent';
      case 'preparing':
        return 'column-preparing';
      case 'sent':
        return 'column-sent';
      default:
        return '';
    }
  };

  return (
    <div className={`gift-column ${getColumnClass()}`}>
      <div className="column-header">
        <h3>{title}</h3>
        <span className="count-badge">{people.length}</span>
      </div>
      
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`column-content ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
          >
            {people.map((person, index) => (
              <PersonCard 
                key={person.id}
                person={person}
                index={index}
                onDelete={onDeletePerson}
              />
            ))}
            {provided.placeholder}
            {people.length === 0 && (
              <div className="empty-state">
                拖拽人員到這裡
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default GiftColumn;
