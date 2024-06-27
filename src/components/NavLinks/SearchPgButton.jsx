import {useState} from "react";
import {Popover, Stack, Text, Tooltip, UnstyledButton, useMantineTheme} from "@mantine/core";
import {useHotkeys} from "@mantine/hooks";
import {IconUserSearch} from "@tabler/icons-react";
import SearchPg from "../SearchPg";
import useStyles from "./NavbarButtonStyle";


export function NormalSearchPgButton() {
    const theme = useMantineTheme()
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
                    transitionProps={{ duration: 0 }}
                    events={{hover: true, focus: true, touch: false}}
                >
                    <UnstyledButton
                        onClick={() => setActive((o) => !o)}
                        className={cx(classes.link, {[classes.active]: active})}
                    >
                        <Stack align="center" spacing="0">
                            <Icon className={classes.icon}/>
                            <Text size={theme.fontSizes.xs}>{shortcut}</Text>
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

export default NormalSearchPgButton;