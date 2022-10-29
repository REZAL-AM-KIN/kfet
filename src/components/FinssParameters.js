import {Center, Stack, Tabs, Text} from "@mantine/core";
import FinssGeneralParameters from "./FinssGeneralParameters";


const ProductsParameters = ()=>{
    return (

        <Stack>
            <Center>
                <Text>
                    Product parameters
                </Text>
            </Center>
        </Stack>

    )
}

const FinssParameters = ({finssid})=>{


    return (
        <Tabs keepMounted={false} defaultValue="general">
            <Tabs.List grow position="apart">
                <Tabs.Tab value="general">Paramètres généraux</Tabs.Tab>
                <Tabs.Tab value="products">Paramètres des produits</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="general">
                <FinssGeneralParameters finssid={finssid}/>
            </Tabs.Panel>

            <Tabs.Panel value="products">>
                <ProductsParameters />
            </Tabs.Panel>
        </Tabs>

    )
}

export default FinssParameters