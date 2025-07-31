import React, { useState, useEffect } from 'react';
import { Todo, FilterType } from './types';
import { TodoItem } from './TodoItem';

// Custom hook for managing filter state with debugging
const useFilter = (initialFilter: FilterType = 'all') => {
  const [filter, setFilter] = useState<FilterType>(initialFilter);

  // Log filter changes for debugging
  useEffect(() => {
    console.log(`Filter changed to: ${filter}`);
  }, [filter]);

  return {
    filter,
    setFilter
  };
};

export const TodoApp: React.FC = () => {
  // State 1: Todo list
  const [todos, setTodos] = useState<Todo[]>([]);
  
  // State 2: Input value for new todos
  const [inputValue, setInputValue] = useState<string>('');
  
  // State 3: Filter state with debugging
  const { filter, setFilter } = useFilter('all');
  
  // State 4: Loading state for demo purposes
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // useEffect 1: Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        setTodos(parsedTodos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        })));
      } catch (error) {
        console.error('Failed to parse saved todos:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // useEffect 2: Save todos to localStorage whenever todos change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, isLoading]);

  // useEffect 3: Update document title with todo count
  useEffect(() => {
    const activeTodos = todos.filter(todo => !todo.completed);
    document.title = activeTodos.length > 0 
      ? `Todo App (${activeTodos.length} active)`
      : 'Todo App';
  }, [todos]);



  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date()
      };
      setTodos(prev => [...prev, newTodo]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  if (isLoading) {
    return <div>Loading todos...</div>;
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1>Todo App</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo..."
          style={{ padding: '10px', marginRight: '10px', width: '300px' }}
        />
        <button onClick={addTodo} style={{ padding: '10px' }}>
          Add Todo
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setFilter('all')}
          style={{ 
            marginRight: '10px', 
            padding: '5px 10px',
            backgroundColor: filter === 'all' ? '#007bff' : '#f8f9fa',
            color: filter === 'all' ? 'white' : 'black'
          }}
        >
          All ({todos.length})
        </button>
        <button 
          onClick={() => setFilter('active')}
          style={{ 
            marginRight: '10px', 
            padding: '5px 10px',
            backgroundColor: filter === 'active' ? '#007bff' : '#f8f9fa',
            color: filter === 'active' ? 'white' : 'black'
          }}
        >
          Active ({todos.filter(t => !t.completed).length})
        </button>
        <button 
          onClick={() => setFilter('completed')}
          style={{ 
            padding: '5px 10px',
            backgroundColor: filter === 'completed' ? '#007bff' : '#f8f9fa',
            color: filter === 'completed' ? 'white' : 'black'
          }}
        >
          Completed ({todos.filter(t => t.completed).length})
        </button>
      </div>

      <div>
        {filteredTodos.length === 0 ? (
          <p>No todos found for the current filter.</p>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
};