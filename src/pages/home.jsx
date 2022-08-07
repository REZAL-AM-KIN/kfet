import { useState } from 'react';
import { useParams } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import PG from '../components/PgCard';
import GeneralHistory from '../components/GeneralHistory';

function Home(props) {

  return (
    <Container fluid className="w-100" style={{ borderRadius: '1rem' }}>
      <Row>
        <Col sm={8}>
          <PG />
          <div>stats générales</div>
        </Col>
        <Col sm={4} className="p-4">
          <GeneralHistory />
        </Col>
      </Row>
    </Container>
  )

}

export default Home;
