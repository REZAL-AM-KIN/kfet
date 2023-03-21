import {useForm} from "@mantine/form";
import {Textarea, TextInput, Button, Stack, useMantineTheme, Tooltip, LoadingOverlay,Box} from "@mantine/core";
import {useEffect} from "react";

// React Node qui permet de modifier les paramètres d'un Pian'ss

//TODO : Ajouter le champ "groupe" dans le formulaire (necessite l'endpoint entités)

const PianssForm = ({pianssInfo, usepianss, uselocalpianss, forCreation}) => {
    const theme = useMantineTheme()


    if((!usepianss && forCreation)){
        throw "forCreation option require usepianss."
    }
    if(!forCreation && !uselocalpianss){
        throw "uselocalpianss is requiered for modification mode."
    }

    //Initialisation du formulaire
    const form = useForm({
        initialValues: {
            id: null,
            nom: "",
            description: "",
            groupe: "",
            },

        validateInputOnChange:["nom", "description"],

        validate:{
            nom: (value) => (value.length >30 ? "Le nom du Pian'ss ne peut pas dépasser 30 caractères" :
                value.length===0 ? "Le nom du Pian'ss ne peut pas être vide" : undefined),
            description: (value) => (value.length >100 ? "La description du Pian'ss ne peut pas dépasser 100 caractères" : null),
        }

        });

    // On met à jour les valeurs du formulaire si on est en mode modification
    useEffect(()=>{
        if(!forCreation){
            form.setValues(pianssInfo)
        }
    }, [pianssInfo, forCreation])

    function submitForm(values){
        if(forCreation){
            usepianss.addPianss(values)
        }else{
            usepianss.updatePianss(values)
        }
    }

    const localPianssButton = () => {

        function clickHandler() {
            if(uselocalpianss.isDeviceAPianss && uselocalpianss.localPianss.id === pianssInfo.id){
                uselocalpianss.uninstallPianss()
            }else{
                uselocalpianss.installPianss(pianssInfo)
            }
        }

        return (
            <Button
                style={{width:"100%", marginTop: 15, backgroundColor:theme.colors.orange[6]}}

                //Si un pian'ss différent du pian'ss courant est installé, on change le onClick pour ne rien faire
                // car sinon même avec data-disabled, on peut cliquer sur le bouton
                onClick={uselocalpianss.isDeviceAPianss && uselocalpianss.localPianss.id !== pianssInfo.id ? (event)=>event.preventDefault() : clickHandler}

                //Lorsque le bouton est désactivé, un met un tooltip pour expliquer pourquoi,
                //Pour que le tooltip s'affiche, on doit utiliser data-disabled au lieu de disabled car disabled ne trigger pas onMouseLeave (c'est un bug de React)
                // Plus d'info voir la doc de mantine sur le Button.

                // on ajoute la prop sx si le Pian'ss est déjà installé
                sx={uselocalpianss.isDeviceAPianss && uselocalpianss.localPianss.id !== pianssInfo.id ? { '&[data-disabled]': { pointerEvents: 'all' }}: null}
                // on désactive le bouton si le Pian'ss est déjà installé
                data-disabled={uselocalpianss.isDeviceAPianss && uselocalpianss.localPianss.id !== pianssInfo.id ? true: undefined}

            >
                {uselocalpianss.isDeviceAPianss && uselocalpianss.localPianss.id === pianssInfo.id ? "Désinstaller" : "Installer"} le Pian'ss
            </Button>
        )
    }


    return (
        <Stack spacing={0} >
            <Box style={{position:"relative"}}>
                <LoadingOverlay visible={usepianss?.isLoading} />

                <form onSubmit={form.onSubmit((values)=>submitForm(values))}>
                    <TextInput
                        label={"Nom"}
                        placeholder={"Nom du Pian'ss"}
                        {...form.getInputProps("nom")}
                        withAsterisk
                    />

                    <Textarea
                        label="Description"
                        placeholder = "Description"
                        autosize
                        minRows={2}
                        maxRows={4}
                        {...form.getInputProps('description')}
                    />

                    <Button disabled={!form.isValid()} style={{width:"100%", marginTop: 10}} type="submit">Enregistrer</Button>
                </form>

                {/* S'il ne s'agit pas d'une création de pianss, on affiche le bouton de supression*/}
                {!forCreation ?
                    <>
                        <Button style={{width:"100%", backgroundColor:theme.colors.red[9], marginTop:5}} onClick={()=>{usepianss.deletePianss(pianssInfo)}}>Supprimer le Pian'ss</Button>

                        {
                            uselocalpianss.isDeviceAPianss && uselocalpianss.localPianss.id !== pianssInfo.id ?
                                <Tooltip label={"Le pian'ss "+uselocalpianss.localPianss.nom+" est installé sur cet appareil."} placement="top" withArrow>
                                    {localPianssButton()}
                                </Tooltip>
                                :
                                localPianssButton()
                        }

                    </>
                    : ""}
            </Box>
        </Stack>


    )
}

export default PianssForm;