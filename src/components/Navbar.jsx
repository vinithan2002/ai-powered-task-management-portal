import { Link, useNavigate } from 'react-router-dom'

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">TaskManager</Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
              <button onClick={handleLogout} className="text-red-500 hover:text-red-700">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
              <Link to="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar