import {Table} from "@mantine/core";


function PgHistory({history, style}) {

    const lines = history.map((line, key) => {
        let date = new Date(line.date_evenement);
        return (
            <tr key={key}>
                <td>{line.nom_evenement}</td>
                <td>{line.prix_evenement}€</td>
                <td>{line.entite_evenement} ({line.initiateur_evenement})</td>
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
                    <th>Entité</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
            {lines}
            </tbody>
        </Table>
    )
}


export default PgHistory;
