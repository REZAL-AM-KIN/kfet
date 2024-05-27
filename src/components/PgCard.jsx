import {Center, Group, Paper, Stack, Text, Title, useMantineTheme} from "@mantine/core";
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
    const isSmallDevice = useMediaQuery('(max-width: ' + theme.breakpoints.sm + ')');

    const style = generateStyle(data, sx, onClick, theme);

    if (isSmallDevice) {
        return (
            <Paper m="xs"
                shadow="sm"
                radius="lg"
                p="sm"
                sx={style}
                withBorder
                onClick={onClick}>
                <Title order={1} size="h2">{data.bucque} {data.fams}</Title>                
                <Group position="apart" grow>
                    <Stack align="flex-start" justify="flex-start" spacing={0}>
                        <Text size={theme.headings.sizes.h4.fontSize} color={theme.colors.gray[9]}
                            style={{lineHeight: 1}}>{data.proms}</Text>
                        <Text size={theme.headings.sizes.h4.fontSize} color={theme.colors.gray[9]}
                            style={{lineHeight: 1}}>{data.nom} {data.prenom}</Text>
                    </Stack>
                    {/* make the solde stick to the right of the card*/}
                    <Text size={theme.headings.sizes.h3.fontSize}
                        align="right">{data.solde}€</Text>
                </Group>
                <Text size={theme.headings.sizes.h6.fontSize} style={{lineHeight: 1}} italic>{data.commentaire}</Text>
            </Paper>
        );
    } else {
        return (
            <Paper m="lg"
                shadow="sm"
                radius="lg"
                p="sm"
                sx={style}
                withBorder
                onClick={onClick}>
                <Group position="apart" grow>
                    <Stack spacing={0}>
                        <Text size={theme.headings.sizes.h3.fontSize} color={theme.colors.gray[9]}
                            style={{lineHeight: 1}}>{data.nom} {data.prenom}</Text>
                        <Text size={theme.headings.sizes.h5.fontSize} style={{lineHeight: 1}} italic>{data.commentaire}</Text>
                    </Stack>

                    <Stack>
                        <Center>
                            <Title size="h1">{data.bucque} {data.fams}</Title>
                        </Center>
                        <Center>
                            <Text size={theme.headings.sizes.h3.fontSize} color={theme.colors.gray[9]}
                                style={{lineHeight: 1}}>{data.proms}</Text>
                        </Center>
                    </Stack>

                    {/* make the solde stick to the right of the card*/}
                    <Text size={theme.headings.sizes.h2.fontSize}
                        align="right">{data.solde}€</Text>
                </Group>
            </Paper>
        );
    }    
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