import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate'


import {PgCard} from '../components/PgCard';
import {Grid} from "@mantine/core";
import errorNotif from "../components/ErrorNotif";
import {PgHistory} from "../components/History";
import RechargeButton from "../components/RechargeButton";
import RechargeLydiaButton from "../components/RechargeLydiaButton";


function PG({setPage}) {
    useEffect(()=>{setPage("Debucquage")})

    // current displayed pgId from url
    let params = useParams();
    const pgId = params.pgId;

    // here we get user's permissions and render get it to outlet
    const axiosPrivate = useAxiosPrivate();
    const [permissions, setPermissions] = useState({});

    const [pgData, setPgData] = useState({});

    const [history, setHistory] = useState([]);


    useEffect(() => {
        const controller = new AbortController();
        const getPermissions = async () => {
            try {
                const response = await axiosPrivate.get("permissions/");
                setPermissions(response.data);
            } catch (error) {
                if (error?.response?.status !== 403) {
                    console.log("Error getting logged user's permissions ", error);
                    errorNotif("Permissions", error.message);
                }
            }
        }
        getPermissions()
        return () => {
            controller.abort();
        }
        // eslint-disable-next-line
    }, [pgId])
    console.log(permissions);

    useEffect(() => {
        console.log("UPDATE: PG");
        // make the api call for pg info:
        const URL = "consommateurs/" + pgId;
        const controller = new AbortController();
        const getUser = async () => {
            try {
                const response = await axiosPrivate.get(URL);
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
        getUser();
        return () => {
            controller.abort();
        }
        // eslint-disable-next-line
    }, [pgId]);


    useEffect(() => {
        console.log("UPDATE: PgHistory");
        const URL = "history/" + pgId + "/";
        const controller = new AbortController();
        const getHistory = async () => {
            try {
                const response = await axiosPrivate.get(URL);
                setHistory(response.data);
            } catch (error) {
                errorNotif("PgHistory/pg", error.message);
                console.log(error);
            }
        }
        getHistory()
        return () => {
            controller.abort();
        }
        // eslint-disable-next-line
    }, [pgId])


    return (
        <Grid fluid style={{backgroundColor: "pink"}}>
            <Grid.Col md={8}>
                <PgCard data={pgData}/>
                {permissions.recharge
                    ?<RechargeButton pgData={pgData}/>
                    :<></>}
                <RechargeLydiaButton pgData={pgData}/>
            </Grid.Col>
            <Grid.Col md={4}>

                <PgHistory history={history}/>
            </Grid.Col>
        </Grid>
    );
}

export default PG;