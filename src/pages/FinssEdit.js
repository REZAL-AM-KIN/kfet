import {Center, Stack, Tabs} from "@mantine/core"
import {useEffect} from "react";
import {useParams} from "react-router-dom";
import FinssPrebucquage from "../components/FinssPrebucquage";
import FinssParameters from "../components/FinssParameters";

const FinssEdit = ({setPage}) => {
    let params = useParams()

    useEffect(()=>{setPage("Finss")})




    return(
        <Stack>
            <Center>
                <h1>Gestion de Fin'ss</h1>
                <h4>{params.finssid}</h4>
            </Center>

            <Tabs keepMounted={false} defaultValue="prebucquage">
                <Tabs.List grow position="apart">
                    <Tabs.Tab value="prebucquage">Prebucquage</Tabs.Tab>
                    <Tabs.Tab value="bucquage">Bucquage</Tabs.Tab>
                    <Tabs.Tab value="debucquage">Debucquage</Tabs.Tab>
                    <Tabs.Tab value="parameters">Paramètres</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="prebucquage">
                    <FinssPrebucquage/>
                </Tabs.Panel>

                <Tabs.Panel value="bucquage">

                </Tabs.Panel>

                <Tabs.Panel value="debucquage">

                </Tabs.Panel>

                <Tabs.Panel value="parameters">
                    <FinssParameters finssid={params.finssid}/>
                </Tabs.Panel>
            </Tabs>
        </Stack>
    );
}

export default FinssEdit;