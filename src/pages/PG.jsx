import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate'


import {PgCard} from '../components/PgCard';
import {Grid, SimpleGrid, Text} from "@mantine/core";
import errorNotif from "../components/ErrorNotif";
import {PgHistory} from "../components/History";
import RechargeButton from "../components/RechargeButton";
import RechargeLydiaButton from "../components/RechargeLydiaButton";
import {usePermissions} from "../hooks/useUser";
import {useEntiteCtxt} from "../hooks/useEntiteCtxt";


function PG() {

    // current displayed pgId from url
    let params = useParams();
    const pgId = params.pgId;

    // here we get user's permissions
    const axiosPrivate = useAxiosPrivate();
    const permissions = usePermissions();

    const [pgData, setPgData] = useState({});
    const [history, setHistory] = useState([]);
    const [allProduits, setAllProduits] = useState([]);
    const [entite, ] = useEntiteCtxt();

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
            const response = await axiosPrivate.get("consommateurs/" + pgId + "/");
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
    const handleRecharge = () => {
        // update pgdata and history
        getHistory();
        getPG();
    }


    return (
        <Grid>
            <Grid.Col md={8}>
                <PgCard data={pgData}/>
                <SimpleGrid>
                    {permissions.recharge
                        ? <RechargeButton pgData={pgData} onRecharge={handleRecharge}/>
                        : <></>}
                    {/*check lydia permissions*/}
                    <RechargeLydiaButton pgData={pgData} onRecharge={handleRecharge}/>
                </SimpleGrid>
                {/*<Produits produits={allProduits} categorie={categorie}/>*/}
                <Text>{entite.name}</Text>
            </Grid.Col>
            <Grid.Col md={4}>
                <PgHistory history={history}/>
            </Grid.Col>
        </Grid>
    );
}

export default PG;
