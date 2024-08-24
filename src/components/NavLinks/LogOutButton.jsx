import {Group, Stack, Text, Tooltip, UnstyledButton, useMantineTheme} from "@mantine/core";
import {useHotkeys, useMediaQuery} from "@mantine/hooks";
import {IconLogout} from "@tabler/icons-react";
import {handleLogout} from "../../auth/logout";
import useNavabarButtonStyle from "./NavbarButtonStyle";


export function LogOutLink() {
    const theme = useMantineTheme()
    const isSmallDevice = useMediaQuery('(max-width: ' + theme.breakpoints.sm + ')')

    const {classes, cx} = useNavabarButtonStyle();

    const label = "Déconnexion"
    const Icon = IconLogout
    const shortcut = "alt+O"

    useHotkeys([[shortcut, handleLogout]])

    if (!isSmallDevice) {
        return (
            <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}
                     events={{hover: true, focus: true, touch: false}}>
                <UnstyledButton
                    onClick={handleLogout}
                    className={cx(classes.link)}
                >
                    <Stack align="center" spacing="0">
                        <Icon className={classes.icon}/>
                        <Text size={theme.fontSizes.xs}>{shortcut}</Text>
                    </Stack>
                </UnstyledButton>
            </Tooltip>
        );
    } else {
        return (
            <UnstyledButton
                onClick={handleLogout}
                className={cx(classes.link)}
                style={{width: "90%", justifyContent: "left", paddingLeft: theme.radius.md, alignSelf: "center"}}
            >
                <Group>
                    <Icon className={classes.icon}/>
                    <Text>{label}</Text>
                </Group>
            </UnstyledButton>
        );
    }
}

export default LogOutLink;