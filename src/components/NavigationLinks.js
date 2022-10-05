import {createStyles, Popover, Stack, Text, Tooltip, UnstyledButton} from "@mantine/core";
import {Link, useNavigate} from "react-router-dom";
import {IconLogout, IconUserSearch} from "@tabler/icons";
import  {handleLogout} from "../auth/logout";
import {forwardRef, useState} from "react";
import SearchPg from "./SearchPg";
import {useClickOutside, useHotkeys} from "@mantine/hooks";

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

    const navigate = useNavigate()

    //Si aucun shortcut n'est spécifié, on associé la key "" à la fonction {} (on fait rien quoi)
    const shortcutAssoc =  (shortcut !== undefined)? [shortcut, ()=>navigate(link)] : ["",()=>{}];
    useHotkeys([shortcutAssoc]);

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
                    <Text size="10px">{shortcut}</Text>
                </Stack>
            </UnstyledButton>
        </Tooltip>
    );
}

export function LogOutLink(){
    const { classes, cx } = useStyles();

    const label = "Déconnexion"
    const Icon = IconLogout
    const shortcut = "alt+O"

    useHotkeys([[shortcut, handleLogout]])


    return(

        <Tooltip label={label} position="right" transitionDuration={0} events={{ hover: true, focus: true, touch: false }}>
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
}



export function NormalSearchPgButton() {
    const { classes, cx } = useStyles();

    const ref = useClickOutside(() => setActive(false));

    const Icon =IconUserSearch
    const label="Rechercher un pg"
    const shortcut="alt+P"

    const [active, setActive] = useState(false)

    useHotkeys([[shortcut, onClick]])


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
                    <Text size="10px">{shortcut}</Text>
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
                <SearchPg refForOutsideClick={ref} setActive={setActive}/>
            </Popover.Dropdown>
        </Popover>
    );
}