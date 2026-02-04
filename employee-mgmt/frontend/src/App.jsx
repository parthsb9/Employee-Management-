// // import { useState } from 'react'
// // import reactLogo from './assets/react.svg'
// // import viteLogo from '/vite.svg'
// // import './App.css'

// // function App() {
// //   const [count, setCount] = useState(0)

// //   return (
// //     <>
// //       <div>
// //         <a href="https://vite.dev" target="_blank">
// //           <img src={viteLogo} className="logo" alt="Vite logo" />
// //         </a>
// //         <a href="https://react.dev" target="_blank">
// //           <img src={reactLogo} className="logo react" alt="React logo" />
// //         </a>
// //       </div>
// //       <h1>Vite + React</h1>
// //       <div className="card">
// //         <button onClick={() => setCount((count) => count + 1)}>
// //           count is {count}
// //         </button>
// //         <p>
// //           Edit <code>src/App.jsx</code> and save to test HMR
// //         </p>
// //       </div>
// //       <p className="read-the-docs">
// //         Click on the Vite and React logos to learn more
// //       </p>
// //     </>
// //   )
// // }

// // export default App


// import { useState } from 'react'
// import Navbar from './components/Navbar'
// import EmployeeTable from './components/EmployeeTable'
// import EmployeeForm from './components/EmployeeForm'

// export default function App() {
//   const [editing, setEditing] = useState(null)
//   const [refreshKey, setRefreshKey] = useState(0)

//   return (
//     <>
//       <Navbar />
//       <div className="container my-4">
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h3 className="m-0">Employees</h3>
//           <button className="btn btn-success" onClick={() => setEditing({})}>+ Add Employee</button>
//         </div>

//         {editing ? (
//           <EmployeeForm
//             selected={editing.id ? editing : null}
//             onCancel={() => setEditing(null)}
//             onSaved={() => { setEditing(null); setRefreshKey(k => k + 1) }}
//           />
//         ) : (
//           <EmployeeTable key={refreshKey} onEdit={(e) => setEditing(e)} />
//         )}
//       </div>
//     </>
//   )
// }

import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import EmployeesPage from './pages/EmployeesPage'
import EmployeeEditPage from './pages/EmployeesEditPage'
import { ToastProvider } from './ui/ToastProvider'

export default function App() {
  return (
    <ToastProvider>
      <Navbar />
      <div className="container my-4">
        <Routes>
          <Route path="/" element={<Navigate to="/employees" replace />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/employees/new" element={<EmployeeEditPage mode="create" />} />
          <Route path="/employees/:id" element={<EmployeeEditPage mode="edit" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </ToastProvider>
  )
}

function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="text-center py-5">
      <h3 className="mb-3">Page not found</h3>
      <button className="btn btn-primary" onClick={() => navigate('/employees')}>Go to Employees</button>
    </div>
  )
}