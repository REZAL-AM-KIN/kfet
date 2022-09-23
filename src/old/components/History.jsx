import {useEffect, useState} from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';


function History(props) {
    const axiosPrivate = useAxiosPrivate();

    const [result, setResult] = useState([]);


    useEffect(() => {
        console.log("UPDATE: History");
        const URL = "history/" + props.pgId + "/";
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
    }, [props.pgId, props.requireUpdate])


    const lines = result.map((line, key) => {
        var date = new Date(line.date_evenement);
        return (
            <tr key={key}>
                <td className="fs-6">{line.nom_evenement}</td>
                <td className="fs-6">{line.prix_evenement}€</td>
                <td>{line.entite_evenement} ({line.initiateur_evenement})</td>
                <td className="fs-6">{date.toLocaleString("fr-fr", {
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric"
                })}</td>
            </tr>
        )
    });

    return (
        <Container fluid className="p-0">
            <Table striped bordered className="p-0">
                <thead>
                <tr>
                    <th>Produit</th>
                    <th>Prix</th>
                    <th>Entité</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                {lines}
                </tbody>
            </Table>
        </Container>
    )
}


export default History;
