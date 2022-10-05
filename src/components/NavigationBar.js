import {Affix, Burger, Center, Drawer, Navbar, Stack, Text, useMantineTheme} from "@mantine/core";
import {IconBuildingStore, IconListDetails, IconToolsKitchen2} from "@tabler/icons";
import {Fragment, useState} from "react";
import {useMediaQuery} from "@mantine/hooks";
import {LogOutLink, NavbarLink, NormalSearchPgButton} from "./NavigationLinks";
import SearchPg from "./SearchPg";


const mockdata = [
    { icon : IconBuildingStore, label: "Debucquage", pageName: "Debucquage"}, // pas de link pour l'onglet Debucquage car on y accede via la recherche PG
    { icon: IconListDetails, label: 'Editer les produits', pageName: "Edition", link: "/edit", shortcut: "alt+E" },
    { icon: IconToolsKitchen2, label: "fin'ss", pageName: "Finss", link:"/finss", shortcut: "alt+F" },

];





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
                        <Center>
                            <SearchPg setActive={setNavBarOpened}/>
                        </Center>

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
                    <NormalSearchPgButton/>
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

    const [opened, setOpened] = useState(false);


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
