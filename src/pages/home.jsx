import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import PG from '../components/PgCard';
import GeneralHistory from '../components/GeneralHistory';

function Home(props) {

  return (
    <Container fluid className="w-100" style={{ borderRadius: '1rem' }}>
      <Row>
        <Col lg={7}>
          <PG />
          <div>stats générales</div>
        </Col>
        <Col lg={5} className="p-0">
          <GeneralHistory />
        </Col>
      </Row>
    </Container>
  )

}

export default Home;
