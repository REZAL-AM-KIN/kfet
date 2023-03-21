
import {
    Center,
    Stack,
    Paper,
    Button,
    Tabs,
    Modal,
    Text,
    Title,
    useMantineTheme,
    Box,
    LoadingOverlay
} from "@mantine/core"
import {useEffect, useState} from "react";
import PianssForm from "../components/PianssForm";
import {usePians} from "../hooks/usePianss";
import {IconCirclePlus} from "@tabler/icons";
import {useLocalPianss} from "../hooks/useLocalPianss";


//TODO : Restreindre l'accès à la page sur permission
const Pianss = ({setPage}) => {
    useEffect(()=>{setPage("Pianss")})

    const theme = useMantineTheme()

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
        if(usepianss.isLoading) {
            return
        }

        if(uselocalpianss.localPianss && !usepianss.pianssList.some((pianss)=>pianss.id===uselocalpianss.localPianss.id)){
            uselocalpianss.uninstallPianss()

            setPianssUnistallModalOpen(true)
        }
    },[usepianss.pianssList, uselocalpianss.localPianss, usepianss.isLoading])

    return(
        <>
        <Stack spacing="0" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Center>
                <h1 style={{margin:"10px"}}>Gestion des pian'ss</h1>
            </Center>

            <Paper shadow="md" radius="lg" p="md" withBorder style={{margin: "10px 10px 0px 10px", paddingTop:6, flex: "1 1 auto"}}>
                <Box style={{position:"relative"}}>
                    <LoadingOverlay visible={usepianss.isLoading}/>

                    {/*Si aucun pian'ss, alors on affiche un message avec un bouton, sinon on affiche la liste des pian'ss*/}
                    {usepianss.pianssList.length === 0 ?

                        // On affiche le message d'abscence de pian'ss
                        <Stack spacing="0">
                            <Center>
                                <Title color={theme.colors.red[7]} order={4}>Aucun pian'ss trouvé.</Title>
                            </Center>
                            <Center>
                                <Text size="sm">
                                    Pour en créer un, cliquez sur le bouton ci-dessous.
                                </Text>
                            </Center>

                            <Button fullWidth color="green" onClick={() => setPianssModalOpen(true)} mt="md">
                                Créer un pian'ss
                            </Button>
                        </Stack>

                        :

                        //On affiche la liste des pian'ss
                        //La valeur par défaut est le pian'ss installé si un pian'ss est installé, sinon le premier de la liste
                        <Tabs
                            keepMounted={false}
                            defaultValue={uselocalpianss.localPianss ? uselocalpianss.localPianss.id.toString() : usepianss.pianssList[0].id.toString()}
                        >

                            <Tabs.List>
                                {tabsList}
                                <Button variant="subtle" onClick={() => setPianssModalOpen(true)}><IconCirclePlus
                                    color="green"/></Button>
                            </Tabs.List>

                            {panelList}

                        </Tabs>

                    }
                </Box>
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