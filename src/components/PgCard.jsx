import {Group, Paper, Stack, Text, Title, useMantineTheme} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";


function generateGeneralCardStyle(color, style, onClick) {
    if (onClick) {
        style = {"&:hover": {backgroundColor: color[2]}, ...style};
    }
    style = {backgroundColor: color[4], '&[data-with-border]': {border: color[7], borderWidth:"0.125rem", borderStyle: "solid"}, ...style};

    return style;
}


function generateStyle(data, style, onClick, theme) {
    if (data.solde > 0) {
        return generateGeneralCardStyle(theme.colors.green, style, onClick);
    } else {
        return generateGeneralCardStyle(theme.colors.red, style, onClick);
    }
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
    console.log(theme)
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
                    <Title order={1} size={isSmallDevice ? "h2" : "h1"} >{data.bucque} {data.fams}</Title>
                    <Group position={"apart"}>
                        <Text size={isSmallDevice ? theme.headings.sizes.h4.fontSize : theme.headings.sizes.h3.fontSize} color={theme.colors.gray[9]}
                                                    style={{lineHeight: 1}}>{data.nom} {data.prenom}</Text>
                        <Text size={isSmallDevice ? theme.headings.sizes.h4.fontSize : theme.headings.sizes.h3.fontSize} color={theme.colors.gray[9]}
                              style={{lineHeight: 1}}>{data.proms}</Text>
                    </Group>
                    <Text size={isSmallDevice ? theme.headings.sizes.h6.fontSize : theme.headings.sizes.h5.fontSize } style={{lineHeight: 1}} italic>{data.commentaire}</Text>
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
    const isSmallDevice = useMediaQuery('(max-width: ' + theme.breakpoints.sm + ')');

    const style = generateGeneralCardStyle(theme.colors.green, sx, onClick);

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