import {Stack} from "@mantine/core"
import {useEffect, useState} from "react";
import PgCard from "../components/PgCard";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useNavigate} from "react-router-dom";

const Home = ({setPage}) => {
  useEffect(()=>{setPage("Home")});

  const navigate = useNavigate();

  const axiosPrivate = useAxiosPrivate();
  const [pgData, setPgData] = useState({});
  const [err, setErr] = useState("");

  useEffect(() => {
    console.log("UPDATE: PG");
    // make the api call for pg info:
    const URL = "utilisateur/";
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
  }, []);

  return(
      <Stack>
        <PgCard data={pgData} err={err} onClick={()=>navigate("/pg/"+pgData.id)}/>

      </Stack>
  );
}

export default Home;