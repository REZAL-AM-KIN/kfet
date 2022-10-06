import {Grid, Tabs} from "@mantine/core"
import {useCallback, useEffect, useState} from "react";
import PgCard from "../components/PgCard";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useNavigate} from "react-router-dom";
import PgHistory from "../components/PgHistory";
import {Carousel} from "@mantine/carousel";
import errorNotif from "../components/ErrorNotif";
import GeneralHistory from "../components/GeneralHistory";

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
    // eslint-disable-next-line
  }, []);

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
    // eslint-disable-next-line
  }, [])

  // populate pg history
  history.forEach((line)=>{
      if (line.cible_evenement.id === pgData.id) {
        pgHistory.push(line);
      }
  });

  const [activeTab, setActiveTab] = useState("1");
  const [embla, setEmbla] = useState(null);

  const handleScroll = useCallback(() => {
    if (!embla) return;
    setActiveTab(embla.slidesInView(true)[0].toString());


  }, [embla]);

  useEffect(() => {
    if (embla) {
      embla.on('select', handleScroll);
      handleScroll();
    }
  }, [embla, handleScroll]);

  return(
      <Grid gutter={0}>
        <Grid.Col md={6}>
          <PgCard data={pgData} onClick={()=>navigate("/pg/"+pgData.id)}/>
          <div>GRAPHE</div>
        </Grid.Col>
        <Grid.Col md={6} p={"xl"}>
          <Tabs value={activeTab} onTabChange={(e)=>{embla.scrollTo(Number(e))}}> {/* à supprimer sur mobile*/}
            <Tabs.List grow>
              <Tabs.Tab value="0">Historique Général</Tabs.Tab>
              <Tabs.Tab value="1">Historique Perso</Tabs.Tab>
            </Tabs.List>
          </Tabs>
          <Carousel getEmblaApi={setEmbla} withControls={false}>
            <Carousel.Slide>
              <GeneralHistory history={history}/>
            </Carousel.Slide>
            <Carousel.Slide>
              <PgHistory history={pgHistory}/>
            </Carousel.Slide>
          </Carousel>
        </Grid.Col>
      </Grid>
  );
}

export default Home;