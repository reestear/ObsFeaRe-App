import axios from "axios";

const actoken = sessionStorage.getItem("actoken");
const config = {
  headers: {
    authorization: `Bearer ${actoken}`,
  },
};

export async function dataUserRegister(username, email, password) {
  const user = {
    username: username,
    email: email,
    password: password,
  };
  // when something is empty
  if (username.trim() === "" || email.trim() === "" || password.trim() === "")
    return {
      status: false,
      message: "Incorrect Type of Credentials",
    };
  //   console.log("sending user:");
  //   console.log(user);
  return await axios
    .post("http://localhost:8080/auth/register", { user })
    .then(async (res) => {
      const mes = await JSON.parse(res.request.response);
      sessionStorage.setItem("actoken", mes.actoken);
      return {
        status: true,
        message: mes.message,
      };
      // console.log(mes);
    })
    .catch(async (err) => {
      const errMes = await JSON.parse(err.request.response).message;

      console.log("printing errMes: ");
      console.log(errMes);
      return {
        status: false,
        message: errMes,
      };
    });
}

export async function dataUserLogin(email, password) {
  // when something is empty
  if ((await email.trim()) === "" || password.trim() === "")
    return {
      status: false,
      message: "Incorrect Type of Credentials",
    };
  return await axios
    .get(`http://localhost:8080/auth/login/${email}/${password}`)
    .then(async (res) => {
      const mes = await JSON.parse(res.request.response);
      // console.log(mes);
      sessionStorage.setItem("actoken", mes.actoken);
      return {
        status: true,
        message: mes.message,
      };
    })
    .catch(async (err) => {
      const errMes = await JSON.parse(err.request.response).message;

      console.log("printing errMes: ");
      console.log(errMes);
      return {
        status: false,
        message: errMes,
      };
    });
}

export async function dataGetTodos() {
  const actoken = sessionStorage.getItem("actoken");
  const config = {
    headers: {
      authorization: `Bearer ${actoken}`,
    },
  };
  return await axios
    .get("http://localhost:8080/todos", config)
    .then(async (res) => {
      const mes = await JSON.parse(res.request.response);
      return mes.todos;
    });
}

export async function dataGetTasks() {
  const actoken = sessionStorage.getItem("actoken");
  const config = {
    headers: {
      authorization: `Bearer ${actoken}`,
    },
  };
  return await axios
    .get("http://localhost:8080/tasks", config)
    .then(async (res) => {
      const mes = await JSON.parse(res.request.response);
      // console.log(mes);
      // console.log("dataGetTasks:");
      // console.log(mes.tasks);
      return mes.tasks;
    });
}

export async function dataSendUpdatedTask({ _id, taskTitle }, todos) {
  const actoken = sessionStorage.getItem("actoken");
  const config = {
    headers: {
      authorization: `Bearer ${actoken}`,
    },
  };

  return await axios
    .post(`http://localhost:8080/tasks/${_id}/${taskTitle}`, { todos }, config)
    .then(async (res) => {
      const mes = await JSON.parse(res.request.response);

      // console.log(mes.message);
      return true;
    })
    .catch(async (err) => {
      const errMes = await JSON.parse(err.request.response).message;

      console.log("printing errMes: ");
      console.log(errMes);

      return false;
    });
}

export async function dataToggleToDo(todoId) {
  const actoken = sessionStorage.getItem("actoken");
  const config = {
    headers: {
      authorization: `Bearer ${actoken}`,
    },
  };

  return await axios
    .post(`http://localhost:8080/todos/${todoId}`, {}, config)
    .then(async (res) => {
      const mes = await JSON.parse(res.request.response);

      // console.log(mes.message);
      return true;
    })
    .catch(async (err) => {
      const errMes = await JSON.parse(err.request.response).message;

      console.log("printing errMes: ");
      console.log(errMes);

      return false;
    });
}

export async function dataDeleteTask(taskId) {
  const actoken = sessionStorage.getItem("actoken");
  const config = {
    headers: {
      authorization: `Bearer ${actoken}`,
    },
  };

  return await axios
    .delete(`http://localhost:8080/tasks/${taskId}`, config)
    .then(async (res) => {
      const mes = await JSON.parse(res.request.response);

      // console.log(mes.message);
      return true;
    })
    .catch(async (err) => {
      const errMes = await JSON.parse(err.request.response).message;

      console.log("printing errMes: ");
      console.log(errMes);

      return false;
    });
}

export async function dataUpdateBoards(mergedTodos) {
  // console.log(mergedTodos);
  const actoken = sessionStorage.getItem("actoken");
  const config = {
    headers: {
      authorization: `Bearer ${actoken}`,
    },
  };

  return await axios
    .post(`http://localhost:8080/todos/boardsUpdate`, { mergedTodos }, config)
    .then(async (res) => {
      const mes = await JSON.parse(res.request.response);

      // console.log(mes.message);
      return true;
    })
    .catch(async (err) => {
      const errMes = await JSON.parse(err.request.response).message;

      console.log("printing errMes: ");
      console.log(errMes);

      return false;
    });
}

export async function treesPull() {
  return await axios
    .get(`http://localhost:8080/trees`, config)
    .then(async (res) => {
      const mes = await JSON.parse(res.request.response);
      // console.log(mes.message);
      // console.log("mes.trees: " + mes.trees);
      return mes.trees;
    })
    .catch(async (err) => {
      const errMes = await JSON.parse(err.request.response).message;

      console.log("printing errMes: ");
      console.log(errMes);
    });
}

export async function generateTree(request) {
  return await axios
    .post(`http://localhost:8080/trees/gpt/new`, { request }, config)
    .then(async (res) => {
      const mes = await JSON.parse(res.request.response);
      return { status: true, treeId: mes.treeId };
    })
    .catch(async (err) => {
      const errMes = await JSON.parse(err.request.response).message;

      console.log("printing errMes: ");
      console.log(errMes);
      return {
        status: false,
        message: errMes,
      };
    });
}

export async function deleteNode(nodeId) {
  return await axios
    .post(`http://localhost:8080/nodes/delete`, { nodeId }, config)
    .then(async (res) => {
      const mes = await JSON.parse(res.request.response);
      return { status: true, message: mes.message };
    })
    .catch(async (err) => {
      const errMes = await JSON.parse(err.request.response).message;

      console.log("printing errMes: ");
      console.log(errMes);
      return {
        status: false,
        message: errMes,
      };
    });
}

export async function getHistory() {
  return await axios
    .get(`http://localhost:8080/chatHistory`, config)
    .then(async (res) => {
      const mes = await JSON.parse(res.request.response);
      return mes.chatHistory;
    })
    .catch(async (err) => {
      const errMes = await JSON.parse(err.request.response).message;
      console.log("printing errMes: ");
      console.log(errMes);
    });
}

export async function setFocusOnNode(nodeId) {
  return await axios
    .post(`http://localhost:8080/nodes/focus`, { nodeId }, config)
    .then(async (res) => {
      const mes = await JSON.parse(res.request.response);
      return {
        status: true,
        message: mes.message,
      };
    })
    .catch(async (err) => {
      const errMes = await JSON.parse(err.request.response).message;
      console.log("printing errMes: ");
      console.log(errMes);
      return {
        status: false,
        message: errMes,
      };
    });
}
