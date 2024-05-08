import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {createStyles, Group, Popover, Stack, Text, Tooltip, UnstyledButton, useMantineTheme} from "@mantine/core";
import {useHotkeys, useMediaQuery} from "@mantine/hooks";
import {IconBoxMultiple, IconLogout, IconUserSearch} from "@tabler/icons-react";

import {handleLogout} from "../auth/logout";
import SearchPg from "./SearchPg";
import {useEntiteCtxt} from "../hooks/useEntiteCtxt";
import CategoriesSelector from "./EntiteSelector";

const useStyles = createStyles((theme) => ({

    link: {
        width: 50,
        height: 50,
        borderRadius: theme.radius.md,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.white,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
            color: theme.fn.variant({variant: 'light', color: theme.primaryColor}).color,
        },
    },

    active: {
        '&, &:hover': {
            backgroundColor: theme.fn.variant({variant: 'light', color: theme.primaryColor}).background,
            color: theme.fn.variant({variant: 'light', color: theme.primaryColor}).color,
        },
    },
}));

export function NavbarLink({icon: Icon, label, pageName, link, shortcut, onClick, currentPage}) {
    const theme = useMantineTheme()
    const isSmallDevice = useMediaQuery('(max-width: ' + theme.breakpoints.sm + 'px)')

    const navigate = useNavigate()

    //Si aucun shortcut n'est spécifié, on associé la key "" à la fonction {} (on fait rien quoi)
    const shortcutAssoc = (shortcut !== undefined) ? [shortcut, () => navigate(link)] : ["", () => {
    }];
    useHotkeys([shortcutAssoc]);

    const {classes, cx} = useStyles();
    if (!isSmallDevice) {
        return (
            <Tooltip label={label} position="right" transitionduration={0}
                     events={{hover: true, focus: true, touch: false}}>
                <UnstyledButton
                    component={(link !== undefined) ? Link : undefined}
                    to={link}
                    onClick={onClick}
                    className={cx(classes.link, {[classes.active]: (pageName === currentPage)})}
                >
                    <Stack align="center" spacing="0">
                        <Icon size={34} stroke={1.5}/>
                        <Text size="10px">{shortcut}</Text>
                    </Stack>
                </UnstyledButton>
            </Tooltip>
        );
    } else {
        return (
            <UnstyledButton
                component={(link !== undefined) ? Link : undefined}
                to={link}
                onClick={onClick}
                className={cx(classes.link, {[classes.active]: (pageName === currentPage)})}
                style={{width: "80%", justifyContent: "left"}}
            >
                <Group>
                    <Icon size={34} stroke={1.5}/>
                    <Text>{label}</Text>
                </Group>
            </UnstyledButton>
        );
    }

}

export function LogOutLink() {
    const theme = useMantineTheme()
    const isSmallDevice = useMediaQuery('(max-width: ' + theme.breakpoints.sm + 'px)')

    const {classes, cx} = useStyles();

    const label = "Déconnexion"
    const Icon = IconLogout
    const shortcut = "alt+O"

    useHotkeys([[shortcut, handleLogout]])

    if (!isSmallDevice) {
        return (
            <Tooltip label={label} position="right" transitionduration={0}
                     events={{hover: true, focus: true, touch: false}}>
                <UnstyledButton
                    onClick={handleLogout}
                    className={cx(classes.link)}
                >
                    <Stack align="center" spacing="0">
                        <Icon size={34} stroke={1.5}/>
                        <Text size="10px">{shortcut}</Text>
                    </Stack>
                </UnstyledButton>
            </Tooltip>
        );
    } else {
        return (
            <UnstyledButton
                onClick={handleLogout}
                className={cx(classes.link)}
                style={{width: "80%"}}
            >
                <Group>
                    <Icon size={34} stroke={1.5}/>
                    <Text>{label}</Text>
                </Group>
            </UnstyledButton>
        );
    }
}


export function NormalSearchPgButton() {
    const {classes, cx} = useStyles();

    const Icon = IconUserSearch
    const label = "Rechercher un pg"
    const shortcut = "alt+P"

    const [active, setActive] = useState(false)

    useHotkeys([[shortcut, () => setActive((o) => !o)]])

    return (
        <Popover
            width={300}
            opened={active}
            onChange={setActive}
            position="right"
            styles={{
                dropdown: {
                    padding: 0,
                    borderRadius: 9,
                    borderStyle: "none"
                }
            }}
            shadow="md"
            offset={20}
            trapFocus
        >
            <Popover.Target>
                <Tooltip
                    label={label}
                    opened={active ? false : undefined}
                    position="right"
                    transitionduration={0}
                    events={{hover: true, focus: true, touch: false}}
                >
                    <UnstyledButton
                        onClick={() => setActive((o) => !o)}
                        className={cx(classes.link, {[classes.active]: active})}
                    >
                        <Stack align="center" spacing="0">
                            <Icon size={34} stroke={1.5}/>
                            <Text size="10px">{shortcut}</Text>
                        </Stack>
                    </UnstyledButton>
                </Tooltip>
            </Popover.Target>

            <Popover.Dropdown>
                <SearchPg onSubmit={() => setActive(false)}/>
            </Popover.Dropdown>
        </Popover>
    );
}


export function EntiteSelector() {
    const theme = useMantineTheme()
    const isSmallDevice = useMediaQuery('(max-width: ' + theme.breakpoints.sm + 'px)')

    const {classes, cx} = useStyles();

    const Icon = IconBoxMultiple;
    const { entite } = useEntiteCtxt();

    const [active, setActive] = useState(false);

    if (!isSmallDevice) {
        return (
            <Popover
                width={300}
                opened={active}
                onChange={setActive}
                position="right"
                shadow="md"
                offset={15}
                trapFocus
            >
                <Popover.Target>
                    <Tooltip
                        label={entite.nom}
                        opened={active ? false : undefined}
                        position="right"
                        transitionduration={0}
                        events={{hover: true, focus: true, touch: false}}>
                        <UnstyledButton
                            onClick={() => {setActive((active) => !active)}}
                            className={cx(classes.link, {[classes.active]: active})}
                            style={{backgroundColor:entite.color}}
                        >
                            <Stack align="center" spacing="0">
                                <Icon size={34} stroke={1.5}/>
                                <Text size="10px">{entite.nom.length > 8 ? entite.nom.slice(0,6)+ ".." : entite.nom}</Text>
                            </Stack>
                        </UnstyledButton>
                    </Tooltip>
                </Popover.Target>

                <Popover.Dropdown>
                    <CategoriesSelector setActive={setActive}/>
                </Popover.Dropdown>
            </Popover>
        );
    } else {
      return (
        <Popover
            width={300}
            opened={active}
            onChange={setActive}
            position="bottom"
            shadow="md"
            offset={15}
            trapFocus
        >
            <Popover.Target>
                <UnstyledButton
                    onClick={() => {setActive((active) => !active)}}
                    className={cx(classes.link, {[classes.active]: active})}
                    style={{backgroundColor:entite.color, width: "80%"}}
                >
                    <Group style={{width: "100%"}}>
                        <Icon size={34} stroke={1.5}/>
                        <Text>{entite.nom}</Text>
                    </Group>
                </UnstyledButton>
            </Popover.Target>

            <Popover.Dropdown>
                <CategoriesSelector setActive={setActive}/>
            </Popover.Dropdown>
        </Popover>
      );
    }
}
