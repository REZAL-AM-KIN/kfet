import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import useKeyboardShortcut from '../hooks/keypresslib/useKeyboardShortcut';
import SearchModal from './SearchModal'

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import am_kfet from '../assets/am_kfet.jpg';


function TopMenu() {

  const [searchShow, setSearchShow] = useState(false);
  // bind to alt p
  useKeyboardShortcut(["Alt", "p"], () => { setSearchShow(true) });

  return (
    <>
      <Navbar variant="light" bg="light" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              src={am_kfet}
              alt="AM Kfet"
              width="30px"
              height="30px"
              className=""
            />
            K'fet
          </Navbar.Brand>

          <Button variant="primary" onClick={() => { setSearchShow(true) }}>
            Rechercher un PG (Alt+p)
          </Button>

          <SearchModal show={searchShow} onHide={() => setSearchShow(false)} />

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
