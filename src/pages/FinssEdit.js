import {Stack, Tabs, Title, Group, Text, Center} from "@mantine/core"
import {useParams} from "react-router-dom";
import {IconAlertTriangle} from "@tabler/icons-react";
import FinssPrebucquage from "./FinssEditPages/FinssPrebucquage";
import FinssParameters from "./FinssEditPages/FinssParameters";
import {useBucquage} from "../hooks/finssHooks/useBucquage";
import {useFinssProducts} from "../hooks/finssHooks/useFinssProduct";
import {useFinssInfo} from "../hooks/finssHooks/useFinssInfo";
import FinssBucquage from "./FinssEditPages/FinssBucquage";
import FinssDebucquage from "./FinssEditPages/FinssDebucquage";
import {etatEventValues} from "../hooks/finssHooks/EtatEventConst";

const FinssEdit = () => {
    let params = useParams()
    const finssId = params.finssid

    const usebucquage = useBucquage(finssId)
    const usefinssproduct = useFinssProducts(finssId)
    const usefinssinfo = useFinssInfo(finssId)


    return(
        <Stack style={{height: "100%"}} spacing={0}>
            <Title order={1} align="center" style={{margin:"0.5rem"}}>{usefinssinfo.finssInfo.titre}</Title>
            {usefinssinfo.finssInfo.etat_event === etatEventValues.TERMINE ?
                <Center><Group spacing="0"><IconAlertTriangle size={33} color="red"/><Text size={18} color="red"> Fin'ss cloturé !</Text></Group></Center>
                :""
            }

            <Tabs keepMounted={false} defaultValue="prebucquage" style={{
                display: "flex", flexDirection:"column", flex: "1 1 auto",
                }}
            >
                <Tabs.List grow position="apart">
                    <Tabs.Tab value="prebucquage">Prebucquage</Tabs.Tab>
                    <Tabs.Tab value="bucquage" disabled={usefinssinfo.finssInfo.etat_event < etatEventValues.BUCQUAGE}>Bucquage</Tabs.Tab>
                    <Tabs.Tab value="debucquage" disabled={usefinssinfo.finssInfo.etat_event < etatEventValues.DEBUCQUAGE}>Debucquage</Tabs.Tab>
                    <Tabs.Tab value="parameters">Paramètres</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel style={{flex: "1 1 auto"}} value="prebucquage" >
                    <FinssPrebucquage usefinssproduct={usefinssproduct} finssId={finssId}/>
                </Tabs.Panel>

                <Tabs.Panel style={{flex: "1 1 auto"}} value="bucquage">
                    <FinssBucquage usefinssinfo={usefinssinfo} usebucquage={usebucquage} usefinssproduct={usefinssproduct} finssId={finssId}/>
                </Tabs.Panel>

                <Tabs.Panel style={{flex: "1 1 auto"}} value="debucquage">
                    <FinssDebucquage usefinssinfo={usefinssinfo} usebucquage={usebucquage}  usefinssproduct={usefinssproduct} finssId={finssId}/>
                </Tabs.Panel>

                <Tabs.Panel value="parameters">
                    <FinssParameters usefinssinfo={usefinssinfo} usefinssproduct={usefinssproduct} usebucquage={usebucquage}/>
                </Tabs.Panel>
            </Tabs>
        </Stack>
    );
}

export default FinssEdit;