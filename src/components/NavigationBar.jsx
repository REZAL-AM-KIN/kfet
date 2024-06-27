import {Fragment, useState} from "react";
import {Affix, Burger, Center, Container, Drawer, Navbar, Stack, Space, useMantineTheme} from "@mantine/core";
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
                    <Affix position={{top: 5, left: 5}}>
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
                            })}
                            hidden={!navBarOpened}
                            top="0">
                        <Navbar.Section mt={41}>
                            <Stack align="center">
                                <Container style={{margin:0, padding:0, width:"90%"}}>
                                    <SearchPg/>
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
                                <EntiteSelector/>
                                {links}
                            </Stack>
                        </Navbar.Section>
                        <Navbar.Section mt={20}>
                            <Stack justify="center">
                                <LogOutLink/>
                            </Stack>
                        </Navbar.Section>
                    </Navbar>


                    {/*<Drawer.Root*/}
                    {/*    opened={navBarOpened}*/}
                    {/*    onClose={() => {setNavBarOpened(false)}}*/}
                    {/*    closeButtonLabel="Close drawer"*/}
                    {/*    styles={{*/}
                    {/*        content: {backgroundColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor })*/}
                    {/*                .background},*/}
                    {/*        header: {backgroundColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor })*/}
                    {/*                .background},*/}
                    {/*        close: { color: "white", iconSize: "lg"} }}*/}
                    {/*    lockScroll*/}
                    {/*    zIndex={50}*/}
                    {/*>*/}
                    {/*    <Drawer.Overlay />*/}
                    {/*    <Drawer.Content>*/}
                    {/*        <Drawer.Header>*/}
                    {/*            <Drawer.Title> <Space h="md" /> </Drawer.Title>*/}
                    {/*        </Drawer.Header>*/}
                    {/*        <Drawer.Body>*/}
                    
                    {/*            <Container fluid>*/}
                    {/*                <SearchPg/>*/}
                    {/*            </Container>*/}
                    {/*            <Stack justify="space-between"  style={{width: "100%", height: "100%", paddingTop: "4vh", paddingBottom: "5.5em"}}>*/}
                    {/*                <NavbarLink*/}
                    {/*                    icon={IconHome}*/}
                    {/*                    link="/"*/}
                    {/*                    shortcut="alt+H"*/}
                    {/*                    key="Accueil"*/}
                    {/*                    label="Accueil"*/}
                    {/*                    onClick={()=>setNavBarOpened(false)}*/}
                    {/*                />*/}
                    
                    {/*                <Stack align="center" spacing="xs">*/}
                    {/*                    <EntiteSelector/>*/}
                    {/*                    {links}*/}
                    {/*                </Stack>*/}
                    
                    {/*                <Center>*/}
                    {/*                    <LogOutLink/>*/}
                    {/*                </Center>*/}
                    {/*            </Stack>*/}
                    
                    {/*        </Drawer.Body>*/}
                    {/*    </Drawer.Content>*/}
                    {/*</Drawer.Root>*/}
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
                <Navbar.Section grow mt={20}>
                    <Stack justify="center" spacing={0}>
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
