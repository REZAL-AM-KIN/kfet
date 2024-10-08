import {useState} from "react";
import {Group, Popover, Stack, Text, Tooltip, UnstyledButton, useMantineTheme} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";
import {IconBoxMultiple} from "@tabler/icons-react";
import {useEntiteCtxt} from "../../hooks/useEntiteCtxt";
import CategoriesSelector from "./EntiteSelector";
import useNavabarButtonStyle from "./NavbarButtonStyle";


export function EntiteSelector() {
    const theme = useMantineTheme()
    const isSmallDevice = useMediaQuery('(max-width: ' + theme.breakpoints.sm + ')')

    const {classes, cx} = useNavabarButtonStyle();

    const Icon = IconBoxMultiple;
    const { entite } = useEntiteCtxt();

    const [active, setActive] = useState(false);

    if (!isSmallDevice) {
        return (
            <Popover
                width={300}
                opened={active}
                onChange={setActive}
                position="right"
                shadow="md"
                offset={15}
                trapFocus
            >
                <Popover.Target>
                    <Tooltip
                        label={entite.nom}
                        opened={active ? false : undefined}
                        position="right"
                        transitionProps={{ duration: 0 }}
                        events={{hover: true, focus: true, touch: false}}>
                        <UnstyledButton
                            onClick={() => {setActive((active) => !active)}}
                            className={cx(classes.link, {[classes.active]: active})}
                            style={{backgroundColor:entite.color}}
                        >
                            <Stack align="center" spacing="0">
                                <Icon className={classes.icon}/>
                                <Text size={theme.fontSizes.xs}>{entite.nom.length > 8 ? entite.nom.slice(0,6)+ ".." : entite.nom}</Text>
                            </Stack>
                        </UnstyledButton>
                    </Tooltip>
                </Popover.Target>

                <Popover.Dropdown>
                    <CategoriesSelector setActive={setActive}/>
                </Popover.Dropdown>
            </Popover>
        );
    } else {
      return (
        <Popover
            width={300}
            opened={active}
            onChange={setActive}
            position="bottom"
            shadow="md"
            offset={15}
            trapFocus
        >
            <Popover.Target>
                <UnstyledButton
                    onClick={() => {setActive((active) => !active)}}
                    className={cx(classes.link, {[classes.active]: active})}
                    style={{backgroundColor:entite.color, width: "80%"}}
                >
                    <Group style={{width: "100%"}}>
                        <Icon className={classes.icon}/>
                        <Text>{entite.nom}</Text>
                    </Group>
                </UnstyledButton>
            </Popover.Target>

            <Popover.Dropdown>
                <CategoriesSelector setActive={setActive}/>
            </Popover.Dropdown>
        </Popover>
      );
    }
}

export default EntiteSelector;