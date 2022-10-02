import {Grid, Paper, Text, useMantineTheme} from "@mantine/core";


export default function PgCard({data, err, small}, props) {
    // data = {bucque, fams.... }

    const theme = useMantineTheme();

    var style = {borderWidth: "0.2em", borderRadius: "0.6em", ...props.style};

    if (data.solde > 0) {
        style = {backgroundColor: "blue", borderColor: "blue", ...style};
    } else {
        style = {backgroundColor: "red", borderColor: "mediumvioletred", ...style};
    }

    const GoodCard = () => {
        return (
            <Paper shadow="sm" radius="lg" p="xs" sx={style} withBorder>
                <Grid>
                    <Grid.Col span={8}>
                        <Text size={45} style={{lineHeight:1.1}}>{data.bucque} {data.fams}</Text>
                        <Text size={20} color={theme.colors.gray[9]} style={{lineHeight:1}}>{data.nom} {data.prenom}</Text>
                        <Text size={20}>{data.commentaire}</Text>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Text size={35} align="right">{data.solde}€</Text>
                    </Grid.Col>
                </Grid>
            </Paper>
        );
    }

    const SmallCard = () => {
        return (
            <Paper shadow="sm" radius="lg" p="xs" sx={style} withBorder>
                <Text>{data.bucque} {data.fams}</Text>
            </Paper>
        );
    }

    const BadCard = () => {
        return (
            <Paper sx={{...style, backgroundColor: "red", borderColor: "mediumvioletred"}} withBorder>
                <Text> bite </Text>
            </Paper>
        );
    }

    if (err) {
        return BadCard();
    } else if (props.small) {
        return SmallCard();
    } else {
        return GoodCard();
    }

}