import React, { useEffect, useReducer, useRef } from "react";
import axios from "axios";

const Todo = (props) => {
  //const [todoName, setTodoName] = useState("");
  //const [todoList, setTodoList] = useState([]);
  //const [submittedTodo, setSubmittedTodo] = useState(null);
  const todoInputRef = useRef();

  const todoListReducer = (state, action) => {
    switch (action.type) {
      case "ADD":
        return state.concat(action.payload);
      case "SET":
        return action.payload;
      case "REMOVE":
        return state.filter((todo) => todo.id !== action.payload);
      default:
        return state;
    }
  };

  const [todoList, dispatch] = useReducer(todoListReducer, []);

  useEffect(() => {
    axios
      .get("https://todo-app-270d6-default-rtdb.firebaseio.com/todo.json")
      .then((res) => {
        console.log(res.data);
        const todoData = res.data;
        let todos = [];
        for (const key in todoData) {
          todos.push({ id: key, name: todoData[key].name });
        }
        dispatch({ type: "SET", payload: todos });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // useEffect(() => {
  //   if (submittedTodo) {
  //     dispatch({ type: "ADD", payload: submittedTodo });
  //   }
  // }, [submittedTodo]);

  // const inputChangeHandler = (event) => {
  //   setTodoName(event.target.value);
  // };

  const todoAddHandler = () => {
    const todoName = todoInputRef.current.value;
    axios
      .post("https://todo-app-270d6-default-rtdb.firebaseio.com/todo.json", {
        name: todoName,
      })
      .then((res) => {
        console.log(res);
        const todoItem = { id: res.data.name, name: todoName };
        dispatch({ type: "ADD", payload: todoItem });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const todoRemoveHandler = (todoId) => {
    axios
      .delete(
        `https://todo-app-270d6-default-rtdb.firebaseio.com/todo/${todoId}.json`
      )
      .then(dispatch({ type: "REMOVE", payload: todoId }))
      .catch((err) => console.log(err));
  };

  return (
    <React.Fragment>
      <form>
        <div className="form-group">
          <input
            onChange={inputChangeHandler}
            className="form-control"
            value={todoName}
            placeholder="Todo"
            type="text"
            ref={todoInputRef}
          />
          <button
            className="btn btn-primary"
            onClick={todoAddHandler}
            type="button"
          >
            ADD
          </button>
          <ul className="list-unstyled justify-self-center">
            {todoList.map((todo) => (
              <li onClick={() => todoRemoveHandler(todo.id)} key={todo.id}>
                {todo.name}
              </li>
            ))}
          </ul>
        </div>
      </form>
    </React.Fragment>
  );
};

export default Todo;
