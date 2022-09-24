import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';


function History(props) {
    const navigate = useNavigate();
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


    var currentDate = new Date();

    const lines = result.map((line, key) => {
        var date = new Date(line.date_evenement);
        var ago = new Date(currentDate - date);
        var date_to_print = "";
        if (ago.getDay() >= 7) {
            date_to_print = date.toLocaleString("fr-fr", {
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric"
            })
        } else {
            var secondes = ago.getUTCSeconds();
            var minutes = ago.getUTCMinutes();
            var heures = ago.getUTCHours();

            date_to_print =
                (heures
                        ? heures + " heures"
                        : minutes
                            ? minutes + " minutes"
                            : secondes + " secondes"
                );
        }

        return (
            <tr key={key}>
                <td className="fs-6">{line.nom_evenement} par {line.entite_evenement} ({line.initiateur_evenement})</td>
                <td className="fs-6">{line.prix_evenement}€</td>
                <td onClick={() => {
                    navigate("/pg/" + line.cible_evenement.id)
                }}>
                    <Card style={{borderRadius: '1rem'}} bg={"light"}
                          border={+(line.cible_evenement.solde) >= 0 ? "success" : "danger"}
                          text={+(line.cible_evenement.solde) >= 0 ? "success" : "danger"}>
                        <Card.Body>
                            <Card.Title
                                className="md-fs-1 fw-bold lh-1 text-nowrap">{line.cible_evenement.bucque} {line.cible_evenement.fams}</Card.Title>
                            <Card.Subtitle
                                className="fw-normal lh-1 text-nowrap">{line.cible_evenement.nom} {line.cible_evenement.prenom}</Card.Subtitle>
                        </Card.Body>
                    </Card>
                </td>
                <td className="fs-6">{date_to_print}</td>
            </tr>
        )
    });

    return (
        <Container fluid className="p-0">
            <Table striped bordered className="p-0">
                <thead>
                <tr>
                    <th>produit</th>
                    <th>prix</th>
                    <th>PG</th>
                    <th>date</th>
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
