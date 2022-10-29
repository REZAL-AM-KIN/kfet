import {openConfirmModal} from "@mantine/modals";
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
import {useFinssInfo} from "../hooks/finssHooks/useFinssInfo";
import {useForm} from "@mantine/form";
import {useEffect} from "react";
import {DatePicker} from "@mantine/dates";
import {IconCalendar} from "@tabler/icons";

function endEvent(finss) {
    const endFinss = ()=>{

    }

    const checkIfFinssCanBeEnded = () =>{

    }

    // Première modal de confirmation : Vérifie que l'utilisateur souhaite bien cloturer le Fin'ss
    const confirmModal = () => openConfirmModal({
        title: "Cloture du fin'ss "+finss.titre,
        centered: true,
        children : (
            <Text size="sm">
                Une fois le fin'ss cloturé, il ne sera plus possible de modifier ses paramètres ni de débucquer
                de nouvelles personnes.
            </Text>
        ),
        labels : {confirm: "Cloturer le Fin'ss", cancel:"Annuler"},
        confirmProps:{color:"red"},
        onConfirm: checkIfFinssCanBeEnded,
    });

    confirmModal()
}

const FinssGeneralParameters = ({finssid})=>{
    const theme = useMantineTheme()
    const useFinss = useFinssInfo(finssid)


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


    useEffect(()=>{
        // On crée un objet Date à partir du string date_event
        const data = useFinss.finssInfo
        data.date_event = new Date(data.date_event)
        form.setValues(data)
    }, [useFinss.finssInfo])


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

                        <MultiSelect
                            data={[]}
                            label= "Managers"
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

                    <Button style={{width:"100%", marginTop: 10, backgroundColor:theme.colors.red[9]}} onClick={()=>{endEvent(useFinss.finssInfo)}}>Cloturer le Fin'ss</Button>
                </Box>
            </Center>



        </Stack>


    )
}
export default FinssGeneralParameters;
