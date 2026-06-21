import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { taskService } from '../services/taskService'

const CreateTask = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    estimatedTime: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [aiGenerating, setAiGenerating] = useState(false)

  // Load task data if editing
  useEffect(() => {
    if (isEdit) {
      const loadTask = async () => {
        try {
          const task = await taskService.getTaskById(id)
          setForm({
            title: task.title,
            description: task.description || '',
            status: task.status,
            priority: task.priority,
            estimatedTime: task.estimatedTime || 0
          })
        } catch (err) {
          console.error('Failed to load task', err)
          setError('Could not load task')
        }
      }
      loadTask()
    }
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'estimatedTime' ? Number(value) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isEdit) {
        await taskService.updateTask(id, form)
      } else {
        await taskService.createTask(form)
      }
      navigate('/')
    } catch (err) {
      setError(err.message || 'Failed to save task')
      setLoading(false)
    }
  }

  const handleGenerateAI = async () => {
    if (!form.title.trim()) {
      alert('Please enter a title first')
      return
    }
    setAiGenerating(true)
    try {
      const generated = await taskService.generateTask(form.title)
      // generated is the full task created by backend with AI fields
      setForm(prev => ({
        ...prev,
        description: generated.description || '',
        priority: generated.priority || 'MEDIUM',
        estimatedTime: generated.estimatedTime || 0
      }))
    } catch (err) {
      alert('AI generation failed: ' + err.message)
    } finally {
      setAiGenerating(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Task' : 'Create New Task'}</h2>
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Est. Time (hours)</label>
            <input
              type="number"
              name="estimatedTime"
              value={form.estimatedTime}
              onChange={handleChange}
              min="0"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : (isEdit ? 'Update' : 'Generate')}
          </button>
          {!isEdit && (
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={aiGenerating}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:opacity-50 flex items-center"
            >
              {aiGenerating ? 'Generating...' : 'AI Assist'}
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateTask