import {createStyles, Popover, Stack, Text, Tooltip, UnstyledButton, useMantineTheme} from "@mantine/core";
import {Link} from "react-router-dom";
import {IconLogout, IconUserSearch} from "@tabler/icons";
import Logout from "../auth/logout";
import {forwardRef, useState} from "react";
import SearchPg from "./SearchPg";

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
        },
    },

    active: {
        '&, &:hover': {
            backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
            color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        },
    },
}));

export function NavbarLink({ icon: Icon, label, pageName, link, shortcut, onClick, currentPage }) {
    const { classes, cx } = useStyles();

    return (
        <Tooltip label={label} position="right" transitionDuration={0} events={{ hover: true, focus: true, touch: false }}>
            <UnstyledButton
                component={(link!==undefined)? Link : undefined}
                to={link}
                onClick={onClick}
                className={cx(classes.link, {[classes.active]: (pageName===currentPage)})}
            >
                <Stack align="center" spacing="0">
                    <Icon size={34} stroke={1.5}/>
                    <Text size="8px">{shortcut}</Text>
                </Stack>
            </UnstyledButton>
        </Tooltip>
    );
}

export function LogOutLink(){
    return(
        //On spécifie un pageName mais pas de currentPage car il ne s'agit pas d'un affichage en mode "Onglet"
        <NavbarLink icon={IconLogout} label="Logout" pageName="Logout" shortcut="ALT+O" {...Logout()} />
    );
}



export function NormalSearchPgButton() {
    const theme = useMantineTheme()
    const { classes, cx } = useStyles();
    const Icon =IconUserSearch
    const label="Rechercher un pg"
    const shortcut="ALT+P"
    const [active, setActive] = useState(false)

    function onClick(){
        setActive(!active)
    }

    const SearchPgButton = forwardRef((props, ref) =>(
        <Tooltip
            label={label}
            opened={active ? false : undefined}
            position="right"
            transitionDuration={0}
            events={{ hover: true, focus: true, touch: false }}>
            <UnstyledButton
                ref={ref}
                {...props}
                onClick={onClick}
                className={cx(classes.link, {[classes.active]: active})}
            >
                <Stack align="center" spacing="0">
                    <Icon size={34} stroke={1.5}/>
                    <Text size="8px">{shortcut}</Text>
                </Stack>
            </UnstyledButton>
        </Tooltip>

    ));



    return (
        <Popover
            width={300}
            opened={active}
            position="left"
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
                <SearchPgButton/>
            </Popover.Target>

            <Popover.Dropdown>
                <SearchPg/>
            </Popover.Dropdown>
        </Popover>
    );
}