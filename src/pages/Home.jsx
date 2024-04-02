import {Grid, RingProgress, Tabs, Text, useMantineTheme} from "@mantine/core"
import {useCallback, useEffect, useState} from "react";
import {PgCard} from "../components/PgCard";
import {useNavigate} from "react-router-dom";
import {Carousel} from "@mantine/carousel";
import {GeneralHistory, PgHistory} from "../components/History";
import {useMediaQuery} from "@mantine/hooks";
import {useUser} from "../hooks/useUser";
import { useHistory, usePGHistory } from "../hooks/useHistory";

const Home = () => {
    const navigate = useNavigate();

    const theme = useMantineTheme();
    const isSmallDevice = useMediaQuery('(max-width: ' + theme.breakpoints.xs + 'px)');

    const [activeTab, setActiveTab] = useState("1");
    const [embla, setEmbla] = useState(null);

    const history = useHistory();

    // get Utilisateur
    const pgData = useUser();

    const pgHistory = usePGHistory(pgData.id);

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
                        <GeneralHistory history={history.data}/>
                    </Carousel.Slide>
                    <Carousel.Slide>
                        <PgHistory history={pgHistory.data}/>
                    </Carousel.Slide>
                </Carousel>
            </Grid.Col>
        </Grid>
    );
}

export default Home;
