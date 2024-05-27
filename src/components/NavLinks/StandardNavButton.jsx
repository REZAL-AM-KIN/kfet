import {NavLink, useNavigate} from "react-router-dom";
import {Group, Stack, Text, Tooltip, UnstyledButton, useMantineTheme} from "@mantine/core";
import {useHotkeys, useMediaQuery} from "@mantine/hooks";
import useStyles from "./NavbarButtonStyle";

export function NavbarLink({icon: Icon, label, link, shortcut, onClick}) {
    const theme = useMantineTheme()
    const isSmallDevice = useMediaQuery('(max-width: ' + theme.breakpoints.sm + ')')

    const navigate = useNavigate()

    //Si aucun shortcut n'est spécifié, on associe la key "" à la fonction {} (on ne fait rien quoi)
    const shortcutAssoc = (shortcut !== undefined) ? [shortcut, () => navigate(link)] : ["", () => {
    }];
    useHotkeys([shortcutAssoc]);

    const {classes, cx} = useStyles();
    if (!isSmallDevice) {
        return (
            <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}
                     events={{hover: true, focus: true, touch: false}}>
                <NavLink
                    component={UnstyledButton}
                    to={link}
                    onClick={onClick}
                    className={({ isActive }) => {
                        return isActive ? cx(classes.link, classes.active) : cx(classes.link);
                    }}
                >
                    <Stack align="center" spacing="0">
                        <Icon className={classes.icon}/>
                        <Text size={theme.fontSizes.xs}>{shortcut}</Text>
                    </Stack>
                </NavLink>
            </Tooltip>
        );
    } else {
        return (
            <NavLink
                component={UnstyledButton}
                to={link}
                onClick={onClick}
                className={({ isActive }) => {
                    return isActive ? cx(classes.link, classes.active) : cx(classes.link);
                }}
                style={{width: "80%", justifyContent: "left"}}
            >
                <Group>
                    <Icon className={classes.icon}/>
                    <Text>{label}</Text>
                </Group>
            </NavLink>
        );
    }

}

export default NavbarLink;
