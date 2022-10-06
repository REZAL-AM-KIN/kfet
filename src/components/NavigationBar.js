import {
    createStyles,
    Center,
    Navbar,
    Tooltip,
    UnstyledButton,
    Stack,
    Text,
    Burger,
    Affix, Drawer, useMantineTheme, Group, TextInput
} from "@mantine/core";
import {
    IconBuildingStore,
    IconListDetails, IconLogout, IconToolsKitchen2,
    IconUserSearch
} from "@tabler/icons";
import {Fragment, useContext, useState} from "react";
import {useMediaQuery} from "@mantine/hooks";
import Logout from "../auth/logout";
import {Link} from "react-router-dom";
import {UserContext} from "../contexts/UserContext";


const mockdata = [
    { icon : IconBuildingStore, label: "Debucquage", pageName: "Debucquage", shortcut: "ALT+D"}, // pas de link pour l'onglet Debucquage car on y accede via la recherche PG
    { icon: IconListDetails, label: 'Editer les produits', pageName: "Edition", link: "/edit", shortcut: "ALT+E" },
    { icon: IconToolsKitchen2, label: "fin'ss", pageName: "Finss", link:"/finss", shortcut: "ALT+F" },

];

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

function NavbarLink({ icon: Icon, label, pageName, link, shortcut, onClick, currentPage }) {
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

function LogOutLink(){
    return(
        //On spécifie un pageName mais pas de currentPage car il ne s'agit pas d'un affichage en mode "Onglet"
    <NavbarLink icon={IconLogout} label="Logout" pageName="Logout" shortcut="ALT+O" {...Logout()} />
    );
}



/*
Mobile Nav Bar

 */
const MobileNavBar = ({navBarOpened, setNavBarOpened, links})=>{
        const theme = useMantineTheme()

        return (
                <Fragment>
                    <Affix position={{top: 10, left: 10}}>
                        <Burger
                            opened={navBarOpened}
                            onClick={() => setNavBarOpened((o) => !o)}
                            style={{
                                position: "absolute",
                                zIndex: 1000 // On s'assure que le burger soit toujours au dessus.
                            }}
                        >
                        </Burger>
                    </Affix>

                    <Drawer
                        opened={navBarOpened}
                        onClose={() => {setNavBarOpened(false)}}
                        closeButtonLabel="Close drawer"
                        styles={{
                            drawer: {backgroundColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
                                    .background},
                            closeButton: { color: "white", iconSize: 80} }}
                    >
                        {/*Code juste pour exemple*/}
                        <Group>
                            <IconUserSearch size={38} stroke={1.5}/>
                            <TextInput width="80%"></TextInput>
                        </Group>

                        <Stack justify="space-between" sx={()=> ({ height: "80%" })}>
                            <Text>test</Text>
                            <Text>ede</Text>
                        </Stack>
                        {/* */}
                    </Drawer>
                </Fragment>
        );

}

const NormalNavBar = ({links, width})=> {


    return (
            <Navbar height="100vh"
                    width={{base: width}}
                    p="md"
                    sx={(theme) => ({
                        backgroundColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
                            .background,
                    })}
                    fixed={true}>
                <Center>
                    <NavbarLink icon ={IconUserSearch} label="Rechercher un pg" pageName="" shortcut="ALT+P"></NavbarLink>
                </Center>
                <Navbar.Section grow mt={50}>
                    <Stack justify="center" spacing={0}>
                        {links}
                    </Stack>
                </Navbar.Section>
                <Navbar.Section>
                    <Stack justify="center" spacing={0}>
                       <LogOutLink/>
                    </Stack>
                </Navbar.Section>
            </Navbar>
    );


}

const NavigationBar = ({width, page}) => {
    const theme = useMantineTheme()
    const isSmallDevice = useMediaQuery('(max-width: '+theme.breakpoints.sm+'px)')

    const {isSuperUser, groups} = useContext(UserContext)

    const [opened, setOpened] = useState(false);

    console.log(isSuperUser+"|"+groups)
    const links = mockdata.map((link) => (
        <NavbarLink
            {...link}
            key={link.label}
            currentPage={page}
        />
    ));

    return (
        <Fragment>
            {isSmallDevice?
                <MobileNavBar navBarOpened={opened} setNavBarOpened={setOpened} links={links}/>
                :
                <NormalNavBar width={width} links={links}/>
            }
        </Fragment>
    );
}

export default NavigationBar;
