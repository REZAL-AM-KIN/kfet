import {Stack, Paper, Tabs, Text} from "@mantine/core";
import FinssGeneralParameters from "../../components/Finss/FinssGeneralParameters";
import FinssProductsParameters from "../../components/Finss/FinssProductsParameters";
import GestionEtatEvent from "../../components/Finss/FinssGestionEtat";
import {etatEventValues} from "../../hooks/finssHooks/EtatEventConst";


const FinssParameters = ({usefinssinfo, usefinssproduct, usebucquage})=>{

        //TODO : Force refresh of finss info when tabs change to parameter tab
    return (
        <Tabs keepMounted={false} defaultValue="general">
            <Tabs.List grow position="apart">
                <Tabs.Tab value="general">Paramètres généraux</Tabs.Tab>
                <Tabs.Tab value="products">Paramètres des produits</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="general">
                <Stack align="center" >
                    {usefinssinfo.finssInfo.etat_event < etatEventValues.TERMINE ?
                        <Paper shadow="md" radius="lg" p="md" withBorder style={{position:'relative', margin:"16px 8px 0px 8px", maxWidth:"fit-content"}}>
                            <GestionEtatEvent usefinssinfo={usefinssinfo} usebucquage={usebucquage}/>
                        </Paper>
                        : null
                    }

                    <Paper shadow="md" radius="lg" p="md" withBorder style={{position:'relative', margin:"16px 8px 0px 8px", maxWidth:"fit-content"}}>
                        <Text ta="center">Paramètres généraux</Text>
                        <FinssGeneralParameters usefinssinfo={usefinssinfo} usebucquage={usebucquage}/>
                    </Paper>
                </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="products">
                <FinssProductsParameters usefinssinfo={usefinssinfo} usefinssproduct={usefinssproduct} usebucquage={usebucquage}/>
            </Tabs.Panel>
        </Tabs>

    )
}

export default FinssParameters