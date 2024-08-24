import {Fragment, useState} from "react";
import {Affix, Burger, Container, Navbar, Stack, useMantineTheme} from "@mantine/core";
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
                    <Affix position={{top: 8, left: 8}}>
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

                    <Navbar
                            sx={(theme) => ({
                                backgroundColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
                                    .background,
                                border:0
                            })}
                            hidden={!navBarOpened}
                            top="0">
                        <Navbar.Section mt={7}>
                            <Stack align="center">
                                <Container style={{margin:0, padding:0, width:"75%"}}>
                                    <SearchPg onSubmit={() => setNavBarOpened(false)}/>
                                </Container>
                            </Stack>
                        </Navbar.Section>
                        <Navbar.Section mt={20}>
                            <Stack justify="center">
                                <NavbarLink
                                    icon={IconHome}
                                    link="/"
                                    shortcut="alt+H"
                                    key="Accueil"
                                    label="Accueil"
                                    onClick={()=>setNavBarOpened(false)}
                                />
                            </Stack>
                        </Navbar.Section>
                        <Navbar.Section mt={20}>
                            <Stack justify="center" spacing={5}>
                                <EntiteSelector setNavBarOpened={setNavBarOpened}/>
                                {links}
                            </Stack>
                        </Navbar.Section>
                        <Navbar.Section mt={20}>
                            <Stack justify="center">
                                <LogOutLink/>
                            </Stack>
                        </Navbar.Section>
                    </Navbar>
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
