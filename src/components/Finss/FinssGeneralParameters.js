import {closeAllModals, openConfirmModal, openModal} from "@mantine/modals";
import {
    Box,
    Button,
    Center,
    LoadingOverlay,
    MultiSelect,
    Stack,
    Switch,
    Text,
    Textarea,
    TextInput,
    useMantineTheme
} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useEffect, useState} from "react";
import {DatePicker} from "@mantine/dates";
import {IconCalendar} from "@tabler/icons";
import ManagersSelector from "../ManagersSelector";

function endEvent(finss, usebucquage) {
    const endFinss = ()=>{
        // TODO : End fin'ss
    }

    const checkIfFinssCanBeEnded = () =>{
               // On récupère la liste des bucquages (pas participations) qui comporte des participations bucqué mais pas débucqué
        const bucquedButNotDebucquedBucquage = usebucquage.bucquages.filter((bucquage)=> (
                                                    bucquage.participation_event.some((participation)=>
                                                        (participation.participation_bucquee
                                                            && !participation.participation_debucquee))
                                                ))

        // Si il reste des bucquages avec des participations non débucquées, alors on interdit la cloture
        if(bucquedButNotDebucquedBucquage.length!==0){
            console.log(bucquedButNotDebucquedBucquage.length)
            openModal({
                title: 'Clôture du Fin\'ss impossible :',
                centered: true,
                children: (
                    <>
                        <Text size="sm">
                            Tous les débucquages non pas été effectués.<br/>
                            Rendez-vous dans section débucquage.
                        </Text>
                        <Button fullWidth color="red" onClick={closeAllModals} mt="md">C'est compris.</Button>
                    </>
                ),
            });

        // Sinon on demande une dernière fois si l'utilisateur est sur de lui
        }else{
            openConfirmModal({
                title: "Clôture du fin'ss "+finss.titre,
                centered: true,
                closeOnConfirm: false,
                children : (
                    <Text size="sm">
                        Les conditions permettant la clôture du fin'ss sont réunis.<br/>
                        La clôture sera <i><u><b>définitive</b></u></i>.
                    </Text>
                ),
                labels : {confirm: "Clôturer le Fin'ss", cancel:"Annuler"},
                confirmProps:{color:"red"},
                onConfirm: endFinss,
            });
        }

    }

    // Première modal de confirmation : Vérifie que l'utilisateur souhaite bien cloturer le Fin'ss
    const confirmModal = () => openConfirmModal({
        title: "Clôture du fin'ss "+finss.titre,
        centered: true,
        closeOnConfirm: false,
        children : (
            <Text size="sm">
                Une fois le fin'ss clôturé, il ne sera plus possible de modifier ses paramètres ni de débucquer
                de nouvelles personnes.
            </Text>
        ),
        labels : {confirm: "Clôturer le Fin'ss", cancel:"Annuler"},
        confirmProps:{color:"red"},
        onConfirm: checkIfFinssCanBeEnded,
    });

    confirmModal()
}

const FinssGeneralParameters = ({usefinssinfo, usebucquage})=>{
    const theme = useMantineTheme()
    const useFinss = usefinssinfo



    // Initialisation de la Form des paramètres du fin'ss
    const form = useForm({
        initialValues:{
            titre: "",
            description : "",
            can_subscribe : false,
            date_event : "",
            ended: false,
            managers: []
        },
        validateInputOnChange:["titre", "description", "date_event"],

        validate:{
            titre: (value) => (value.length>50 ? "Le titre doit faire moins de 50 caractères" :
                value.length===0 ? "Le titre est obligatoire !": null),
            description: (value) => (value.length>200 ? "La description doit faire moins de 200 caractères" :
                value.length===0 ? "La description est obligatoire !": null),
            date_event: (value) =>(!value ? "La date est obligatoire !":null)
        },
    })


    //0n remplie la form avec les valeurs du finss
    //update de la date à chaque chargement de fin'ss (il faut créer un objet "Date" pour le component "DatePicker")
    useEffect(()=>{
        // On crée un objet Date à partir du string date_event
        const data = useFinss.finssInfo
        data.date_event = new Date(data.date_event)
        form.setValues(data)
    }, [useFinss.finssInfo])


    //Construction de l'UI
    return (
        <Stack>
            <Center style={{paddingTop:20}}>

                <Box style={{width:400, position:'relative'}}>

                    <LoadingOverlay visible={useFinss.isLoading} overlayBlur={2} />

                    <form onSubmit={form.onSubmit((values) => useFinss.changeInfo(values))}>
                        <TextInput
                            label="Nom"
                            placeholder = "Nom"
                            {...form.getInputProps('titre')}
                            withAsterisk
                        />
                        <Textarea
                            label="Description"
                            placeholder = "Description"
                            withAsterisk
                            autosize
                            minRows={2}
                            maxRows={4}
                            {...form.getInputProps('description')}

                        />


                        <DatePicker
                            withAsterisk
                            label = "Date de Fin'ss"
                            inputFormat="DD/MM/YYYY"
                            dropdownPosition="bottom-start"
                            icon={<IconCalendar size={16} />}
                            {...form.getInputProps('date_event')}

                        />

                        <ManagersSelector
                            {...form.getInputProps('managers')}
                        />

                        <Center>
                            <Switch
                                labelPosition="left"
                                label="Ouvert à l'inscription"
                                {...form.getInputProps('can_subscribe',{type:'checkbox'})}
                            />
                        </Center>


                        <Button disabled={!form.isValid()} style={{width:"100%", marginTop: 10}} type="submit">Enregistrer</Button>
                    </form>

                    <Button style={{width:"100%", marginTop: 10, backgroundColor:theme.colors.red[9]}} onClick={()=>{endEvent(useFinss.finssInfo, usebucquage)}}>Clôturer le Fin'ss</Button>
                </Box>
            </Center>



        </Stack>


    )
}
export default FinssGeneralParameters;