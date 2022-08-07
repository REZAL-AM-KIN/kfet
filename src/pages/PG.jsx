import { useState } from 'react';
import { useParams } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import PgCard from '../components/PgCard';
import GeneralHistory from '../components/GeneralHistory';

function PG(props) {

  let params = useParams();
  const [pgId, setPgId] = useState(params.pgId);



  return (
    <Container fluid className="w-100" style={{ borderRadius: '1rem' }}>
      <Row>
        <Col sm={8}>
          <PgCard pgId={pgId} />
          <div>PAGE PG</div>
        </Col>
        <Col sm={4} className="p-4">
          <GeneralHistory />
        </Col>
      </Row>
    </Container>
  )

}

export default PG;
