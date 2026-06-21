import { useState, useEffect } from 'react'
import { taskService } from '../services/taskService'

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await taskService.getAllTasks()
        setTasks(data)
      } catch (error) {
        console.error('Failed to fetch all tasks', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) return <div>Loading admin data...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Total Tasks</h3>
          <p className="text-3xl font-bold">{tasks.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">TODO</h3>
          <p className="text-3xl font-bold">{tasks.filter(t => t.status === 'TODO').length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">DONE</h3>
          <p className="text-3xl font-bold">{tasks.filter(t => t.status === 'DONE').length}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">All Tasks</h3>
        <ul className="divide-y">
          {tasks.map(task => (
            <li key={task.id} className="py-2 flex justify-between">
              <span>{task.title}</span>
              <span className="text-sm text-gray-500">{task.status} - {task.priority}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AdminDashboard