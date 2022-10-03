import {Grid} from "@mantine/core"
import {useEffect, useState} from "react";
import PgCard from "../components/PgCard";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useNavigate} from "react-router-dom";
import History from "../components/History";

const Home = ({setPage}) => {
  useEffect(()=>{setPage("Home")});

  const navigate = useNavigate();

  const axiosPrivate = useAxiosPrivate();
  const [pgData, setPgData] = useState({});
  const [err, setErr] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    console.log("UPDATE: PG");
    // make the api call for pg info:
    const controller = new AbortController();
    const getUser = async () => {
      try {
        const response = await axiosPrivate.get("utilisateur/");
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
  }, [axiosPrivate]);

  useEffect(() => {
    const controller = new AbortController();
    const getHistory = async () => {
      try {
        const response = await axiosPrivate.get("history/");
        setHistory(response.data.results);
      } catch (error) {
        console.log(error);
      }
    }
    getHistory()
    return () => {
      controller.abort();
    }
  }, [axiosPrivate])

  return(
      <Grid>
        <Grid.Col md={6}>
          <PgCard data={pgData} err={err} onClick={()=>navigate("/pg/"+pgData.id)}/>
          <div>GRAPHE</div>
        </Grid.Col>
        <Grid.Col md={6} p={"xl"}>
          <History history={history} general/>
        </Grid.Col>
      </Grid>
  );
}

export default Home;