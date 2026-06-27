import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import api from "../api/axios";

const Dashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "Medium",
    estimatedTime: 1,
  });

  const [message, setMessage] = useState("");
  const [aiPlan, setAiPlan] = useState("");
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [filter, setFilter] = useState("All");

  const [editingTaskId, setEditingTaskId] = useState(null);

  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "Medium",
    estimatedTime: 1,
  });

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status !== "Completed"
  ).length;

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "High"
  ).length;

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    if (filter === "Pending") return task.status !== "Completed";
    if (filter === "Completed") return task.status === "Completed";
    if (filter === "High") return task.priority === "High";
    return true;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getTasks = async () => {
    try {
      const res = await api.get("/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(res.data.tasks);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to fetch tasks");
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/tasks", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(res.data.message);

      setFormData({
        title: "",
        description: "",
        deadline: "",
        priority: "Medium",
        estimatedTime: 1,
      });

      getTasks();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add task");
    }
  };

  const handleGeneratePlan = async () => {
    try {
      setLoadingPlan(true);
      setAiPlan("");
      setMessage("");

      const res = await api.post(
        "/api/ai/plan",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAiPlan(res.data.plan);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to generate AI plan");
    } finally {
      setLoadingPlan(false);
    }
  };

  const handleMarkCompleted = async (taskId) => {
    try {
      const res = await api.put(
        `/api/tasks/${taskId}`,
        { status: "Completed" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);
      getTasks();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await api.delete(`/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(res.data.message);
      getTasks();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete task");
    }
  };

  const handleStartEdit = (task) => {
    setEditingTaskId(task._id);

    setEditFormData({
      title: task.title,
      description: task.description || "",
      deadline: task.deadline ? task.deadline.split("T")[0] : "",
      priority: task.priority,
      estimatedTime: task.estimatedTime,
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateTask = async (taskId) => {
    try {
      const res = await api.put(`/api/tasks/${taskId}`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(res.data.message);
      setEditingTaskId(null);
      getTasks();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update task");
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand-box">
            <div className="brand-icon">DD</div>

            <div>
              <h2>Deadline Defender</h2>
              <p>AI Productivity Companion</p>
            </div>
          </div>

          <div className="sidebar-user">
            <p className="small-label">Signed in as</p>
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
          </div>

          <div className="sidebar-menu">
            <a href="#overview">Overview</a>
            <a href="#add-task">Add Task</a>
            <a href="#ai-plan">AI Plan</a>
            <a href="#tasks">My Tasks</a>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <section className="hero-section" id="overview">
          <div>
            <p className="eyebrow">Smart deadline management</p>

            <h1>Plan better. Finish faster. Never miss deadlines.</h1>

            <p>
              Add your tasks, track progress, and let Gemini generate a
              personalized productivity plan based on urgency, priority, and
              effort.
            </p>
          </div>

          <div className="hero-card">
            <span>Today’s Focus</span>

            <h3>
              {pendingTasks > 0
                ? `${pendingTasks} tasks need your attention`
                : "All tasks completed"}
            </h3>

            <p>Use the AI planner to decide what to complete first.</p>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span>Total Tasks</span>
            <h2>{totalTasks}</h2>
            <p>All saved tasks</p>
          </div>

          <div className="stat-card">
            <span>Pending</span>
            <h2>{pendingTasks}</h2>
            <p>Still need action</p>
          </div>

          <div className="stat-card">
            <span>Completed</span>
            <h2>{completedTasks}</h2>
            <p>Finished tasks</p>
          </div>

          <div className="stat-card">
            <span>High Priority</span>
            <h2>{highPriorityTasks}</h2>
            <p>Urgent focus items</p>
          </div>
        </section>

        <section className="content-card" id="add-task">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Create task</p>
              <h2>Add New Task</h2>
              <p className="section-description">
                Add task details so the AI can understand deadlines, effort,
                and priority correctly.
              </p>
            </div>
          </div>

          <form onSubmit={handleAddTask} className="task-form">
            <div className="form-group">
              <label>Task Title</label>
              <input
                type="text"
                name="title"
                placeholder="Example: Complete backend APIs"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Task Description</label>
              <input
                type="text"
                name="description"
                placeholder="Example: Finish authentication and task APIs"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Deadline Date</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Priority Level</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Estimated Hours Needed</label>
              <input
                type="number"
                name="estimatedTime"
                placeholder="Example: 3"
                min="1"
                value={formData.estimatedTime}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="add-task-btn">
              Add Task
            </button>
          </form>

          {message && <p className="message-box">{message}</p>}
        </section>

        <section className="content-card ai-card" id="ai-plan">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Gemini powered</p>
              <h2>AI Productivity Plan</h2>
              <p className="section-description">
                Generate a smart plan based on your saved tasks.
              </p>
            </div>

            <button onClick={handleGeneratePlan} disabled={loadingPlan}>
              {loadingPlan ? "Generating..." : "Generate AI Plan"}
            </button>
          </div>

          {aiPlan ? (
            <div className="ai-plan-box">
              <ReactMarkdown>{aiPlan}</ReactMarkdown>
            </div>
          ) : (
            <div className="empty-ai-box">
              <h3>No AI plan generated yet</h3>
              <p>
                Add your tasks and click generate to receive a personalized plan.
              </p>
            </div>
          )}
        </section>

        <section className="content-card" id="tasks">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Task manager</p>
              <h2>My Tasks</h2>
              <p className="section-description">
                Track your saved tasks and filter them by status or priority.
              </p>
            </div>
          </div>

          <div className="filter-tabs">
            <button
              className={filter === "All" ? "active-tab" : ""}
              onClick={() => setFilter("All")}
            >
              All
            </button>

            <button
              className={filter === "Pending" ? "active-tab" : ""}
              onClick={() => setFilter("Pending")}
            >
              Pending
            </button>

            <button
              className={filter === "Completed" ? "active-tab" : ""}
              onClick={() => setFilter("Completed")}
            >
              Completed
            </button>

            <button
              className={filter === "High" ? "active-tab" : ""}
              onClick={() => setFilter("High")}
            >
              High Priority
            </button>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="empty-task-box">
              <h3>No tasks found</h3>
              <p>Add a task or change the selected filter.</p>
            </div>
          ) : (
            <div className="task-list">
              {filteredTasks.map((task) => (
                <div key={task._id} className="task-card">
                  {editingTaskId === task._id ? (
                    <div className="edit-task-box">
                      <h3>Edit Task</h3>

                      <div className="task-form">
                        <div className="form-group">
                          <label>Task Title</label>
                          <input
                            type="text"
                            name="title"
                            value={editFormData.title}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div className="form-group">
                          <label>Task Description</label>
                          <input
                            type="text"
                            name="description"
                            value={editFormData.description}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div className="form-group">
                          <label>Deadline Date</label>
                          <input
                            type="date"
                            name="deadline"
                            value={editFormData.deadline}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div className="form-group">
                          <label>Priority Level</label>
                          <select
                            name="priority"
                            value={editFormData.priority}
                            onChange={handleEditChange}
                          >
                            <option value="Low">Low Priority</option>
                            <option value="Medium">Medium Priority</option>
                            <option value="High">High Priority</option>
                          </select>
                        </div>

                        <div className="form-group full-width">
                          <label>Estimated Hours Needed</label>
                          <input
                            type="number"
                            name="estimatedTime"
                            min="1"
                            value={editFormData.estimatedTime}
                            onChange={handleEditChange}
                          />
                        </div>
                      </div>

                      <div className="task-actions">
                        <button
                          className="complete-btn"
                          onClick={() => handleUpdateTask(task._id)}
                        >
                          Save Changes
                        </button>

                        <button
                          className="delete-btn"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="task-top">
                        <div>
                          <h3>{task.title}</h3>
                          <p>{task.description || "No description added"}</p>
                        </div>

                        <span
                          className={`priority-badge priority-${task.priority.toLowerCase()}`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <div className="task-meta">
                        <span>
                          Deadline:{" "}
                          {new Date(task.deadline).toLocaleDateString()}
                        </span>

                        <span>Estimated: {task.estimatedTime} hrs</span>

                        <span>Status: {task.status}</span>
                      </div>

                      <div className="task-actions">
                        {task.status !== "Completed" && (
                          <button
                            className="complete-btn"
                            onClick={() => handleMarkCompleted(task._id)}
                          >
                            Mark Completed
                          </button>
                        )}

                        <button
                          className="edit-btn"
                          onClick={() => handleStartEdit(task)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteTask(task._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;