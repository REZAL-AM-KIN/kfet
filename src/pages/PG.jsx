import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate'


import {PgCard} from '../components/PgCard';
import {Grid, SimpleGrid} from "@mantine/core";
import errorNotif from "../components/ErrorNotif";
import {PgHistory} from "../components/History";
import RechargeButton from "../components/RechargeButton";
import RechargeLydiaButton from "../components/RechargeLydiaButton";
import {usePermissions} from "../hooks/useUser";


function PG({setPage}) {
    useEffect(()=>{setPage("Debucquage")})

    // current displayed pgId from url
    let params = useParams();
    const pgId = params.pgId;

    // here we get user's permissions and render get it to outlet
    const axiosPrivate = useAxiosPrivate();
    const permissions = usePermissions();

    const [pgData, setPgData] = useState({});
    const [history, setHistory] = useState([]);


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
        console.log("UPDATE: PG");
        // make the api call for pg info:
        const controller = new AbortController();
        getPG();
        return () => {
            controller.abort();
        }
        // eslint-disable-next-line
    }, [pgId]);

    useEffect(() => {
        console.log("UPDATE: PgHistory");
        const controller = new AbortController();
        getHistory()
        return () => {
            controller.abort();
        }
        // eslint-disable-next-line
    }, [pgData])


    //callbacks
    const handleRecharge = () =>{
        // update pgdata and history
        getHistory();
        getPG();
    }


    return (
        <Grid style={{backgroundColor: "pink"}}>
            <Grid.Col md={8}>
                <PgCard data={pgData}/>
                <SimpleGrid>
                    {permissions.recharge
                        ?<RechargeButton pgData={pgData} onRecharge={handleRecharge}/>
                        :<></>}
                    {/*check lydia permissions*/}
                    <RechargeLydiaButton pgData={pgData}/>

                </SimpleGrid>
            </Grid.Col>
            <Grid.Col md={4}>

                <PgHistory history={history}/>
            </Grid.Col>
        </Grid>
    );
}

export default PG;