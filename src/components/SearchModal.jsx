import { useState, useRef, useEffect } from 'react';
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
    return (<Dropdown.Item key={line.id} href={"/pg/" + line.id}>{line.bucque + " " + line.fams + " " + line.nom + " " + line.prenom + " " + line.proms}</Dropdown.Item>);
  });

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  // update suggestions visibility at each update of search
  useEffect(() => {
    if (search !== "" && suggestions.length) {
      setSuggestionShow(true);
    } else {
      setSuggestionShow(false);
    }
    // eslint-disable-next-line
  }, [search]);

  //
  const handleSubmit = (e) => {
    //prevent the submition of the form
    e.preventDefault();
    console.log("search", search)
  }

  return (
    <Modal{...props} size="lg" centered onEntered={() => searchRef.current.focus()} onExit={() => setSearch("")}>

      <Modal.Header closeButton>
        <Modal.Title>Rechercher un PG</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Dropdown show={suggestionShow}>
          <form onSubmit={handleSubmit}>
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
          </form>
        </Dropdown>
      </Modal.Body>

    </Modal >
  )

}

export default SearchModal;
