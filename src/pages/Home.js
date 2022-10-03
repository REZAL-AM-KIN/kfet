import {Grid, Title} from "@mantine/core"
import {useEffect, useState} from "react";
import PgCard from "../components/PgCard";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useNavigate} from "react-router-dom";
import History from "../components/History";
import {Carousel} from "@mantine/carousel";
import errorNotif from "../components/ErrorNotif";

const Home = ({setPage}) => {
  useEffect(()=>{setPage("Home")});
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const [pgData, setPgData] = useState({});
  const [history, setHistory] = useState([]);
  let pgHistory = [];

  useEffect(() => {
    console.log("UPDATE: PG");
    const controller = new AbortController();
    const getUser = async () => {
      try {
        const response = await axiosPrivate.get("utilisateur/");
        if (response.data) {
          setPgData(response.data);
        } else {
          errorNotif("Utilisateur","Pas de PG activé correspondant");
        }
      } catch (error) {
        errorNotif("Utilisateur", error.message)
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
        errorNotif("History", error.message);
        console.log(error);
      }
    }
    getHistory()
    return () => {
      controller.abort();
    }
  }, [axiosPrivate])

  // populate pg history
  history.forEach((line)=>{
      if (line.cible_evenement.id === pgData.id) {
        pgHistory.push(line);
      }
  });

  return(
      <Grid gutter={0}>
        <Grid.Col md={6}>
          <PgCard data={pgData} onClick={()=>navigate("/pg/"+pgData.id)}/>
          <div>GRAPHE</div>
        </Grid.Col>
        <Grid.Col md={6} p={"xl"}>
          <Title>Historique</Title>
          <Carousel height="60%" withIndicators loop>
            <Carousel.Slide>
              <History history={history} general/>
            </Carousel.Slide>
            <Carousel.Slide>
              <History history={pgHistory}/>
            </Carousel.Slide>
          </Carousel>
        </Grid.Col>
      </Grid>
  );
}

export default Home;