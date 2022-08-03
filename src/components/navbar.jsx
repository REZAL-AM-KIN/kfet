import React from 'react';
import { Outlet, Link } from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

import am_kfet from '../assets/am_kfet.jpg';

function TopMenu() {

  return(
    <>
      <Navbar variant="light" bg="light" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              src= {am_kfet}
              alt="AM Kfet"
              width= "50px"
              height= "50px"
              className="d-inline-block align-top"
            />
            K'fet
          </Navbar.Brand>
          <Nav.Link as={Link} to="/pg">PG</Nav.Link>
          <Navbar.Toggle aria-controls="basig-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
    );
}



export default TopMenu;
