import {Group, Paper, Stack, Text, useMantineTheme} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";


export default function PgCard({data, small, onClick, style}) {
    // data = {bucque, fams.... }

    const theme = useMantineTheme();
    const isSmallDevice = useMediaQuery('(max-width: ' + theme.breakpoints.xs + 'px)');

    style = {borderWidth: ".2em", ...style};
    if (onClick) {
        // TODO: just change the gradient, not the color (don't make it green if it was red)
        style = {"&:hover": {backgroundColor: theme.colors.green[1]}, ...style};
    }
    if (data.solde > 0) {
        style = {backgroundColor: theme.colors.green[3], borderColor: theme.colors.green[6], ...style};
    } else {
        style = {backgroundColor: theme.colors.red[5], borderColor: theme.colors.red[7], ...style};
    }

    const GoodCard = () => {
        return (
            <Paper m={isSmallDevice ? "xs" : "lg"}
                   shadow="sm"
                   radius="lg"
                   p="sm"
                   sx={style}
                   withBorder
                   onClick={onClick}>
                <Group position={"apart"} spacing={0}>
                    <Stack spacing={0}>
                        <Text size={isSmallDevice ? 25 : 45} style={{lineHeight: 1}}>{data.bucque} {data.fams}</Text>
                        <Text size={isSmallDevice ? 12 : 20} color={theme.colors.gray[9]}
                              style={{lineHeight: 1}}>{data.nom} {data.prenom}</Text>
                        <Text size={isSmallDevice ? 12 : 20}>{data.commentaire}</Text>
                    </Stack>
                    {/* make the solde stick to the right of the card*/}
                    <Text size={isSmallDevice ? 20 : 35}
                          sx={{
                              '@media (max-width: 300px)': {
                                  width: "100%",
                              }
                          }}
                          align="right">{data.solde}€</Text>
                </Group>
            </Paper>
        );
    }

    const SmallCard = () => {
        return (
            <Paper shadow="sm"
                   radius="lg"
                   p={isSmallDevice ? "5px" : "xs"}
                   sx={style}
                   withBorder
                   onClick={onClick}>
                <Group position="apart" spacing={0}>
                    <Text size={isSmallDevice ? theme.fontSizes.sm : theme.fontSizes.md}
                          sx={{lineHeight: ".9em"}}>{data.bucque}</Text>
                    <Text size={isSmallDevice ? theme.fontSizes.xs : theme.fontSizes.md}
                          sx={{lineHeight: ".9em"}}>{data.fams}</Text>
                </Group>
            </Paper>
        );
    }

    const BadCard = () => {
        return (
            <Paper sx={{...style, backgroundColor: theme.colors.red[5], borderColor: theme.colors.red[8]}} withBorder>
                <Text>Une Erreur est survenue !</Text>
            </Paper>
        );
    }

    if (!data) {
        return BadCard();
    } else if (small) {
        return SmallCard();
    } else {
        return GoodCard();
    }

}