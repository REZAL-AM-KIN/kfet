import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useKeyboardShortcut from '../hooks/keypresslib/useKeyboardShortcut';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Stack from 'react-bootstrap/Stack';


function Produits(props) {
  const axiosPrivate = useAxiosPrivate();
  const [result, setResult] = useState([]);

  const [categories, setCategories] = useState([]);
  const [selectedCategorie, setSelectedCategorie] = useState();
  const [selectedProduit, setSelectedProduit] = useState(0);

  const [transactionDone, setTransactionDone] = useState();
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);


  useKeyboardShortcut(["Alt", "x"], () => { handleQuitter() });
  useKeyboardShortcut(["Enter"], () => { handleDebucquer() });


  useEffect(() => {
    const controller = new AbortController();
    const getProduits = async () => {
      try {
        const response = await axiosPrivate.get("produits/");
        setResult(response.data.results);
      } catch (error) {
        console.log(error);
      }
    }
    getProduits()
    return () => {
      controller.abort();
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    // create the categories list and the categorie selected
    var cat = [];
    for (var line of result) {
      if (!cat.includes(line["nom_entite"])) {
        if (props.permissions.all || props.permissions.groupes.includes(line["nom_entite"])) {
          cat.push(line["nom_entite"]);
        }
      }
    }
    setCategories(cat);
    // if the ip is registered once, it is still in a list and it's the first element
    // if the ip is registered multiple times, we take the first one
    setSelectedCategorie(props.permissions.ipIdentification[0])
    // eslint-disable-next-line
  }, [result]);


  //////////////////
  //   Elements   //
  //////////////////

  const CategorieList = () => {
    if (categories.length > 1) {
      return (
        <select defaultValue={selectedCategorie}>
          {categories.map((categorie, key) => {
            return (<option onClick={() => { setSelectedCategorie(categorie) }} key={key}>{categorie}</option>)
          })}
        </select>
      )
    } else {
      return (<div>{selectedCategorie}</div>)
    }
  }

  const ProduitsList = () => {
    var produits = []
    for (var line of result) {
      if (line["nom_entite"] === selectedCategorie) {
        produits.push(line)
      }
    }
    return (
      produits.map((produit) => {
        return (<option key={produit.id} value={produit.id}>{produit.raccourci} | {produit.nom} - {produit.prix}€</option>)
      })
    );
  }

  const TransactionStateModal = () => {
    var title = "Transaction Effectuée!";
    var body = "";

    if (transactionDone?.status === 201) {
      //Transaction ok:
      const data = transactionDone?.data;
      body = data.nom_produit + " à été bucqué //TODO";
    } else {
      //Transaction pas ok:
      title = transactionDone?.status + " : " + transactionDone?.statusText;
      body = transactionDone?.data;
    }
    return (
      <Modal show={showTransactionModal} size="lg" centered onHide={() => setShowTransactionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {body}
        </Modal.Body>
      </Modal >
    );
  }

  const RechargeButton = () => {
    if (props.permissions.recharge) {
      return (<Button onClick={() => { handleRecharger() }}>Recharger</Button>);
    }
  }

  const RechargeModal = () => {
    return (
      <Modal show={showRechargeModal} size="lg" centered onHide={() => setShowRechargeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Recharger un PG TODO PG NAME</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          TODO BODY RECHARGE
        </Modal.Body>
      </Modal >
    )
  }


  //////////////////
  //   Handler    //
  //////////////////

  const handleQuitter = () => {
    window.location.href = "/";
  };

  const handleDebucquer = () => {
    if (selectedProduit !== 0) {
      console.log("submit pg: " + props.pgId + " produit: " + selectedProduit);
      const createBucquage = async () => {
        try {
          const response = await axiosPrivate.post("bucquages/",
            JSON.stringify({
              cible_bucquage: props.pgId,
              id_produit: selectedProduit
            }));
          setTransactionDone(response);
          //trigger update after result
          props.setRequireUpdate(!props.requireUpdate);
        } catch (error) {
          setTransactionDone(error?.response);
        }
      }
      createBucquage()
      setShowTransactionModal(true);
    }
  };

  const handleRecharger = () => {
    console.log("RECHARGE")




  };

  //////////////////
  //   Render     //
  //////////////////

  return (

    <Container fluid className="d-flex justify-content-center">
      <Col md={6} className="me-4">
        <Container className="mb-2">
          <Row>
            <select onChange={(e) => { setSelectedProduit(e.target.value) }} value={selectedProduit} autoFocus size={10} >
              <ProduitsList />
            </select>
          </Row>
        </Container>
      </Col>

      <Col md={4}>
        <Stack gap={1} className="">
          <Button onClick={() => { handleDebucquer() }}>Débucquer (Entrée)</Button>
          <Button >Scan QR (Alt+L)</Button>
          <RechargeButton />
          <Button >annuler??</Button>
          <Button onClick={() => { handleQuitter() }} type="button">Quitter (Alt+X)</Button>
          <CategorieList />
        </Stack>
      </Col>

      <TransactionStateModal />

    </Container >

  )
}

export default Produits;
