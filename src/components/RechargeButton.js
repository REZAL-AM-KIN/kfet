import {Button, createStyles, Modal, NumberInput, SegmentedControl, Stack} from "@mantine/core";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import errorNotif from "./ErrorNotif";
import {useState} from "react";


const useStyles = createStyles((theme) => ({
    root: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
        boxShadow: theme.shadows.md,
        border: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1]
        }`,
    },

    active: {
        backgroundImage: theme.fn.gradient({ from: 'pink', to: 'orange' }),
    },

    control: {
        border: '0 !important',
    },

    labelActive: {
        color: `${theme.white} !important`,
    },
}));


function RechargeButton({pgData, sx}) {

    const axiosPrivate = useAxiosPrivate();

    const [montant, setMontant] = useState();
    const [choices, setChoices] = useState([]);
    const [methode, setMethode] = useState("");

    const [opened, setOpened] = useState(false);

    const {classes} = useStyles();


    /* function to get all the recharge methods from the server */
    const optionMethode = async () => {
        try {
            const response = await axiosPrivate.options("recharges/");
            // the answer is [{"value": "CB","display_name": "Carte bleue"}, ...].
            // just renaming display_name to label
            const methodes = response?.data?.actions?.POST?.methode?.choices.map((method) => {
                return ({value: method["value"], label: method["display_name"]});
            });
            setChoices(methodes)
            // 2nd method is chosen by default (Espèces)
            setMethode(response?.data?.actions?.POST?.methode?.choices[1].value);
        } catch (error) {
            errorNotif("Methode de Rechargement", error.message);
        }
    }

    /* Function triggered when the recharge button is clicked */
    const handleRecharge = (e) => {
        optionMethode(); // we get all the methods
        setOpened(true);
    }

    const handleRechargerSubmit = (e) => {
        e.preventDefault();
        const createRecharge = async () => {
            try {
                await axiosPrivate.post("recharges/",
                    JSON.stringify({
                        cible_id: pgData.id,
                        montant: montant,
                        methode: methode
                    }));
            } catch (error) {
                errorNotif("Recharge", error.message);
            }
        }
        errorNotif("Recharge Button triggered!", "not implemented yet!")
        console.log(pgData.id, montant, methode)
        //createRecharge();
    };


    return (
        <>
            <Button onClick={handleRecharge} sx={sx}>Recharger</Button>
            <Modal
                centered
                opened={opened}
                onClose={() => setOpened(false)}
                title={"Recharger"}
            >
                <form onSubmit={handleRechargerSubmit}>
                    <Stack>
                        <NumberInput
                            type="number"
                            hideControls
                            placeholder="76"
                            label="Montant de la recharge"
                            value={montant}
                            onChange={setMontant}
                            min={0}
                        />
                        <SegmentedControl
                            radius="lg"
                            size="sm"
                            data={choices}
                            value={methode}
                            onChange={setMethode}
                            classNames={classes}
                        />
                        <Button
                            type={"submit"}
                            disabled={!montant}>
                            Recharger
                        </Button>
                    </Stack>
                </form>
            </Modal>
        </>
    )
}

export default RechargeButton;