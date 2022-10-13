import { Button } from "@mantine/core";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import errorNotif from "./ErrorNotif";
import {useState} from "react";


function RechargeButton({pgId, sx}) {

    const axiosPrivate = useAxiosPrivate();

    const [montant, setMontant] = useState("");
    const [methodes, setMethodes] = useState([]);
    const [methode, setMethode] = useState("");

    /* function to get all the recharge methods from the server */
    const optionMethode = async () => {
        try {
            const response = await axiosPrivate.options("recharges/");
            setMethodes(response?.data?.actions?.POST?.methode?.choices);
            // 2nd method is chosen by default (Espèces)
            setMethode(response?.data?.actions?.POST?.methode?.choices[1].value);
        } catch (error) {
            errorNotif("Methode de Rechargement",error.message);
        }
    }

    /* Function triggered when the recharge button is clicked */
    const handleRecharge = (e) => {
        errorNotif("Recharge Button triggered!", "not implemented yet!")
    }

    const handleRechargerSubmit = (e) => {
        e.preventDefault();

        const createRecharge = async () => {
            try {
                const response = await axiosPrivate.post("recharges/",
                    JSON.stringify({
                        cible_id: pgId,
                        montant: montant,
                        methode: methode
                    }));
            } catch (error) {
                errorNotif("Recharge",error.message);
            }
        }
        //createRecharge();
    };

    return(
        <Button onClick={handleRecharge} sx={sx}>Recharger</Button>
    )
}

export default RechargeButton;