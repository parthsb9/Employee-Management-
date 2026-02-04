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

  // ---------- Inline style tokens (colors + typography) ----------
  const styles = {
    nav: {
      background: 'linear-gradient(135deg, #a40e9c 0%,  #a40e9c 0%, #0e8da4 0%)',
      borderBottom: '1px solid rgba(255,255,255,0.12)',
    },
    brand: {
      fontSize: '1.15rem',
      letterSpacing: '0.2px',
    },
    brandTagline: {
      fontSize: '0.8rem',
      fontWeight: 500,
      opacity: 0.9,
    },
    navLink: {
      fontSize: '0.98rem',
    },
    // 👇 NEW button styles
    addBtn: {
      // Text & background color changed
      color: '#ffffff',
      backgroundColor: '#0f766e', // teal/green
      borderColor: '#0f766e',
      fontSize: '0.9rem',
      fontWeight: 600,
    },
    addBtnHover: {
      backgroundColor: '#0b5f59',
      borderColor: '#0b5f59',
      color: '#ffffff',
    },
    profileBtn: {
      // Text & background color changed
      color: '#1f2937',              // slate-800
      backgroundColor: '#fde68a',    // soft yellow
      borderColor: '#fcd34d',
      fontSize: '0.9rem',
      fontWeight: 600,
    },
    profileBtnHover: {
      backgroundColor: '#fcd34d',
      borderColor: '#fbbf24',
      color: '#111827',
    },
    brandIcon: {
      width: 28,
      height: 28,
      fontSize: 14,
      fontWeight: 700,
      backgroundColor: '#ffffff',
      color: '#0e4da4',
    },
  }

  // Small helper to attach hover styles to inline buttons
  const withHover = (base, hover) => ({
    ...base,
    transition: 'background-color .18s ease, border-color .18s ease, color .18s ease',
    // This part requires inline event handling below to apply hover styles.
  })

  return (
    <nav
      ref={navbarRef}
      className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm"
      style={styles.nav}
    >
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/employees" style={styles.brand}>
          <BrandIcon style={styles.brandIcon} />
          <span className="fw-semibold">Employee Management</span>
          <span className="ms-2 badge rounded-pill bg-light text-primary" style={styles.brandTagline}>
            Portal
          </span>
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
              <NavLink
                className={({ isActive }) => navLinkClass(isActive)}
                to="/employees"
                style={styles.navLink}
              >
                <i className="bi bi-people me-1"></i> Employees
              </NavLink>
            </li>
          </ul>

          {/* Right side actions */}
          <div className="d-flex align-items-center gap-2">
            {/* Add button (custom styled) */}
            <HoverButton
              className="btn btn-sm"
              style={styles.addBtn}
              hoverStyle={styles.addBtnHover}
              onClick={() => navigate('/employees/new')}
              title="Add Employee"
            >
              <i className="bi bi-plus-circle me-1"></i>
              Add Employee
            </HoverButton>

            {/* Profile dropdown (trigger restyled) */}
            <HoverButton
              className="btn btn-sm dropdown-toggle"
              style={styles.profileBtn}
              hoverStyle={styles.profileBtnHover}
              id="profileMenu"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-person-circle me-1"></i> Profile
            </HoverButton>

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
    </nav>
  )
}

// Helper: consistent active styling
function navLinkClass(isActive) {
  return `nav-link${isActive ? ' active fw-semibold' : ''}`
}

// Tiny brand icon (no external assets)
function BrandIcon({ style }) {
  return (
    <span
      className="d-inline-flex justify-content-center align-items-center rounded-circle bg-light text-primary"
      style={style}
      title="EMS"
    >
      E
    </span>
  )
}

/**
 * Small helper component to support inline :hover styles without external CSS.
 * It merges `style` with `hoverStyle` on mouse enter/leave.
 */
import { useState } from 'react'
function HoverButton({ style, hoverStyle, children, ...props }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      {...props}
      style={{
        ...style,
        ...(hover ? hoverStyle : null),
        transition: 'background-color .18s ease, border-color .18s ease, color .18s ease',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </button>
  )
}

// Bootstrap Collapse instance getter (avoids global lookup pitfalls)
function bootstrapCollapseFrom(el) {
  const w = window
  const Collapse = w.bootstrap?.Collapse || w.bootstrap?.collapse || w.bootstrap
  try {
    return window.bootstrap ? window.bootstrap.Collapse.getOrCreateInstance(el) : null
  } catch {
    return null
  }
}
``