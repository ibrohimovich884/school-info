import { useState } from 'react'
import data from "./data"
import "./Todo.css"

function Todo() {
    const [todos, setTodos] = useState(data)

    const toggleTodo = (id) => {
        console.log(id)
        setTodos(
            todos.map((item) =>
                item.id === id
                    ? { id: item.id, title: item.title, completed: !item.completed }
                    : item
            )
        )
    }


    return (
        <section>
            <div className="container">
                <div className="todo-list">

                <h2>Ishlar ro'yxati</h2>
                {todos.map((item) => (
                    <ul className="todo-item" key={item.id}>
                        <li onClick={() => toggleTodo(item.id)} className={item.completed ? "completed" : "not-completed"}>
                            {item.title}
                        </li>
                    </ul>
                ))}
                </div>
            </div>
        </section>
    )
}

export default Todo
