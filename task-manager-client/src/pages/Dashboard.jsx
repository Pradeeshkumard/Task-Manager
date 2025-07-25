import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalTask, setTotalTask] = useState(0);
  const [status, setStatus] = useState("Pending");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/tasks?search=${search}&page=${page}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const taskArray = Array.isArray(res.data.tasks) ? res.data.tasks : [];
      setTasks(taskArray);
      setTotalPages(Math.ceil(res.data.total / 10));
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, page]);

  const addTask = async () => {
    if (!name || !description || !startDate || !endDate || !totalTask) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/tasks",
        {
          name,
          description,
          startDate,
          endDate,
          totalTask,
          status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setName("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setTotalTask(0);
      setStatus("Pending");

      fetchTasks();
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const toggleStatus = async (task) => {
    const nextStatus =
      task.status === "Pending"
        ? "In Progress"
        : task.status === "In Progress"
        ? "Completed"
        : "Pending";

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/tasks/${task._id}`,
        {
          ...task,
          status: nextStatus,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Task Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <input
        type="text"
        placeholder="Search tasks by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div>
        <h3>Add Task</h3>
        <input
          type="text"
          placeholder="Task Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <input
          type="number"
          placeholder="Total Sub Tasks"
          value={totalTask}
          onChange={(e) => setTotalTask(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>

      <h3>Your Tasks</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Total Tasks</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="8">No tasks found.</td>
            </tr>
          ) : (
            tasks.map((task, index) => (
              <tr key={task._id}>
                <td>{(page - 1) * 10 + index + 1}</td>
                <td>{task.name}</td>
                <td>{task.description}</td>
                <td>{new Date(task.startDate).toLocaleDateString()}</td>
                <td>{new Date(task.endDate).toLocaleDateString()}</td>
                <td>{task.totalTask}</td>
                <td>{task.status}</td>
                <td>
                  <button onClick={() => toggleStatus(task)}>Toggle</button>
                  <button onClick={() => deleteTask(task._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
          style={{ marginRight: "10px" }}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          style={{ marginLeft: "10px" }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
