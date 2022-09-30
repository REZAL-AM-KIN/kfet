import {createStyles, Center, Navbar, Tooltip, UnstyledButton, Stack, Text, MediaQuery, Burger} from "@mantine/core";
import {
    IconBuildingStore,
    IconListDetails, IconLogout, IconToolsKitchen2,
    IconUserSearch
} from "@tabler/icons";
import {Fragment, useState} from "react";

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

const NavigationBar = () => {
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
            <MediaQuery largerThan="sm" styles={{display: "none"}}>
                <Burger
                    opened={opened}
                    onClick={() => setOpened((o) => !o)}
                    style= {{

                        zIndex: 1000
                    }}
                >
                </Burger>
            </MediaQuery>
            <Navbar height="100vh"
                    width={{ xs:10, lg: 80 , base: 80}}
                    p="md"
                    sx={(theme) => ({
                        backgroundColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
                            .background,
                    })}
                    hiddenBreakpoint="lg"
                    hidden={!opened}>
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
                        <NavbarLink icon={IconLogout} label="Logout" shortcut="ALT+O" />
                    </Stack>
                </Navbar.Section>
            </Navbar>


        </Fragment>

        //Burger to open navbar



    );
}

export default NavigationBar;
