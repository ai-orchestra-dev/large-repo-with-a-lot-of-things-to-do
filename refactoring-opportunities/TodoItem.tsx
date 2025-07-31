import React, { useState, useEffect } from 'react';
import { Todo } from './types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  // State 1: Edit mode
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // State 2: Edit value
  const [editValue, setEditValue] = useState<string>(todo.text);

  // useEffect 1: Reset edit value when todo text changes
  useEffect(() => {
    setEditValue(todo.text);
  }, [todo.text]);

  // useEffect 2: Focus management for editing
  useEffect(() => {
    if (isEditing) {
      const input = document.getElementById(`todo-edit-${todo.id}`) as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }
  }, [isEditing, todo.id]);

  const handleSaveEdit = () => {
    if (editValue.trim()) {
      // In a real app, we'd need a way to update the todo text
      // For this demo, we'll just exit edit mode
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditValue(todo.text);
    setIsEditing(false);
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '10px', 
        border: '1px solid #ddd',
        marginBottom: '5px',
        backgroundColor: todo.completed ? '#f8f9fa' : 'white'
      }}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        style={{ marginRight: '10px' }}
      />
      
      {isEditing ? (
        <>
          <input
            id={`todo-edit-${todo.id}`}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSaveEdit();
              if (e.key === 'Escape') handleCancelEdit();
            }}
            style={{ 
              flex: 1, 
              marginRight: '10px',
              padding: '5px'
            }}
          />
          <button onClick={handleSaveEdit} style={{ marginRight: '5px', padding: '5px' }}>
            Save
          </button>
          <button onClick={handleCancelEdit} style={{ marginRight: '10px', padding: '5px' }}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <span
            style={{
              flex: 1,
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#6c757d' : 'black'
            }}
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.text}
          </span>
          <button 
            onClick={() => setIsEditing(true)}
            style={{ marginRight: '5px', padding: '5px' }}
          >
            Edit
          </button>
        </>
      )}
      
      <button 
        onClick={() => onDelete(todo.id)}
        style={{ padding: '5px', backgroundColor: '#dc3545', color: 'white' }}
      >
        Delete
      </button>
      
      <small style={{ marginLeft: '10px', color: '#6c757d' }}>
        {todo.createdAt.toLocaleDateString()}
      </small>
    </div>
  );
};