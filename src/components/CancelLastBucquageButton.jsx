import {Button} from "@mantine/core";
import {useHotkeys} from "@mantine/hooks";

function CancelLastBucquageButton({usepg, onCancel, sx}) {
    const onClick = ()=>{
        usepg.cancelLastBucquage().then(onCancel)
    }
    const shortcut = "alt+Z";
    useHotkeys([[shortcut, onClick]])
    return (
        <Button onClick={onClick} sx={sx}>Annuler le dernier débucquage ({shortcut})</Button>
    )
}

export default CancelLastBucquageButton;
