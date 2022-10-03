import {Grid, Paper, Text, useMantineTheme} from "@mantine/core";


export default function PgCard({data, err, small, onClick, style}) {
    // data = {bucque, fams.... }

    const theme = useMantineTheme();

    style = {borderWidth: ".2em", ...style};
    if (onClick) {
        style = {"&:hover":{backgroundColor:theme.colors.green[3]}, ...style};
    }

    if (data.solde > 0) {
        style = {backgroundColor: theme.colors.green[4], borderColor: theme.colors.green[8], ...style};
    } else {
        style = {backgroundColor: theme.colors.red[6], borderColor: theme.colors.red[9], ...style};
    }

    const GoodCard = () => {
        return (
            <Paper m={"lg"}
                   shadow="sm"
                   radius="lg"
                   p="sm"
                   sx={style}
                   withBorder
                   onClick={onClick}>
                <Grid>
                    <Grid.Col span={8}>
                        <Text size={45} style={{lineHeight: 1}}>{data.bucque} {data.fams}</Text>
                        <Text size={20} color={theme.colors.gray[9]}
                              style={{lineHeight: 1}}>{data.nom} {data.prenom}</Text>
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
            <Paper shadow="sm"
                   radius="lg"
                   p="xs"
                   sx={style}
                   withBorder
                   onClick={onClick}>
                <Text style={{lineHeight: .8}}>{data.bucque} {data.fams}</Text>
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
    } else if (small) {
        return SmallCard();
    } else {
        return GoodCard();
    }

}