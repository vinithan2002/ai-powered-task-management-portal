import { Link } from 'react-router-dom'
import { taskService } from '../services/taskService'

const TaskCard = ({ task, onTaskUpdated }) => {
  const statusColors = {
    TODO: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    DONE: 'bg-green-100 text-green-800'
  }

  const priorityColors = {
    LOW: 'bg-gray-100 text-gray-800',
    MEDIUM: 'bg-orange-100 text-orange-800',
    HIGH: 'bg-red-100 text-red-800'
  }

  const handleStatusChange = async (newStatus) => {
    try {
      await taskService.updateStatus(task.id, newStatus)
      onTaskUpdated()
    } catch (error) {
      console.error('Failed to update status', error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(task.id)
        onTaskUpdated()
      } catch (error) {
        console.error('Failed to delete task', error)
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg transition">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      <p className="text-gray-600 mt-2 text-sm">{task.description || 'No description'}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>
        {task.estimatedTime && (
          <span className="text-xs text-gray-500"> Time: {task.estimatedTime}h</span>
        )}
        <span className="text-xs text-gray-400">
          {new Date(task.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="text-sm border rounded px-2 py-1"
        >
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>
        <Link to={`/edit/${task.id}`} className="text-sm text-blue-600 hover:underline">Edit</Link>
        <button onClick={handleDelete} className="text-sm text-red-600 hover:underline">Delete</button>
      </div>
    </div>
  )
}

export default TaskCard