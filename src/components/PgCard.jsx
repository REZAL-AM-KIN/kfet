import {Group, Paper, Stack, Text, useMantineTheme} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";


function generateStyle(data, style, onClick, theme) {
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

    return style;
}

function BadCard(style) {
    const theme = useMantineTheme();

    return (
        <Paper sx={{...style, backgroundColor: theme.colors.red[5], borderColor: theme.colors.red[8]}} withBorder>
            <Text>Une Erreur est survenue !</Text>
        </Paper>
    );
}

function PgCard({data, onClick, sx}) {
    const theme = useMantineTheme();
    const isSmallDevice = useMediaQuery('(max-width: ' + theme.breakpoints.sm + ')');

    const style = generateStyle(data, sx, onClick, theme);

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
                    <Text size={isSmallDevice ? theme.headings.sizes.h2.fontSize : theme.headings.sizes.h1.fontSize} style={{lineHeight: theme.fontSizes.md}}>{data.bucque} {data.fams}</Text>
                    <Group position={"apart"}>
                        <Text size={isSmallDevice ? theme.headings.sizes.h5.fontSize : theme.headings.sizes.h4.fontSize} color={theme.colors.gray[9]}
                                                    style={{lineHeight: 1}}>{data.nom} {data.prenom}</Text>
                        <Text size={isSmallDevice ? theme.headings.sizes.h5.fontSize : theme.headings.sizes.h4.fontSize} color={theme.colors.gray[9]}
                              style={{lineHeight: 1}}>{data.proms}</Text>
                    </Group>
                    <Text size={isSmallDevice ? theme.headings.sizes.h6.fontSize : theme.headings.sizes.h5.fontSize}>{data.commentaire}</Text>
                </Stack>
                {/* make the solde stick to the right of the card*/}
                <Text size={isSmallDevice ? theme.headings.sizes.h3.fontSize : theme.headings.sizes.h2.fontSize}
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

function SmallPgCard({data, onClick, sx}) {
    const theme = useMantineTheme();
    console.log(theme)
    const isSmallDevice = useMediaQuery('(max-width: ' + theme.breakpoints.sm + ')');

    const style = generateStyle(data, sx, onClick, theme);

    return (
        <Paper shadow={theme.shadows.sm}
               radius={theme.radius.lg}
               p={isSmallDevice ? 'calc('+theme.spacing.xs+'/2)' : theme.spacing.xs}
               sx={style}
               withBorder
               onClick={onClick}>
            <Group position="apart" spacing={0}>
                <Text size={isSmallDevice ? theme.fontSizes.sm : theme.fontSizes.md}
                      sx={{lineHeight: theme.fontSizes.sm}}>{data.bucque}</Text>
                <Text size={isSmallDevice ? theme.fontSizes.xs : theme.fontSizes.sm}
                      sx={{lineHeight: theme.fontSizes.sm}}>{data.fams}</Text>
            </Group>
        </Paper>
    );
}

export {PgCard, SmallPgCard, BadCard}