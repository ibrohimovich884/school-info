    import React from 'react'
    import data from "./data"
    import "./Todo.css"
    import { useState } from 'react'


    function Todo() {

        const [completed, setCompleted] = useState(false)
        return (
            <>
                <section>
                    <div className="container">
                        <div className="todo-list">
                            <div className="todo-content">
                                <h2>Ishlar ro'yxati</h2>
                                {data.map((item) => (
                                    <div key={item.id} className="todo-item">
                                        <ul>
                                            {console.log(item)}
                                            <li onClick={} className={item.completed ? "completed" : "not-completed"}>{item.title}</li>
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </>
        )

    }
    console.log(data)

    export default Todo