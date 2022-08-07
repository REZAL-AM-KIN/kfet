import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function GeneralHistory(props) {
  const axiosPrivate = useAxiosPrivate();

  const [result, setResult] = useState([]);

  const URL = "history/" + (props.pgId ? (props.pgId + "/") : "");

  useEffect(() => {
    const controller = new AbortController();
    const getHistory = async () => {
      try {
        const response = await axiosPrivate.get(URL);
        setResult(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getHistory()
    return () => {
      controller.abort();
    }
    // eslint-disable-next-line
  }, [props.pgId])

  const lines = result.map((line, key) => {
    return (
      <Row key={key}>
        <Col>{line.date_evenement}</Col>
        <Col>{line.nom_evenement}</Col>
        <Col>{line.prix_evenement}€</Col>
        <Col>groupe débucqueur par (débucqueur)</Col>
      </Row>
    )
  });

  return (
    <div>
      <div>history!</div>
      {lines}

      <div>id: {props.pgId || "pas de pg"}</div>
    </div >
  )
}



export default GeneralHistory;
