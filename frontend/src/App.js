import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editableTaskId, setEditableTaskId] = useState(null);
  const [editableTaskDescription, setEditableTaskDescription] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3001/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const createTask = async () => {
    try {
      if (newTask) {
        await axios.post("http://localhost:3001/tasks", {
          description: newTask,
        });
        fetchTasks();
        setNewTask("");
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const startEditingTask = (id, description) => {
    setEditableTaskId(id);
    setEditableTaskDescription(description);
  };

  const cancelEditingTask = () => {
    setEditableTaskId(null);
    setEditableTaskDescription("");
  };

  const updateTask = async (id) => {
    try {
      await axios.put(`http://localhost:3001/tasks/${id}`, {
        description: editableTaskDescription,
      });
      fetchTasks();
      setEditableTaskId(null);
      setEditableTaskDescription("");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <section className="vh-100 bg-light">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow">
              <div className="card-body">
                <h4 className="card-title text-center mb-4">To-Do App</h4>

                <div className="input-group mb-4">
                  <input
                    className="form-control"
                    placeholder="Enter a task..."
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                  />
                  <button
                    onClick={createTask}
                    className="btn btn-primary "
                    type="button"
                  >
                    Add Task
                  </button>
                </div>

                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col" style={{ width: "10%" }}>
                        Sr. No
                      </th>
                      <th scope="col" style={{ width: "65%" }}>
                        Tasks
                      </th>
                      <th scope="col" style={{ width: "25%" }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task, index) => (
                      <tr key={task.id}>
                        <td>{index + 1}</td>
                        <td>
                          {editableTaskId === task.id ? (
                            <input
                              type="text"
                              value={editableTaskDescription}
                              onChange={(e) =>
                                setEditableTaskDescription(e.target.value)
                              }
                              className="form-control"
                            />
                          ) : (
                            <span>{task.description}</span>
                          )}
                        </td>
                        <td>
                          {editableTaskId === task.id ? (
                            <React.Fragment>
                              <button
                                
                                onClick={() => updateTask(task.id)}
                                className="btn btn-success btn-sm me-3"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditingTask}
                                className="btn btn-secondary btn-sm"
                              >
                                Cancel
                              </button>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <button
                                onClick={() =>
                                  startEditingTask(task.id, task.description)
                                }
                                className="btn btn-primary btn-sm  me-3"
                              >
                                Update
                              </button>
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="btn btn-danger btn-sm"
                              >
                                Delete
                              </button>
                            </React.Fragment>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
