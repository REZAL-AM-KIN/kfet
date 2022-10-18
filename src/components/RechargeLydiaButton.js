import {Button, Modal, Stack, TextInput} from "@mantine/core";
import {useState} from "react";

function RechargeLydiaButton({pgData, sx}) {

    const [qrcode, setQrcode] = useState("");

    const [opened, setOpened] = useState(false);

    /* Function triggered when the recharge button is clicked */
    const modalOpen = () => {
        setOpened(true);
    }

    const modalClose = () => {
        setOpened(false);
        setQrcode("");
    }

    const handleRechargerSubmit = () => {

    }

    return (
        <>
            <Button onClick={modalOpen} sx={sx}>Qr Code</Button>
            <Modal
                centered
                opened={opened}
                onClose={() => {
                    modalClose()
                }}
                title={"Recharger " + pgData.bucque + " " + pgData.fams}
            >
                <form onSubmit={handleRechargerSubmit}>
                    <Stack>
                        <TextInput
                            data-autofocus
                            type="text"
                            placeholder="Scanner le QR Code"
                            label="Montant de la recharge"
                            value={qrcode}
                            onChange={(e) => setQrcode(e.currentTarget.value)}
                        />
                        <Button
                            type={"submit"}
                            disabled={!qrcode}>
                            Recharger
                        </Button>
                    </Stack>
                </form>
            </Modal>
        </>
    );
}

export default RechargeLydiaButton;