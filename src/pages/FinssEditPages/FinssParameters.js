import {Center, Stack, Tabs, Text} from "@mantine/core";
import FinssGeneralParameters from "../../components/Finss/FinssGeneralParameters";
import FinssProductsParameters from "../../components/Finss/FinssProductsParameters";


const FinssParameters = ({usefinssinfo, usefinssproduct, usebucquage})=>{

        //TODO : Force refresh of finss info when tabs change to parameter tab
    return (
        <Tabs keepMounted={false} defaultValue="general">
            <Tabs.List grow position="apart">
                <Tabs.Tab value="general">Paramètres généraux</Tabs.Tab>
                <Tabs.Tab value="products">Paramètres des produits</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="general">
                <FinssGeneralParameters usefinssinfo={usefinssinfo} usebucquage={usebucquage}/>
            </Tabs.Panel>

            <Tabs.Panel value="products">
                <FinssProductsParameters usefinssproduct={usefinssproduct} usebucquage={usebucquage}/>
            </Tabs.Panel>
        </Tabs>

    )
}

export default FinssParameters