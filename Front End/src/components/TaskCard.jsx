

function TaskCard({ task, onEdit, onDelete, canModify }) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    "in progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800"
  };

  return (
    <li className="flex justify-between items-start bg-gray-50 px-4 py-3 rounded-lg border">
      <div className="flex-1">
        <h3 className="font-medium">{task.title}</h3>
        {task.description && (
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
        )}
        <div className="mt-2 flex items-center space-x-3">
          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status]}`}>
            {task.status}
          </span>
          <span className="text-xs text-gray-500">
            Created: {new Date(task.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
      {canModify && (
        <div className="space-x-2 text-sm">
          <button
            className="text-blue-600 hover:underline"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            className="text-red-600 hover:underline"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      )}
    </li>
  );
}

export default TaskCard