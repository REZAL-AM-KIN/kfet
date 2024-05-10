import {Grid, RingProgress, Tabs, Text, useMantineTheme} from "@mantine/core"
import {useCallback, useEffect, useState} from "react";
import {PgCard} from "../components/PgCard";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useNavigate} from "react-router-dom";
import {Carousel} from "@mantine/carousel";
import errorNotif from "../components/ErrorNotif";
import {GeneralHistory, PgHistory} from "../components/History";
import {useMediaQuery} from "@mantine/hooks";
import {useUser} from "../hooks/useUser";

const Home = () => {
    const navigate = useNavigate();

    const theme = useMantineTheme();
    const isSmallDevice = useMediaQuery('(max-width: ' + theme.breakpoints.xs + ')');

    const [activeTab, setActiveTab] = useState("1");
    const [embla, setEmbla] = useState(null);

    const axiosPrivate = useAxiosPrivate();
    const [history, setHistory] = useState([]);
    let pgHistory = [];

    // get Utilisateur
    const pgData = useUser();

    // get history (10 000 lines)
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

    // sync carousel with tabs
    const handleScroll = useCallback(() => {
        if (!embla) return;
        setActiveTab(embla.slidesInView(true)[0].toString());
    }, [embla]);
    // set listener for carousel
    useEffect(() => {
        if (embla) {
            embla.on('select', handleScroll);
            handleScroll();
        }
    }, [embla, handleScroll]);

    // populate pg history
    // TODO: mieux de get history pg?
    history.forEach((line) => {
        if (line.cible_evenement.id === pgData.id) {
            pgHistory.push(line);
        }
    });


    return (
        <Grid gutter={0}>
            <Grid.Col md={6}>
                <PgCard data={pgData} onClick={() => navigate("/pg/" + pgData.id)}/>
                <RingProgress
                    size={200}
                    thickness={20}
                    label={
                        <Text size="xs" align="center" px="xs" sx={{pointerEvents: 'none'}}>
                            TODO dès qu'on aura les couleurs :D
                        </Text>
                    }
                    sections={[
                        {value: 76, color: "red", tooltip: "eh oui, 76"},
                        {value: 8.2, color: "orange", tooltip: "a toi!"}
                    ]}/>
            </Grid.Col>
            <Grid.Col md={6} p={isSmallDevice ? "0" : "xl"}>
                <Tabs value={activeTab} onTabChange={(e) => {
                    embla.scrollTo(Number(e))
                }}> {/* à supprimer sur mobile*/}
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
