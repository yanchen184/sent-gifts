import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import './PersonCard.css';

/**
 * PersonCard component - displays individual person information
 * @param {Object} person - Person data
 * @param {number} index - Index for drag and drop
 * @param {Function} onDelete - Delete callback function
 */
const PersonCard = ({ person, index, onDelete }) => {
  // Handle delete button click
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`確定要刪除 ${person.name} 嗎？`)) {
      onDelete(person.id);
    }
  };

  return (
    <Draggable draggableId={person.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`person-card ${snapshot.isDragging ? 'dragging' : ''}`}
        >
          <div className="person-name">{person.name}</div>
          <button 
            className="delete-btn"
            onClick={handleDelete}
            title="刪除"
          >
            ×
          </button>
        </div>
      )}
    </Draggable>
  );
};

export default PersonCard;
