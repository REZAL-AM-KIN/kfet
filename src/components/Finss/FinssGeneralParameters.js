import {useEffect} from "react";
import {closeAllModals} from "@mantine/modals";
import {
    Box,
    Button,
    Center,
    LoadingOverlay,
    Stack,
    Textarea,
    TextInput,
} from "@mantine/core";
import {useForm} from "@mantine/form";
import {DatePickerInput} from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";

import ManagersSelector from "../ManagersSelector";
import {etatEventValues} from "../../hooks/finssHooks/EtatEventConst";


const FinssGeneralParameters = ({usefinssinfo, usebucquage, useFinssList})=>{
    // Initialisation de la Form des paramètres du fin'ss
    const form = useForm({
        initialValues:{
            titre: "",
            description : "",
            date_event : "",
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

        transformValues: (values) => ({
            ...values,
            date_event: new Date(Date.UTC(values.date_event.getFullYear(), values.date_event.getMonth(), values.date_event.getDate())).toISOString().split('T')[0],
        }),
    })


    //0n remplie la form avec les valeurs du finss
    //update de la date à chaque chargement de fin'ss (il faut créer un objet "Date" pour le component "DatePickerInput")
    useEffect(()=>{
        // On crée un objet Date à partir du string date_event (si ce string est défini)
        const data = usefinssinfo.finssInfo
        if (data.date_event)
            data.date_event = new Date(data.date_event)
        form.setValues(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usefinssinfo.finssInfo])

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
            <Center>
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
                            popoverProps={{ withinPortal: true }}
                            {...form.getInputProps('date_event')}

                        />

                        <ManagersSelector
                            {...form.getInputProps('managers')}
                        />

                        <Button disabled={!form.isValid() || usefinssinfo.finssInfo.etat_event === etatEventValues.TERMINE}
                                style={{width:"100%", marginTop: 10}} type="submit">Enregistrer</Button>
                    </form>
                </Box>
            </Center>
        </Stack>
    )
}
export default FinssGeneralParameters;
