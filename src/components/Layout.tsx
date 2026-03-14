import { Link, NavLink, Outlet } from 'react-router-dom'
import ParticlesBackground from './ParticlesBackground'

export default function Layout() {
  return (
    <div className="appRoot">
      <ParticlesBackground />
      <div className="appShell">
        <header className="topNav">
          <Link to="/" className="brand">
            Bid<span className="brandAccent">Pulse</span>
          </Link>
          <nav className="navLinks">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/seller">Seller Dashboard</NavLink>
            <NavLink to="/seller/add">Add Product</NavLink>
          </nav>
        </header>
        <main className="content">
          <Outlet />
        </main>
        <footer className="footer">Offline auction demo • Spring Boot + React</footer>
      </div>
    </div>
  )
}
