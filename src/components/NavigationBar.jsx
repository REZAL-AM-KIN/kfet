import {Fragment, useState} from "react";
import {Affix, Burger, Center, Container, Drawer, Navbar, Stack, useMantineTheme} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";
import {IconListDetails, IconToolsKitchen2, IconHome} from "@tabler/icons-react";

import NavbarLink from "./NavLinks/StandardNavButton";
import EntiteSelector from "./NavLinks/EntiteSelectorButton";
import NormalSearchPgButton from "./NavLinks/SearchPgButton";
import LogOutLink from "./NavLinks/LogOutButton";
import SearchPg from "./SearchPg";


const mockdata = [
    { icon: IconListDetails, label: 'Editer les produits',link: "/edit", shortcut: "alt+E" },
    { icon: IconToolsKitchen2, label: "Fin'ss", link:"/finss", shortcut: "alt+F" },

];


/*
Mobile Nav Bar

 */
const MobileNavBar = ({navBarOpened, setNavBarOpened, linksData})=>{
        const theme = useMantineTheme()

        const links = linksData.map((link) => (
            <NavbarLink
                {...link}
                key={link.label}
                onClick={()=>setNavBarOpened(false)}
            />
        ));

        return (
                <Fragment>
                    <Affix position={{top: 10, left: 10}}>
                        <Burger
                            opened={navBarOpened}
                            onClick={() => setNavBarOpened((o) => !o)}
                            style={{
                                position: "absolute",
                                zIndex: 1000 // On s'assure que le burger soit toujours au-dessus.
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
                        lockScroll
                    >
                        <Container fluid>
                            <SearchPg setActive={setNavBarOpened}/>
                        </Container>
                        <Stack justify="space-between"  style={{width: "100%", height: "100%", paddingTop: "4vh", paddingBottom: "5.5em"}}>
                            <Stack align="center" spacing="xs">
                                <EntiteSelector/>
                                {links}
                            </Stack>

                            <Center>
                                <LogOutLink/>
                            </Center>
                        </Stack>

                    </Drawer>
                </Fragment>
        );

}

const NormalNavBar = ({linksData, width})=> {

    const links = linksData.map((link) => (
        <NavbarLink
            {...link}
            key={link.label}
        />
    ));

    return (
            <Navbar height="100vh"
                    width={{base: width}}
                    p="md"
                    sx={(theme) => ({
                        backgroundColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
                            .background,
                    })}
                    fixed={true}
                    top="0">
                <Navbar.Section>
                    <Stack justify="center">
                        <NormalSearchPgButton/>
                    </Stack>
                </Navbar.Section>
                <Navbar.Section mt={30}>
                    <Stack justify="center">
                        <NavbarLink
                            icon={IconHome}
                            link="/"
                            shortcut="alt+H"
                            key="Accueil"
                            label="Accueil"
                        />
                    </Stack>
                </Navbar.Section>
                <Navbar.Section grow mt={30}>
                    <Stack justify="center" spacing={10}>
                        <EntiteSelector/>
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

const NavigationBar = ({width}) => {
    const theme = useMantineTheme()
    const isSmallDevice = useMediaQuery('(max-width: '+theme.breakpoints.sm+')')

    const [opened, setOpened] = useState(false);




    return (
        <Fragment>
            {isSmallDevice?
                <MobileNavBar navBarOpened={opened} setNavBarOpened={setOpened} linksData={mockdata}/>
                :
                <NormalNavBar width={width} linksData={mockdata}/>
            }
        </Fragment>
    );
}

export default NavigationBar;
