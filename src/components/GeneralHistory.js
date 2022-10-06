import {Table} from "@mantine/core";
import PgCard from "./PgCard";
import {useNavigate} from "react-router-dom";


function GeneralHistory({history, style}) {

    const navigate = useNavigate();

    const lines = history.map((line, key) => {
        // format the date
        let date = new Date(line.date_evenement);
        // for each lines, return a table row
        return (
            <tr key={key}>
                <td>{line.nom_evenement} par {line.initiateur_evenement}</td>

                <td>{line.prix_evenement}€</td>
                <td><PgCard data={line.cible_evenement}
                                 small
                                 onClick={()=>navigate("/pg/"+line.cible_evenement.id)}/></td>
                <td>{date.toLocaleString("fr-fr", {
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric"
                })}</td>
            </tr>
        )
    });

    // TODO: Timeline element to select days?
    // TODO: Carousel to display days?

    return (
        <Table striped highlightOnHover sx={{borderRadius:"1em", ...style}}>
            <thead>
                <tr>
                    <th>Produit</th>
                    <th>Prix</th>
                    <th>PG</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
            {lines}
            </tbody>
        </Table>
    )
}


export default GeneralHistory;
