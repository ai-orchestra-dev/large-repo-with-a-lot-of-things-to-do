import React, { useState, useEffect } from 'react';
import { Todo } from './types';

// Custom hook for managing edit mode functionality
const useEditMode = (initialValue: string, todoId: string) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>(initialValue);

  // Reset edit value when initial value changes
  useEffect(() => {
    setEditValue(initialValue);
  }, [initialValue]);

  // Focus management for editing
  useEffect(() => {
    if (isEditing) {
      const input = document.getElementById(`todo-edit-${todoId}`) as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }
  }, [isEditing, todoId]);

  const startEditing = () => setIsEditing(true);
  
  const saveEdit = () => {
    if (editValue.trim()) {
      // In a real app, we'd need a way to update the todo text
      // For this demo, we'll just exit edit mode
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setEditValue(initialValue);
    setIsEditing(false);
  };

  return {
    isEditing,
    editValue,
    setEditValue,
    startEditing,
    saveEdit,
    cancelEdit
  };
};

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  // Use custom hook for edit mode functionality
  const {
    isEditing,
    editValue,
    setEditValue,
    startEditing,
    saveEdit,
    cancelEdit
  } = useEditMode(todo.text, todo.id);

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
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') cancelEdit();
            }}
            style={{ 
              flex: 1, 
              marginRight: '10px',
              padding: '5px'
            }}
          />
          <button onClick={saveEdit} style={{ marginRight: '5px', padding: '5px' }}>
            Save
          </button>
          <button onClick={cancelEdit} style={{ marginRight: '10px', padding: '5px' }}>
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
            onDoubleClick={startEditing}
          >
            {todo.text}
          </span>
          <button 
            onClick={startEditing}
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