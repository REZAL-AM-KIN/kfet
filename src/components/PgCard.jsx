import {Paper, Text} from "@mantine/core";


export default function PgCard(props) {
    // data = {bucque, fams.... }

    var style = {borderWidth: "0.2em", borderRadius: "0.6em", ...props.style};

    if (props.data.solde > 0) {
        style = {backgroundColor: "blueish", borderColor: "blue", ...style};
    } else {
        style = {backgroundColor: "red", borderColor: "mediumvioletred", ...style};
    }

    const GoodCard = () => {
        return (
            <Paper shadow="sm" radius="lg" p="xs" sx={style} withBorder>
                <Text>{props.data.bucque} {props.data.fams}</Text>
                <Text>{props.data.nom} {props.data.prenom}</Text>
                <Text>{props.data.commentaire}</Text>
                <Text>{props.data.solde}€</Text>
            </Paper>
        );
    }

    const SmallCard = () => {
        return (
            <Paper shadow="sm" radius="lg" p="xs" sx={style} withBorder>
                <Text>{props.data.bucque} {props.data.fams}</Text>
            </Paper>
        );
    }

    const BadCard = () => {
        return (
            <Paper sx={{...style, backgroundColor:"red" , borderColor: "mediumvioletred"}}  withBorder>
                <Text> bite </Text>
            </Paper>
        );
    }

    if (props.err) {
        return BadCard();
    } else if (props.small) {
        return SmallCard();
    } else {
        return GoodCard();
    }

}