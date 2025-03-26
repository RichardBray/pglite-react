import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { usePGlite, useLiveQuery } from '@electric-sql/pglite-react'

import './App.css';

interface Todo {
  id: number;
  todo: string;
  date: string;
}

function App() {
  const [newTodoText, setNewTodoText] = useState<string>('');
  const db = usePGlite();
  const todos = useLiveQuery<Todo>(
    'SELECT id, todo FROM todos_table ORDER BY date DESC'
  );

  function handleInputChange(event: ChangeEvent<HTMLInputElement>){
    setNewTodoText(event.target.value);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    if (newTodoText.trim() === '') return;

    await db.query('INSERT INTO todos_table (todo) VALUES ($1);', [newTodoText]);

    setNewTodoText('');
  }

  function renderTodoList() {
    return (
      <ul className='todo-list'>
        {todos ? todos.rows.map((todo) => (
          <li key={todo.id} className='todo-item'>
            {todo.todo}
          </li>
        )) : <>Loading...</>}
      </ul>
    );
  }

  return (
    <div className='app-container'>
      <h1>React Todo List</h1>
      
      <form onSubmit={handleSubmit} className='todo-form'>
        <input
          type='text'
          value={newTodoText}
          onChange={handleInputChange}
          placeholder='Add a new todo'
          className='todo-input'
        />
        <button type='submit' className='add-button'>
          Add
        </button>
      </form>
      
      {renderTodoList()}
    </div>
  );
}

export default App;


