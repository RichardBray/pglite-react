import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { usePGlite } from "@electric-sql/pglite-react"

import './App.css';

interface Todo {
  id: number;
  todo: string;
  date: string;
}

function App() {
  const [newTodoText, setNewTodoText] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const db = usePGlite()

  useEffect(() => {
    const loadTodos = async () => {
      const result = await db.query<Todo>('SELECT id, todo FROM todos_table ORDER BY date DESC');
      setTodos(result.rows);
    };
    loadTodos();
  }, [db]);


  function handleInputChange(event: ChangeEvent<HTMLInputElement>){
    setNewTodoText(event.target.value);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    if (newTodoText.trim() === '') return;

    await db.query('INSERT INTO todos_table (todo) VALUES ($1);', [newTodoText]);

    const result = await db.query<Todo>('SELECT id, todo FROM todos_table ORDER BY date DESC');
    setTodos(result.rows);
    setNewTodoText('');
  }

  function renderTodoList() {
    return (
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            {todo.todo}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="app-container">
      <h1>React Todo List</h1>
      
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={newTodoText}
          onChange={handleInputChange}
          placeholder="Add a new todo"
          className="todo-input"
        />
        <button type="submit" className="add-button">
          Add
        </button>
      </form>
      
      {renderTodoList()}
    </div>
  );
}

export default App;


