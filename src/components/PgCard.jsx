import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate'

// react-bootstrap css
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function PG(props) {
  const axiosPrivate = useAxiosPrivate();

  const [err, setErr] = useState("");

  const [prenom, setPrenom] = useState("");
  const [comment, setComment] = useState("");
  const [bucque, setBucque] = useState("");
  const [fams, setFams] = useState("");
  const [proms, setProms] = useState("");
  const [nom, setNom] = useState("");
  const [solde, setSolde] = useState("");
  const [dep, setDep] = useState("");


  useEffect(() => {
    console.log("UPDATE: PG");
    // make the api call for pg info:
    const URL = props.pgId ? "consommateurs/" + props.pgId + "/" : "utilisateur/";
    const controller = new AbortController();
    const getUser = async () => {
      try {
        const response = await axiosPrivate.get(URL);
        if (response.data) {
          setNom(response.data.nom);
          setSolde(response.data.solde);
          setDep(response.data.totaldep);
          setBucque(response.data.bucque);
          setFams(response.data.fams);
          setComment(response.data.commentaire);
          setProms(response.data.proms);
          setPrenom(response.data.prenom);
        } else {
          setErr("Pas de PG activé correspondant")
        }
      } catch (error) {
        setErr(error.message);
        console.log(error);
      }
    }
    getUser();
    return () => {
      controller.abort();
    }
    // eslint-disable-next-line
  }, [props.pgId, props.requireUpdate]);


  const goodCard = () => {
    // return a card with all info about the pg
    return (
      <Container fluid className="p-4">
        <Card style={{ borderRadius: '1rem' }} bg={"light"} border={+(solde) >= 0 ? "success" : "danger"} text={+(solde) >= 0 ? "success" : "danger"} >
          <Card.Body className="">
            <Row>
              <Col sm={7}>
                <Card.Title className="fs-1 fw-bold lh-1">{bucque} {fams}</Card.Title>
                <Card.Subtitle className="fs-2 fw-normal lh-1">{nom} {prenom}</Card.Subtitle>
              </Col>
              <Col sm={4}>
                <Card.Title className="fs-1 fw-bolder lh-1">{proms}</Card.Title>
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col>
                <Card.Text className="fs-4 fw-light">
                  {comment}
                </Card.Text>
              </Col>
              <Col>

                <Card.Text className="text-end fs-1 lh-1">{solde} €</Card.Text>
              </Col>
            </Row>

          </Card.Body>

        </Card>
      </Container>
    )

  }

  const badCard = () => {
    return (
      <Container fluid className="w-100 p-4">
        <Card style={{ borderRadius: '1rem' }} bg="light" border="danger" text="danger" >
          <Card.Title className="fs-1 fw-bold">Error</Card.Title>
          <Card.Text className="fs-3">{err}</Card.Text>
        </Card>
      </Container>
    )

  }

  // render the good card
  if (err) {
    return badCard();
  } else {
    return goodCard();
  }

}

export default PG;
