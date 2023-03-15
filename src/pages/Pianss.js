
import {Center, Stack, Paper, Button, Tabs, Modal, Text} from "@mantine/core"
import {useEffect, useState} from "react";
import PianssForm from "../components/PianssForm";
import {usePians} from "../hooks/usePianss";
import {IconCirclePlus} from "@tabler/icons";
import {useLocalPianss} from "../hooks/useLocalPianss";
import {closeAllModals, openModal} from "@mantine/modals";

//TODO : Restreindre l'accès à la page sur permission
const Pianss = ({setPage}) => {
    useEffect(()=>{setPage("Pianss")})

    const usepianss = usePians()
    const uselocalpianss = useLocalPianss()

    const [pianssModalOpen, setPianssModalOpen] = useState(false)
    const [pianssUnistallModalOpen, setPianssUnistallModalOpen] = useState(false)

    const tabsList = usepianss.pianssList.map((pianss) => (
        <Tabs.Tab value={pianss.id.toString()} key={pianss.id}>{pianss.nom}</Tabs.Tab>
    ))

    const panelList = usepianss.pianssList.map((pianss) => (
        <Tabs.Panel value={pianss.id.toString()} key={pianss.id}>
            <PianssForm pianssInfo={pianss} uselocalpianss={uselocalpianss} usepianss={usepianss}/>
        </Tabs.Panel>
    ))

    //Si le pian'ss local n'existe plus sur la liste des pian'ss, on le désinstalle et on affiche une modal pour informer l'utilisateur
    useEffect(()=>{
        if(uselocalpianss.localPianss && !usepianss.pianssList.some((pianss)=>pianss.id===uselocalpianss.localPianss.id)){
            uselocalpianss.uninstallPianss()

            setPianssUnistallModalOpen(true)
        }
    },[usepianss.pianssList, uselocalpianss.localPianss])

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
                <PianssForm usepianss={usepianss} uselocalpianss={uselocalpianss} forCreation/>
            </Modal>

            <Modal opened={pianssUnistallModalOpen} onClose={()=>setPianssUnistallModalOpen(false)} title="Désinstallation d'un pian'ss">
                <>
                    <Text size="sm">
                        Le pian'ss installé sur cet appareil n'est plus présent dans la liste des pian'ss. <br/>
                        Il a donc été désinstallé.
                    </Text>
                    <Button fullWidth color="red" onClick={()=>setPianssUnistallModalOpen(false)} mt="md">C'est compris.</Button>
                </>
            </Modal>

        </>
    );
}

export default Pianss;