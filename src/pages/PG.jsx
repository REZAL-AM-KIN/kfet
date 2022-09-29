import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate'


import PgCard from '../components/PgCard';
import History from "../components/History";

function PG() {
    // current displayed pgId from url
    let params = useParams();
    const pgId = params.pgId;

    // here we get user's permissions and render get it to outlet
    const axiosPrivate = useAxiosPrivate();
    const [permissions, setPermissions] = useState({});

    const [pgData, setPgData] = useState({});
    const [err, setErr] = useState("");

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
        const URL = pgId ? "consommateurs/" + pgId + "/" : "utilisateur/";
        const controller = new AbortController();
        const getUser = async () => {
            try {
                const response = await axiosPrivate.get(URL);
                if (response.data) {
                    setPgData(response.data);
                } else {
                    setErr("Pas de PG activé correspondant");
                }
            } catch (error) {
                setErr(error.message);
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
        console.log("UPDATE: History");
        const URL = "history/" + pgId + "/";
        const controller = new AbortController();
        const getHistory = async () => {
            try {
                const response = await axiosPrivate.get(URL);
                setHistory(response.data);
            } catch (error) {
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
        <div style={{backgroundColor: "pink", height:"100vh"}}>
            <nav>Navbar</nav>
            <br/>
            <br/>
            <br/>
            <PgCard data={pgData} err={err} style={{backgroundColor: "green"}}/>
            <History history={history}/>
        </div>

    );
}

export default PG;