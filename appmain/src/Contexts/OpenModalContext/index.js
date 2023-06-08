import { createContext, useContext, useEffect, useState } from "react";
import { useData, useSendUpdatedTask, useUpdateData } from "../DataContext";
import { v4 as uuidv4 } from "uuid";

const ModalContext = createContext();
const updateModalContext = createContext();

const prevTaskContext = createContext();
const updatePrevTaskContext = createContext();

const ModalTodosContext = createContext();

const newTodoContext = createContext();

const changeTaskTitleContext = createContext();

const changeToDoTitleContext = createContext();

const toggleModalToDoContext = createContext();

const modalSendTaskContext = createContext();

const modalDeleteToDoContext = createContext();

export function useModal() {
  return useContext(ModalContext);
}
export function useModalUpdate() {
  return useContext(updateModalContext);
}
export function usePrevTask() {
  return useContext(prevTaskContext);
}
export function useUpdatePrevTask() {
  return useContext(updatePrevTaskContext);
}
export function useModalTodos() {
  return useContext(ModalTodosContext);
}
export function useNewTodo() {
  return useContext(newTodoContext);
}
export function useChangeTaskTitle() {
  return useContext(changeTaskTitleContext);
}
export function useChangeToDoTitle() {
  return useContext(changeToDoTitleContext);
}
export function useToggleModalToDo() {
  return useContext(toggleModalToDoContext);
}
export function useModalSendTask() {
  return useContext(modalSendTaskContext);
}
export function useModalDeleteToDo() {
  return useContext(modalDeleteToDoContext);
}

export function ModalProvider({ children }) {
  const updateData = useUpdateData();
  const sendUpdatedTask = useSendUpdatedTask();

  const [openModal, setOpenModal] = useState(false);
  const [prevTask, setPrevTask] = useState({
    _id: null,
    taskTitle: null,
  });
  const [modalTodos, setModalTodos] = useState([]);

  const data = useData();
  const { todos } = data;
  //   console.log("INSIDE OF MODALProvider todos:");
  //   console.log(todos);

  function toggleModal() {
    // console.log("togglemodal");
    setOpenModal(!openModal);
  }

  function togglePrevTask({ _id, taskTitle }) {
    if (prevTask === null || _id !== prevTask._id) {
      setModalTodos(todos.filter((todo) => todo.taskId._id === _id));
    }
    setPrevTask({ _id, taskTitle });
  }

  useEffect(() => {
    if (prevTask._id !== -1) {
      setModalTodos(todos.filter((todo) => todo.taskId._id === prevTask._id));
    }
  }, [data, data.todos, data.tasks, prevTask._id, prevTask, todos]);

  function createNewTodo() {
    const newtodo = {
      _id: new uuidv4(),
      todoTitle: "",
      done: false,
      boardId: 0,
      order: modalTodos.length,
    };
    setModalTodos([...modalTodos, newtodo]);
  }

  function changeTaskTitle(val) {
    // const { _id } = prevTask;
    // const repTask = { _id, val };
    setPrevTask({ ...prevTask, taskTitle: val });
  }

  function changeTodoTitle(todoId, val) {
    // setModalTodos(
    //   modalTodos.map((todo) => {
    //     if (todo._id === todoId) {
    //       return { ...todo, todoTitle: val };
    //     }
    //     return todo;
    //   })
    // );
    console.log(
      "changing todo with _id: " + todoId + " with the todoTitle: " + val
    );
    console.log("inside of changeTodoTitle: modalTodos: ");
    console.log(modalTodos);

    let newModalTodos = [];
    modalTodos.forEach((todo) => {
      if (todo._id !== todoId) newModalTodos.push(todo);
      else {
        const updateTodo = { ...todo };
        updateTodo.todoTitle = val;
        console.log("found the updateTodo being updated:");
        console.log(updateTodo);
        newModalTodos.push(updateTodo);
      }
    });

    console.log("the newModalTodos: ");
    console.log(newModalTodos);
    setModalTodos(newModalTodos);

    // setModalTodos((prevState) => ({
    //   ...prevState,
    //   array: prevState.array.map((obj) =>
    //     obj._id === todoId ? { ...obj, todoTitle: val } : obj
    //   ),
    // }));
  }

  function modalDeleteToDo(todoId) {
    let newModalTodos = [];
    modalTodos.forEach((todo) => {
      if (todo._id !== todoId) newModalTodos.push(todo);
    });
    setModalTodos(newModalTodos);
  }

  function toggleModalToDo(todoId) {
    setModalTodos(
      modalTodos.map((todo) =>
        todo._id === todoId
          ? { ...todo, boardId: todo.done ? 0 : 3, done: !todo.done }
          : todo
      )
    );
  }

  async function modalSendTask() {
    await sendUpdatedTask(prevTask, modalTodos);
    await updateData();
  }

  //   useEffect(() => {
  //     setOpenModal(false);
  //   }, []);

  return (
    <ModalContext.Provider value={openModal}>
      <prevTaskContext.Provider value={prevTask}>
        <ModalTodosContext.Provider value={modalTodos}>
          <newTodoContext.Provider value={createNewTodo}>
            <updatePrevTaskContext.Provider value={togglePrevTask}>
              <updateModalContext.Provider value={toggleModal}>
                <changeTaskTitleContext.Provider value={changeTaskTitle}>
                  <changeToDoTitleContext.Provider value={changeTodoTitle}>
                    <toggleModalToDoContext.Provider value={toggleModalToDo}>
                      <modalSendTaskContext.Provider value={modalSendTask}>
                        <modalDeleteToDoContext.Provider
                          value={modalDeleteToDo}
                        >
                          {children}
                        </modalDeleteToDoContext.Provider>
                      </modalSendTaskContext.Provider>
                    </toggleModalToDoContext.Provider>
                  </changeToDoTitleContext.Provider>
                </changeTaskTitleContext.Provider>
              </updateModalContext.Provider>
            </updatePrevTaskContext.Provider>
          </newTodoContext.Provider>
        </ModalTodosContext.Provider>
      </prevTaskContext.Provider>
    </ModalContext.Provider>
  );
}
