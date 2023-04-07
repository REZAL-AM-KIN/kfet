import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate'


import {PgCard} from '../components/PgCard';
import {Group, Stack} from "@mantine/core";
import errorNotif from "../components/ErrorNotif";
import {PgHistory} from "../components/History";
import RechargeButton from "../components/RechargeButton";
import RechargeLydiaButton from "../components/RechargeLydiaButton";
import {usePermissions} from "../hooks/useUser";


import {useCategorie} from "../hooks/useCategorie";
import Produits from "../components/Produits";


function PG({setPage}) {
    useEffect(() => {
        setPage("Debucquage")
    })

    // current displayed pgId from url
    let params = useParams();
    const pgId = params.pgId;

    // here we get user's permissions
    const axiosPrivate = useAxiosPrivate();
    const permissions = usePermissions();

    const [pgData, setPgData] = useState({});
    const [history, setHistory] = useState([]);
    const [allProduits, setAllProduits] = useState([]);
    const [categorie,] = useCategorie();

    const getHistory = async () => {
        try {
            const response = await axiosPrivate.get("history/" + pgId + "/");
            setHistory(response.data);
        } catch (error) {
            errorNotif("PgHistory/pg", error.message);
            console.log(error);
        }
    }

    const getPG = async () => {
        try {
            const response = await axiosPrivate.get("consommateurs/" + pgId);
            if (response.data) {
                setPgData(response.data);
            } else {
                errorNotif("Consommateur/pg", "Pas de PG activé correspondant");
            }
        } catch (error) {
            errorNotif("Consommateur/", error.message);
            console.log("Error getting consommateur", error);
        }
    }


    useEffect(() => {
        console.log("UPDATE: PG and HISTORY");
        // make the api call for pg info:
        const controller = new AbortController();
        getPG();
        getHistory()
        return () => {
            controller.abort();
        }
        // eslint-disable-next-line
    }, [pgId]);


    useEffect(() => {
        /* Retrieves the produits list from the server and extracts the categories list */
        const controller = new AbortController();
        const getProduits = async () => {
            try {
                const response = await axiosPrivate.get("produits/");
                setAllProduits(response.data.results);
            } catch (error) {
                console.log(error);
            }
        }
        getProduits();
        return () => {
            controller.abort();
        }
        // eslint-disable-next-line
    }, [])


    //callbacks
    const handleTransaction = () => {
        // update pgdata and history
        getHistory();
        getPG();
    }

    return (
        <Group grow sx={{backgroundColor: "pink"}}>
            <Stack md={8} justify="flex-start">
                <PgCard data={pgData}/>
                <Group position={"apart"} grow>
                    <Stack>
                        {permissions.recharge
                            ? <RechargeButton pgData={pgData} onRecharge={handleTransaction}/>
                            : <></>}

                        <RechargeLydiaButton pgData={pgData} onRecharge={handleTransaction}/>
                    </Stack>
                    <Produits
                        pgData={pgData}
                        produits={allProduits}
                        categorie={categorie}
                        onDebucuqage={handleTransaction}/>
                </Group>
            </Stack>
            <Stack md={4}>
                <PgHistory history={history}/>
            </Stack>
        </Group>
    );
}

export default PG;