import {Table} from "@mantine/core";
import PgCard from "./PgCard";
import {useNavigate} from "react-router-dom";


function History({history, general, style}) {

    const navigate = useNavigate();

    const lines = history.map((line, key) => {
        let date = new Date(line.date_evenement);
        return (
            <tr key={key}>
                {general
                    ?<td>{line.nom_evenement} par {line.initiateur_evenement}</td>
                    :<td>{line.nom_evenement}</td>
                }
                <td>{line.prix_evenement}€</td>
                {general
                    ?<td><PgCard data={line.cible_evenement}
                                 small
                                 onClick={()=>navigate("/pg/"+line.cible_evenement.id)}/>
                    </td>
                    :<td>{line.entite_evenement} ({line.initiateur_evenement})</td>}
                <td>{date.toLocaleString("fr-fr", {
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric"
                })}</td>
            </tr>
        )
    });

    return (
        <Table striped style={style}>
            <thead>
                <tr>
                    <th>Produit</th>
                    <th>Prix</th>
                    {general?<th>PG</th>:<th>Entité</th>}
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
            {lines}
            </tbody>
        </Table>
    )
}


export default History;
