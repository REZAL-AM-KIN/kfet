import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';


function SearchModal(props) {
  const axiosPrivate = useAxiosPrivate();
  const [err, setErr] = useState("");
  const [consommateurList, setConsommateurList] = useState([]);
  const URL = 'consommateurs/';

  const [search, setSearch] = useState("");
  const searchRef = useRef();
  const [suggestionShow, setSuggestionShow] = useState(false);

  // get all the consommateurs to search faster when needed
  useEffect(() => {
    const controller = new AbortController();
    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get(URL);
        setConsommateurList(response.data.results);
      } catch (error) {
        setErr(error.message);
        console.log(error);
      }
    }
    getUsers();
    return () => {
      controller.abort();
    }
    // eslint-disable-next-line
  }, []);

  console.log('calculating consommatuer filter');
  // we filter the consommateur list so it only remains the suggestion and we don't need to process the entire thing
  // TODO: it processes 2 times each render. only need to process after each update of search
  // piste : reducers??
  let filteredConsommateur = consommateurList.filter((line) => {
    let search_fields = ["nom", "bucque", "fams", "prenom", "proms"];
    let result = false;
    for (var field of search_fields) {
      if (line[field].toLowerCase().includes(search.toLowerCase())) {
        result = true;
        break
      }
    }
    return result
  });

  // process the consommater filtered list to create suggestions
  let suggestions = filteredConsommateur.map((line) => {
    return (<Dropdown.Item key={line.id} as={Link} to={"/pg/" + line.id} onClick={() => { handleExit() }}>{line.bucque + " " + line.fams + " " + line.nom + " " + line.prenom + " " + line.proms}</Dropdown.Item>);
  });

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    // update suggestions visibility at each update of search
    if (search !== "" && suggestions.length) {
      setSuggestionShow(true);
    } else {
      setSuggestionShow(false);
    }
    // eslint-disable-next-line
  }

  //
  const handleExit = () => {
    props.setshow(false)
    setSearch("")
    setSuggestionShow(false)
  }

  return (
    <Modal show={props.show} onHide={() => handleExit()} size="lg" centered onEntered={() => searchRef.current.focus()}>

      <Modal.Header closeButton>
        <Modal.Title>Rechercher un PG</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Dropdown show={suggestionShow}>
          <input
            type="text"
            ref={searchRef}
            autoComplete="off"
            onChange={handleSearchChange}
            value={search}
            required
            placeholder="ex: Rhadamanthe 76"
            className="form-control form-control-lg"
          />
          <Dropdown.Menu>
            {suggestions}
          </Dropdown.Menu>
        </Dropdown>
        {err}
      </Modal.Body>

    </Modal >
  )

}

export default SearchModal;
