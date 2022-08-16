import { useState } from 'react';

import { Outlet, Link } from 'react-router-dom';
import useKeyboardShortcut from '../hooks/keypresslib/useKeyboardShortcut';
import SearchModal from './SearchModal'

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

import am_kfet from '../assets/am_kfet.jpg';


function TopMenu() {

  const [searchShow, setSearchShow] = useState(false);
  // bind to alt p
  useKeyboardShortcut(["Alt", "p"], () => { setSearchShow(true) });

  return (
    <>
      <Navbar variant="light" bg="light" expand="md" className="pe-3 ps-3">
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
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Button variant="primary" onClick={() => { setSearchShow(true) }}>
          Rechercher un PG (Alt+p)
        </Button>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="w-75 d-flex justify-content-evenly">
            <Nav.Link as={Link} to="">Carte des Produits</Nav.Link>
            <Nav.Link as={Link} to="">Statistiques</Nav.Link>
            <Nav.Link as={Link} to="">Infos</Nav.Link>
          </Nav>
        </Navbar.Collapse>

        <SearchModal show={searchShow} setshow={setSearchShow} />
      </Navbar>
      <Outlet />
    </>
  );
}



export default TopMenu;
