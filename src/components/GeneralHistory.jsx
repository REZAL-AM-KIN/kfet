import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function History(props) {
  const axiosPrivate = useAxiosPrivate();

  const [result, setResult] = useState([]);

  const URL = "history/";

  useEffect(() => {
    const controller = new AbortController();
    const getHistory = async () => {
      try {
        const response = await axiosPrivate.get(URL);
        setResult(response.data.results);
      } catch (error) {
        console.log(error);
      }
    }
    getHistory()
    return () => {
      controller.abort();
    }
    // eslint-disable-next-line
  }, [])

  const lines = result.map((line, key) => {
    return (
      <Row key={key}>
        <Col>date</Col>
        <Col>{line.nom_evenement} par groupe (debucqueur)</Col>
        <Col>prix {line.prix_evenement}€</Col>
        <Col>pg débucqué</Col>
      </Row>
    )
  });

  return (
    <div>
      {lines}
    </div >
  )
}



export default History;
