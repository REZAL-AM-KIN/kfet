import {Stack, Tabs, Title} from "@mantine/core"
import {useEffect} from "react";
import {useParams} from "react-router-dom";
import FinssPrebucquage from "./FinssEditPages/FinssPrebucquage";
import FinssParameters from "./FinssEditPages/FinssParameters";
import {useBucquage} from "../hooks/finssHooks/useBucquage";
import {useFinssProducts} from "../hooks/finssHooks/useFinssProduct";
import {useFinssInfo} from "../hooks/finssHooks/useFinssInfo";
import FinssBucquage from "./FinssEditPages/FinssBucquage";
import FinssDebucquage from "./FinssEditPages/FinssDebucquage";

const FinssEdit = ({setPage}) => {
    let params = useParams()
    const finssId = params.finssid

    useEffect(()=>{setPage("Finss")})
    const usebucquage = useBucquage(finssId)
    const usefinssproduct = useFinssProducts(finssId)
    const usefinssinfo = useFinssInfo(finssId)



    return(
        <Stack style={{height: "100%"}}>
            <Title order={1} align="center">{usefinssinfo.finssInfo.titre}</Title>

            <Tabs keepMounted={false} defaultValue="prebucquage" style={{
                                                                            display: "flex",
                                                                            flexDirection:"column",
                                                                            flex: "1 1 auto",
                                                                        }}
            >
                <Tabs.List grow position="apart">
                    <Tabs.Tab value="prebucquage">Prebucquage</Tabs.Tab>
                    <Tabs.Tab value="bucquage">Bucquage</Tabs.Tab>
                    <Tabs.Tab value="debucquage">Debucquage</Tabs.Tab>
                    <Tabs.Tab value="parameters">Paramètres</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel style={{flex: "1 1 auto"}} value="prebucquage" >
                    <FinssPrebucquage usebucquage={usebucquage} usefinssproduct={usefinssproduct}/>
                </Tabs.Panel>

                <Tabs.Panel style={{flex: "1 1 auto"}} value="bucquage">
                    <FinssBucquage usefinssinfo={usefinssinfo} usebucquage={usebucquage} usefinssproduct={usefinssproduct}/>
                </Tabs.Panel>

                <Tabs.Panel style={{flex: "1 1 auto"}} value="debucquage">
                    <FinssDebucquage usebucquage={usebucquage}  usefinssproduct={usefinssproduct}/>
                </Tabs.Panel>

                <Tabs.Panel value="parameters">
                    <FinssParameters usefinssinfo={usefinssinfo} usefinssproduct={usefinssproduct} usebucquage={usebucquage}/>
                </Tabs.Panel>
            </Tabs>
        </Stack>
    );
}

export default FinssEdit;