import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
    Navbar,
    NavbarBrand,
    NavbarToggler,
    Nav,
    NavItem,
    NavLink,
    Collapse
  } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './PageNav.css'

const PageNav = ({token, onHomepage}) => {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(true);

  const toggleNavbar = () => setCollapsed(!collapsed);
  
  return (
    <div>
      {onHomepage === false && <Navbar className='navbar-expand-lg' >
        <NavbarBrand></NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} className="" />
        <Collapse isOpen={!collapsed} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem className="me-3">
              <NavLink className={`nav-link ${location.pathname === "/search" ? "active" : ""}`} href="/search">Create New Trip</NavLink>
            </NavItem>
            <NavItem className="me-3">
              <NavLink className={`nav-link ${location.pathname === "/trips" ? "active" : ""}`} href="/trips">
                View Upcoming Trips
              </NavLink>
            </NavItem>
            {(token === '') && <NavItem className="me-3">
              <NavLink className={`nav-link ${location.pathname === "/signup" ? "active" : ""}`} href="/signup">
                Sign Up
              </NavLink>
            </NavItem>}
            {(token !== '') && <NavItem className="me-3">
              <NavLink href="/logout">
                Logout
              </NavLink>
            </NavItem>}
            {(token === '') && <NavItem className="me-3">
              <NavLink href="/login">
                Login
              </NavLink>
            </NavItem>}
          </Nav>
        </Collapse>
      </Navbar>}
    </div>
  )
}

export default PageNav