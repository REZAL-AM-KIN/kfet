import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useKeyboardShortcut from '../hooks/keypresslib/useKeyboardShortcut';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Stack from 'react-bootstrap/Stack';


function Produits(props) {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [result, setResult] = useState([]);
  // produits display
  const [categories, setCategories] = useState([]);
  const [selectedCategorie, setSelectedCategorie] = useState();
  const [selectedProduit, setSelectedProduit] = useState();
  // recharge
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [methodes, setMethodes] = useState([]);
  const [methode, setMethode] = useState({});
  const montantRechargeRef = useRef();
  // lydia
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrcode, setQrcode] = useState("");
  const montantQrRef = useRef();

  const [montant, setMontant] = useState("");
  const [transactionDone, setTransactionDone] = useState();
  const [showTransactionModal, setShowTransactionModal] = useState(false);


  useKeyboardShortcut(["Alt", "x"], () => { handleQuitter() });
  useKeyboardShortcut(["Enter"], () => { handleDebucquer() });
  useKeyboardShortcut(["Alt", "l"], () => { setShowQrModal(true) });


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
    setSelectedCategorie(props.permissions.ipIdentification[0] || cat[0])
    // eslint-disable-next-line
  }, [result]);

  const optionMethode = async () => {
    try {
      const response = await axiosPrivate.options("recharges/");
      setMethodes(response?.data?.actions?.POST?.methode?.choices);
      // 2nd method is chosen by default (Espèces)
      setMethode(response?.data?.actions?.POST?.methode?.choices[1].value);
    } catch (error) {
      console.log(error);
    }
  }


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


  //////////////////
  //   Handler    //
  //////////////////

  const handleQuitter = () => {
    navigate('/');
  };

  const handleDebucquer = () => {
    // if a product is selected
    if (typeof selectedProduit !== "undefined") {
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
    // load all the recharge methodes and show the modal
    optionMethode()
    setShowRechargeModal(true);
  };

  const handleRechargerSubmit = (e) => {
    e.preventDefault();
    setShowRechargeModal(false);

    const createRecharge = async () => {
      try {
        const response = await axiosPrivate.post("recharges/",
          JSON.stringify({
            cible_id: props.pgId,
            montant: montant,
            methode: methode
          }));
        setTransactionDone(response);
        //trigger update after result
        props.setRequireUpdate(!props.requireUpdate);
      } catch (error) {
        setTransactionDone(error?.response);
      }
    }
    createRecharge();
    setShowTransactionModal(true);
    // reset the fields
    setMontant("");
  };

  const handleQrSubmit = (e) => {
    e.preventDefault();
    setShowQrModal(false);

    const createQr = async () => {
      try {
        const response = await axiosPrivate.post("rechargeslydia/",
          JSON.stringify({
            cible_id: props.pgId,
            montant: montant,
            qrcode: qrcode
          }));
        setTransactionDone(response);
        //trigger update after result
        props.setRequireUpdate(!props.requireUpdate);
      } catch (error) {
        setTransactionDone(error?.response);
      }
    }
    createQr();
    setShowTransactionModal(true);
    // reset the fields
    setMontant("");
    setQrcode("");
  }


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
          <Button onClick={() => { setShowQrModal(true) }}>Scan QR (Alt+L)</Button>
          <RechargeButton />
          <Button >annuler??</Button>
          <Button onClick={() => { handleQuitter() }}>Quitter (Alt+X)</Button>
          <CategorieList />
        </Stack>
      </Col>

      <TransactionStateModal />

      <Modal show={showRechargeModal} size="lg" centered onHide={() => setShowRechargeModal(false)} onEntered={() => { montantRechargeRef.current.focus() }}>
        <Modal.Header closeButton>
          <Modal.Title>Recharger un PG TODO PG NAME</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleRechargerSubmit}>
            <label htmlFor="montant">Montant</label>
            <input
              type="text"
              id="montant"
              placeholder="ex: 76€"
              value={montant}
              ref={montantRechargeRef}
              onChange={(e) => { setMontant(e.target.value); }}
              required />
            <select id="methode" value={methode} onChange={(e) => { setMethode(e.target.value); }} required>
              {methodes.map((methode, key) => {
                return (<option value={methode.value} key={key}>{methode.display_name}</option>)
              })}
            </select>
            <Button type="submit">Valider</Button>
          </form>
        </Modal.Body>
      </Modal >

      <Modal show={showQrModal} size="lg" centered onHide={() => setShowQrModal(false)} onEntered={() => { montantQrRef.current.focus() }}>
        <Modal.Header closeButton>
          <Modal.Title>Scanner un PG TODO PG NAME</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleQrSubmit}>
            <label htmlFor="montant">Montant</label>
            <input
              type="text"
              id="montant"
              placeholder="ex: 76€"
              value={montant}
              ref={montantQrRef}
              onChange={(e) => { setMontant(e.target.value); }}
              required />
            <input
              type="text"
              id="qrcode"
              placeholder="QR Code"
              value={qrcode}
              onChange={(e) => { setQrcode(e.target.value); }}
              required />
            <Button type="submit">Valider</Button>
          </form>
        </Modal.Body>
      </Modal >

    </Container >

  )
}

export default Produits;
