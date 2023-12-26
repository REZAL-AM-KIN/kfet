import {Button, Modal, NumberInput, Stack, TextInput, useMantineTheme} from "@mantine/core";
import {useState} from "react";
import QrReader from 'react-qr-reader'
import errorNotif from "./ErrorNotif";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useMediaQuery} from "@mantine/hooks";
import {IconQrcode} from "@tabler/icons";

function RechargeLydiaButton({pgData, onRecharge, sx}) {
    const theme = useMantineTheme();
    const isSmallDevice = useMediaQuery('(max-width: ' + theme.breakpoints.xs + 'px)');

    const axiosPrivate = useAxiosPrivate();

    const [qrcode, setQrcode] = useState("");
    const [montant, setMontant] = useState();
    const [opened, setOpened] = useState(false);
    const [showQrScanner, setShowQrScanner] = useState(false)
    const [numberError, setNumberError] = useState(false);

    /* Function triggered when the recharge button is clicked */
    const modalOpen = () => {
        setOpened(true);
    }

    const modalClose = () => {
        setOpened(false);
        setMontant('');
        setShowQrScanner(false);
        setQrcode("");
        setNumberError(false);
    }

    const handleQrSubmit = (e) => {
        if (e) {
            e.preventDefault();
        }
        const postQr = async () => {
            try {
                await axiosPrivate.post("rechargeslydia/",
                    JSON.stringify({
                        cible_id: pgData.id,
                        montant: montant,
                        qrcode: qrcode
                    }));
                // reset the fields and close modal
                modalClose();
                if (onRecharge) {
                    onRecharge(montant);
                }
            } catch (error) {
                errorNotif("QR Submit", error?.message);
                // reset the fields without closing modal
                setMontant('');
                setQrcode("");
            }
        }
        postQr();
    }

    function handleError(error) {
        errorNotif("Scanning QrCode", error)
    }

    function handleScan(result) {
        if (result) {
            setQrcode(result);
            setShowQrScanner(false);
            handleQrSubmit();
        }
    }


    const smallModal = () => {
        return (
            <Modal
                centered
                opened={opened}
                onClose={() => {
                    modalClose()
                }}
                title={"Recharger " + pgData.bucque + " " + pgData.fams}
            >
                <Stack>
                    <NumberInput
                        data-autofocus
                        type="number"
                        hideControls
                        placeholder="76"
                        label="Montant de la recharge"
                        value={montant}
                        onChange={setMontant}
                        min={0}
                    />
                    {showQrScanner
                        ? <QrReader
                            onError={handleError}
                            onScan={handleScan}
                            delay={100}
                            style={{width: '100%'}}
                        />
                        : <Button
                            disabled={!montant}
                            onClick={() => {
                                setShowQrScanner(true)
                            }}>Scanner</Button>
                    }
                </Stack>
            </Modal>
        );
    }

    const bigModal = () => {
        return (
            <Modal
                centered
                opened={opened}
                onClose={() => {
                    modalClose()
                }}
                title={"Recharger " + pgData.bucque + " " + pgData.fams}
            >
                <form onSubmit={handleQrSubmit}>
                    <Stack>
                        <NumberInput
                            data-autofocus
                            hideControls
                            type="number"
                            placeholder="76"
                            label="Montant de la recharge"
                            min={0}
                            value={montant}
                            onChange={setMontant}
                            rightSectionWidth={"10%"}
                            error={numberError}
                            rightSection={<IconQrcode onClick={() => {
                                setShowQrScanner(!showQrScanner && montant);
                                montant?setNumberError(false):setNumberError("veuillez remplir le montant");
                            }}/>
                            }
                        />
                        {showQrScanner
                            ? <QrReader
                                onError={handleError}
                                onScan={handleScan}
                                delay={100}
                                style={{width: '100%'}}
                            />
                            : <TextInput
                                type="text"
                                placeholder="Scanner le QR Code"
                                label="Montant de la recharge"
                                disabled={!montant}
                                value={qrcode}
                                onChange={(e) => setQrcode(e.currentTarget.value)}
                            />}
                        <Button
                            type={"submit"}
                            disabled={!qrcode || !montant}
                        >
                            Recharger
                        </Button>
                    </Stack>
                </form>
            </Modal>
        )
            ;
    }

    // to avoid re-rendering and, therefore, loosing focus
    let modal
    if (isSmallDevice) {
        modal = smallModal();
    } else {
        modal = bigModal();
    }

    return (
        <>
            <Button onClick={modalOpen} sx={sx}>Qr Code</Button>
            {modal}
        </>
    );
}

export default RechargeLydiaButton;
