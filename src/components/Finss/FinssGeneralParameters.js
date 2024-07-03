import {useEffect} from "react";
import {closeAllModals, openConfirmModal, openModal} from "@mantine/modals";
import {
    Box,
    Button,
    Center,
    LoadingOverlay,
    Stack,
    Switch,
    Text,
    Textarea,
    TextInput,
    useMantineTheme, 
} from "@mantine/core";
import {useForm} from "@mantine/form";
import {DatePickerInput} from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";

import ManagersSelector from "../ManagersSelector";

function endEvent(usefinss, usebucquage) {
    const endFinss = ()=>{
        usefinss.endFinss()
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
                            Tous les débucquages n'ont pas été effectués.<br/>
                            Rendez-vous dans section débucquage.
                        </Text>
                        <Button fullWidth color="red" onClick={closeAllModals} mt="md">C'est compris.</Button>
                    </>
                ),
            });

        // Sinon on demande une dernière fois si l'utilisateur est sur de lui
        }else{
            openConfirmModal({
                title: "Clôture du fin'ss "+usefinss.finssInfo.titre,
                centered: true,
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
        title: "Clôture du fin'ss "+usefinss.finssInfo.titre,
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

const FinssGeneralParameters = ({usefinssinfo, usebucquage, useFinssList})=>{
    const theme = useMantineTheme()

    //Si on est dans le cas d'une création, on créer un faux objet usefinssinfo vide.
    if(!usefinssinfo){
        const date = new Date()
        usefinssinfo = {isLoading: false, finssInfo:{date_event:date.toISOString(), can_subscribe:true, ended:false}};
    }


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
    //update de la date à chaque chargement de fin'ss (il faut créer un objet "Date" pour le component "DatePickerInput")
    useEffect(()=>{
        // On crée un objet Date à partir du string date_event
        const data = usefinssinfo.finssInfo
        data.date_event = new Date(data.date_event)
        form.setValues(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function formSubmit(values) {
        if(!usebucquage){
            useFinssList.createFinss(values).then(()=>closeAllModals())

        }else{
            usefinssinfo.changeInfo(values)
        }
    }


    //Construction de l'UI
    return (
        <Stack>
            <Center style={{paddingTop:20}}>

                <Box style={{width:400, position:'relative'}}>

                    <LoadingOverlay visible={usefinssinfo.isLoading || (useFinssList && useFinssList.isSending)} overlayBlur={2} />

                    <form  onSubmit={form.onSubmit((values) => formSubmit(values))}>
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


                        <DatePickerInput
                            withAsterisk
                            label = "Date de Fin'ss"
                            valueFormat="DD MMMM YYYY"
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


                        <Button disabled={!form.isValid() || usefinssinfo.finssInfo.ended} style={{width:"100%", marginTop: 10}} type="submit">Enregistrer</Button>
                    </form>

                    {/* S'il ne s'agit pas d'une création de finss, on affiche le bouton de cloture*/}
                    {usebucquage ?
                        <Button disabled={usefinssinfo.finssInfo.ended} style={{width:"100%", marginTop: 10, backgroundColor:theme.colors.red[9]}} onClick={()=>{endEvent(usefinssinfo, usebucquage)}}>Clôturer le Fin'ss</Button>
                        : ""}
                    </Box>
            </Center>



        </Stack>


    )
}
export default FinssGeneralParameters;
