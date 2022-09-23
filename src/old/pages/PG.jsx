import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import PgCard from '../components/PgCard';
import History from '../components/History';
import Produits from '../components/Produits';

function PG() {

    let params = useParams();
    const pgId = params.pgId;

    const [requireUpdate, setRequireUpdate] = useState(false); // just flick it to trigger update of the component

    // here we get user's permissions and render get it to outlet
    const axiosPrivate = useAxiosPrivate();
    const [permissions, setPermissions] = useState({});
    const URL = "permissions/";


    useEffect(() => {
        const controller = new AbortController();
        const getPermissions = async () => {
            try {
                const response = await axiosPrivate.get(URL);
                setPermissions(response.data);
            } catch (error) {
                if (error?.response?.status !== 403) {
                    console.log(error);
                }
            }
        }
        getPermissions()
        return () => {
            controller.abort();
        }
        // eslint-disable-next-line
    }, [pgId])

    console.log(permissions);


    if (Object.keys(permissions).length !== 0) {
        // Page ADMIN
        return (
            <Container fluid className="w-100" style={{borderRadius: '1rem'}}>
                <Row>
                    <Col md={7}>
                        <PgCard pgId={pgId} requireUpdate={requireUpdate}/>
                        <Produits pgId={pgId} permissions={permissions} requireUpdate={requireUpdate}
                                  setRequireUpdate={setRequireUpdate}/>
                    </Col>
                    <Col md={5} className="p-2">
                        <History pgId={pgId} requireUpdate={requireUpdate}/>
                    </Col>
                </Row>
            </Container>
        )
    } else {
        // PAGE NORMS
        return (
            <Container fluid className="w-100" style={{borderRadius: '1rem'}}>
                <Row>
                    <Col md={7}>
                        <PgCard pgId={pgId}/>
                        <div>PAGE PG</div>
                    </Col>
                    <Col md={5} className="p-2">
                        <History pgId={pgId}/>
                    </Col>
                </Row>
            </Container>
        )
    }

}

export default PG;
