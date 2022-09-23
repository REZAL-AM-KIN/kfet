import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate'


import PgCard from '../components/PgCard';

function PG() {
    // current displayed pgId from url
    let params = useParams();
    const pgId = params.pgId;

    // here we get user's permissions and render get it to outlet
    const axiosPrivate = useAxiosPrivate();
    const [permissions, setPermissions] = useState({});

    const [data, setData] = useState({});
    const [err, setErr] = useState("");

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
                    setData(response.data);
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


    return (
        <div style={{backgroundColor: "pink"}}>
            <nav>Navbar</nav>
            <br/>
            <br/>
            <br/>
            <PgCard data={data} err={err} style={{backgroundColor: "green"}}/>
        </div>

    );
}

export default PG;