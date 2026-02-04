// import { Link, NavLink } from 'react-router-dom'

// export default function Navbar() {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
//       <div className="container">
//         <Link className="navbar-brand" to="/employees">Employee Management</Link>
//         <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
//           <span className="navbar-toggler-icon"></span>
//         </button>
//         <div id="nav" className="collapse navbar-collapse">
//           <ul className="navbar-nav ms-auto">
//             <li className="nav-item">
//               <NavLink className="nav-link" to="/employees">Employees</NavLink>
//             </li>
//             <li className="nav-item">
//               <NavLink className="nav-link" to="/employees/new">Add</NavLink>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   )
// }
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const navbarRef = useRef(null)

  // Auto-close the collapse after navigation on mobile
  useEffect(() => {
    const el = navbarRef.current
    if (!el) return
    const collapse = el.querySelector('.navbar-collapse')
    if (!collapse) return
    const bsCollapse = bootstrapCollapseFrom(collapse)
    if (bsCollapse && collapse.classList.contains('show')) {
      bsCollapse.hide()
    }
  }, [location.pathname])

  return (
    <nav ref={navbarRef} className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/employees">
          <BrandIcon />
          <span className="fw-semibold">Employee Management</span>
        </Link>

        {/* Hamburger */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible content */}
        <div className="collapse navbar-collapse" id="mainNav">
          {/* Left side links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className={({isActive}) => navLinkClass(isActive)} to="/employees">
                <i className="bi bi-people me-1"></i> Employees
              </NavLink>
            </li>
            {/* You can add more nav sections later, e.g., Departments, Reports, etc. */}
          </ul>

          {/* Right side actions */}
          <div className="d-flex align-items-center gap-2">
            {/* Search (optional; remove if not needed) */}
            {/* <form className="d-none d-lg-block">
              <input className="form-control form-control-sm" type="search" placeholder="Search…" aria-label="Search" />
            </form> */}

            {/* Add button */}
            <button
              className="btn btn-light btn-sm"
              onClick={() => navigate('/employees/new')}
              title="Add Employee"
            >
              <i className="bi bi-plus-circle me-1"></i>
              Add Employee
            </button>

            {/* Profile dropdown (placeholder) */}
            <div className="dropdown">
              <button
                className="btn btn-outline-light btn-sm dropdown-toggle"
                type="button"
                id="profileMenu"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person-circle me-1"></i> Profile
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileMenu">
                <li><button className="dropdown-item" type="button" disabled>Signed in as: Gaurav</button></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" type="button" disabled>Settings</button></li>
                <li><button className="dropdown-item" type="button" disabled>Help</button></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" type="button" disabled>Sign out</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Helper: consistent active styling
function navLinkClass(isActive) {
  return `nav-link${isActive ? ' active fw-semibold' : ''}`
}

// Tiny brand icon (no external assets)
function BrandIcon() {
  return (
    <span
      className="d-inline-flex justify-content-center align-items-center rounded-circle bg-light text-primary"
      style={{ width: 28, height: 28, fontSize: 14, fontWeight: 700 }}
      title="EMS"
    >
      E
    </span>
  )
}

// Bootstrap Collapse instance getter (avoids global lookup pitfalls)
function bootstrapCollapseFrom(el) {
  // eslint-disable-next-line no-undef
  const w = window
  const Collapse = w.bootstrap?.Collapse || w.bootstrap?.collapse || w.bootstrap
  try {
    // eslint-disable-next-line no-undef
    return window.bootstrap ? window.bootstrap.Collapse.getOrCreateInstance(el) : null
  } catch {
    // Fallback if bootstrap isn't on window (shouldn't happen when importing bundle JS)
    return null
  }
}