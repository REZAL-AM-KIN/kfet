import {useNavigate} from "react-router-dom";
import {ScrollArea, Table} from "@mantine/core";
import {SmallPgCard} from "./PgCard";


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
                <td><SmallPgCard data={line.cible_evenement}
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
        <ScrollArea.Autosize mah="100%">
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
        </ScrollArea.Autosize>
    )
}

function PgHistory({history, style}) {

    const lines = history.map((line, key) => {
        let date = new Date(line.date_evenement);
        return (
            <tr key={key}>
                <td>{line.nom_evenement}</td>
                <td>{line.prix_evenement}€</td>
                <td>{line.entite_evenement} ({line.initiateur_evenement})</td>
                <td>{date.toLocaleString("fr-fr", {
                    month: "short",
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
        <ScrollArea.Autosize mah="100%">
            <Table striped highlightOnHover stickyHeader sx={{borderRadius:"1em", ...style}}>
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
        </ScrollArea.Autosize>
    )
}


export {GeneralHistory, PgHistory};
