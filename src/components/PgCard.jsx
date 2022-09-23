import {Paper, Text} from "@mantine/core";


export default function PgCard(props) {
    // data = {bucque, fams.... }

    var style = {borderWidth: "0.2em", borderRadius: "0.6em"};

    if (props.data.solde > 0) {
        style = {...style, backgroundColor: "green", borderColor: "blue"};
    } else {
        style = {...style, backgroundColor: "red", borderColor: "mediumvioletred"};
    }

    const GoodCard = () => {
        return (
            <Paper shadow="sm" radius="lg" p="xs" style={style} withBorder>
                <Text>{props.data.bucque} {props.data.fams}</Text>
                <Text>{props.data.nom} {props.data.prenom}</Text>
                <Text>{props.data.commentaire}</Text>
                <Text>{props.data.solde}€</Text>
            </Paper>
        );
    }

    const BadCard = () => {
        return (
            <Paper style={{...style, backgroundColor: "red", borderColor: "mediumvioletred"}} withBorder>
                <Text> bite </Text>
            </Paper>
        );
    }

    if (props.err) {
        return BadCard();
    } else {
        return GoodCard();
    }
}