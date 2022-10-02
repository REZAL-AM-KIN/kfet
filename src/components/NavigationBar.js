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
import {Fragment, useState} from "react";
import {useMediaQuery} from "@mantine/hooks";
import Logout from "../auth/logout";

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

function NavbarLink({ icon: Icon, label, shortcut, active, onClick }) {

    const { classes, cx } = useStyles();

    return (
        <Tooltip label={label} position="right" transitionDuration={0} events={{ hover: true, focus: true, touch: false }}>
            <div>
                <UnstyledButton  onClick={onClick} className={cx(classes.link, {[classes.active]: active})}>
                    <Stack align="center" spacing="0">
                        <Icon size={34} stroke={1.5}/>
                        <Text size="8px">{shortcut}</Text>
                    </Stack>
                </UnstyledButton>

            </div>
        </Tooltip>
    );
}


const mockdata = [
    { icon : IconBuildingStore, label: "Debucqage", shortcut: "ALT+D"},
    { icon: IconListDetails, label: 'Editer les produits', shortcut: "ALT+E" },
    { icon: IconToolsKitchen2, label: "fin'ss", shortcut: "ALT+F" },

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

const NormalNavBar = ({links})=> {


    return (
            <Navbar height="100vh"
                    width={{base: 80}}
                    p="md"
                    sx={(theme) => ({
                        backgroundColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
                            .background,
                    })}
                    fixed={true}>
                <Center>
                    <NavbarLink icon ={IconUserSearch} label="Rechercher un pg" shortcut="ALT+P"></NavbarLink>
                </Center>
                <Navbar.Section grow mt={50}>
                    <Stack justify="center" spacing={0}>
                        {links}
                    </Stack>
                </Navbar.Section>
                <Navbar.Section>
                    <Stack justify="center" spacing={0}>
                        <NavbarLink icon={IconLogout} label="Logout" shortcut="ALT+O" {...Logout()} />
                    </Stack>
                </Navbar.Section>
            </Navbar>
    );


}

const NavigationBar = () => {
    const theme = useMantineTheme()
    const isSmallDevice = useMediaQuery('(max-width: '+theme.breakpoints.sm+'px)')

    const [opened, setOpened] = useState(false);

    const [active, setActive] = useState(2);

    const links = mockdata.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => setActive(index)}
        />
    ));

    return (
        <Fragment>
            {isSmallDevice?
                <MobileNavBar navBarOpened={opened} setNavBarOpened={setOpened} links={links}/>
                :
                <NormalNavBar links={links}/>
            }
        </Fragment>
    );
}

export default NavigationBar;
