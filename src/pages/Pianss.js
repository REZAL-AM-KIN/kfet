
import {Center, Stack, Paper, Button, Tabs, Modal} from "@mantine/core"
import {useEffect, useState} from "react";
import PianssForm from "../components/PianssForm";
import {usePians} from "../hooks/usePianss";
import {IconCirclePlus} from "@tabler/icons";

//TODO : Restreindre l'accès à la page sur permission
const Pianss = ({setPage}) => {
    useEffect(()=>{setPage("Pianss")})

    const usepianss = usePians()
    const [pianssModalOpen, setPianssModalOpen] = useState(false)

    const tabsList = usepianss.pianssList.map((pianss) => (
        <Tabs.Tab value={pianss.id.toString()} key={pianss.id}>{pianss.nom}</Tabs.Tab>
    ))

    const panelList = usepianss.pianssList.map((pianss) => (
        <Tabs.Panel value={pianss.id.toString()} key={pianss.id}>
            <PianssForm pianssInfo={pianss} usepianss={usepianss}/>
        </Tabs.Panel>
    ))

    return(
        <>
        <Stack spacing="0" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Center>
                <h1 style={{margin:"10px"}}>Gestion des pian'ss</h1>
            </Center>

            <Paper shadow="md" radius="lg" p="md" withBorder style={{margin: "10px 10px 0px 10px", paddingTop:6, flex: "1 1 auto"}}>
                <Tabs keepMounted={false} defaultValue={usepianss.pianssList.length>0 ? usepianss.pianssList[0].id.toString() : ""}>

                    <Tabs.List>
                        {tabsList}
                        <Button variant="subtle" onClick = {()=>setPianssModalOpen(true)}><IconCirclePlus color="green"/></Button>
                    </Tabs.List>

                    {panelList}

                </Tabs>


            </Paper>
        </Stack>
            <Modal opened={pianssModalOpen} onClose={()=>setPianssModalOpen(false)} title="Création d'un pian'ss">
                <PianssForm usepianss={usepianss} forCreation/>
            </Modal>
        </>
    );
}

export default Pianss;