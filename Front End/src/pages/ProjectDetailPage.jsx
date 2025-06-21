import { useParams,  useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import axios from "axios";

export default function ProjectDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [currentUser] = useState("user123");
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState("all");
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjectAndTasks = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("token") || sessionStorage.getItem("token");
                // Fetch project details
                const projectRes = await axios.get(
                    `http://127.0.0.1:8000/api/projects/${id}/`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setProject(projectRes.data);

                // Fetch tasks for this project
                try {
                    const tasksRes = await axios.get(
                        `http://127.0.0.1:8000/api/projects/${id}/tasks/`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setTasks(tasksRes.data);
                } catch (taskError) {
                    setTasks([]);
                    console.log(taskError)// Optionally log taskError
                }
            } catch (error) {
                setProject(null);
                setTasks([]);
                console.error("Error fetching project or tasks:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjectAndTasks();
    }, [id]);

    const filteredTasks = filter === "all" ? tasks : tasks.filter(t => t.status === filter);
    const canModifyTask = task => task.createdBy === currentUser;

    const handleCreateTask = (newTask) => {
        const taskWithMetadata = {
            ...newTask,
            id: Date.now(),
            projectId: parseInt(id),
            createdBy: currentUser,
            created_at: new Date().toISOString(),
            status: "pending"
        };
        setTasks(prev => [...prev, taskWithMetadata]);
        setShowTaskForm(false);
    };

    const handleUpdateTask = (updatedTask) => {
        if (!canModifyTask(updatedTask)) {
            alert("You can only edit your own tasks");
            return;
        }
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
        setEditingTask(null);
        setShowTaskForm(false);
    };

    const handleDeleteTask = (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task || !canModifyTask(task)) {
            alert("You can only delete your own tasks");
            return;
        }
        setTasks(prev => prev.filter(t => t.id !== taskId));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <p className="text-gray-500">Loading project...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {project ? (
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Project Header */}
                    <div className="bg-white p-6 rounded-xl shadow">
                        <button 
                            onClick={() => navigate(-1)}
                            className="mb-4 text-blue-600 hover:text-blue-800"
                        >
                            ← Back to projects
                        </button>
                        <h1 className="text-2xl font-bold mb-1">{project.name}</h1>
                        <p className="text-gray-600 mb-2">{project.description}</p>
                        <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                            project.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                            {project.verified ? "Verified" : "Pending Verification"}
                        </span>
                    </div>

                    {/* Tasks Section */}
                    <div className="bg-white p-6 rounded-xl shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Tasks</h2>
                            <div className="flex space-x-4">
                                <div className="space-x-2">
                                    {["all", "pending", "in progress", "completed"].map(status => (
                                        <button
                                            key={status}
                                            className={`px-3 py-1 text-sm rounded-full ${
                                                filter === status ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                                            }`}
                                            onClick={() => setFilter(status)}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => {
                                        setEditingTask(null);
                                        setShowTaskForm(true);
                                    }}
                                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                >
                                    + New Task
                                </button>
                            </div>
                        </div>

                        {filteredTasks.length > 0 ? (
                            <ul className="space-y-3">
                                {filteredTasks.map(task => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onEdit={() => {
                                            if (canModifyTask(task)) {
                                                setEditingTask(task);
                                                setShowTaskForm(true);
                                            } else {
                                                alert("You can only edit your own tasks");
                                            }
                                        }}
                                        onDelete={() => handleDeleteTask(task.id)}
                                        canModify={canModifyTask(task)}
                                    />
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-sm">No tasks found.</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Project not found</p>
                    <button 
                        onClick={() => navigate("/dashboard")}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Back to Dashboard
                    </button>
                </div>
            )}

            {/* Task Form Modal */}
            {showTaskForm && (
                <TaskForm
                    task={editingTask}
                    onClose={() => {
                        setShowTaskForm(false);
                        setEditingTask(null);
                    }}
                    onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                />
            )}
        </div>
    );
}
