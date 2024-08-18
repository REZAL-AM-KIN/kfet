import {Button, Text, useMantineTheme} from "@mantine/core";
import {useHotkeys, useMediaQuery} from "@mantine/hooks";

function CancelLastBucquageButton({usepg, onCancel}) {
    const theme = useMantineTheme()
    const isSmallDevice = useMediaQuery('(max-width: '+theme.breakpoints.sm+')')

    const onClick = ()=>{
        usepg.cancelLastBucquage().then(onCancel)
    }

    const shortcut = "alt+Z";
    useHotkeys([[shortcut, onClick]])
    return (
        <Button onClick={onClick} sx={{height: "auto", minHeight: "36px"}}>
            <Text truncate align="center" sx={{whiteSpace: "normal", overflowWrap: "break-word"}}> Annuler le dernier débucquage
                {isSmallDevice ? "" : " (" + shortcut + ")"}</Text>
        </Button>
    )
}

export default CancelLastBucquageButton;
