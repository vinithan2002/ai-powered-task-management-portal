import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import TaskCard from '../components/TaskCard'
import { taskService } from '../services/taskService'

const Dashboard = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  // Pagination state
  const [page, setPage] = useState(0)
  const [size] = useState(6) // tasks per page
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  const fetchTasks = async () => {
    setLoading(true)
    try {
      let data

      // Decide which endpoint to call based on filter and search term
      if (searchTerm.trim()) {
        // Use search endpoint (with pagination)
        data = await taskService.searchTasks(searchTerm, page, size)
      } else if (filter !== 'ALL') {
        // Use status filter endpoint (with pagination)
        data = await taskService.getTasksByStatus(filter, page, size)
      } else {
        // Get all tasks with pagination
        data = await taskService.getAllTasks(page, size, 'createdAt,desc')
      }

      setTasks(data.content || [])
      setTotalPages(data.totalPages || 0)
      setTotalElements(data.totalElements || 0)
    } catch (error) {
      console.error('Failed to fetch tasks', error)
      setTasks([])
      setTotalPages(0)
      setTotalElements(0)
    } finally {
      setLoading(false)
    }
  }

  // Refetch when page, filter, or searchTerm changes
  useEffect(() => {
    fetchTasks()
  }, [page, filter, searchTerm])

  const handleTaskUpdated = () => {
    fetchTasks()
  }

  // Reset page to 0 when filter or search changes
  const handleFilterChange = (e) => {
    setFilter(e.target.value)
    setPage(0)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setPage(0)
  }

  if (loading) return <div className="text-center">Loading tasks...</div>

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <Link to="/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + New Task
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded px-3 py-2 flex-1 min-w-[200px]"
        />
        <select
          value={filter}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="ALL">All</option>
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center">No tasks found. Create one!</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} onTaskUpdated={handleTaskUpdated} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm">
                Page {page + 1} of {totalPages} ({totalElements} tasks)
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Dashboard