import {etatEventLabels, etatEventValues} from '../../hooks/finssHooks/EtatEventConst'
import {Button, Center, Text, Box, useMantineTheme} from "@mantine/core";
import {closeAllModals, openConfirmModal, openModal} from "@mantine/modals";


function endEvent(usefinss, usebucquage) {
    const checkIfFinssCanBeEnded = () =>{
        // On récupère la liste des bucquages (pas participations) qui comporte des participations bucqué mais pas débucqué
        const bucquedButNotDebucquedBucquage = usebucquage.bucquages.filter((bucquage)=> (
            bucquage.participation_event.some((participation)=>
                (participation.participation_bucquee
                    && !participation.participation_debucquee))
        ))

        // S'il reste des bucquages avec des participations non débucquées, alors on interdit la cloture
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

            // Sinon, on demande une dernière fois si l'utilisateur est sur de lui
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
                onConfirm: () => usefinss.endFinss(),
            });
        }

    }

    // Première modal de confirmation : Vérifie que l'utilisateur souhaite bien cloturer le Fin'ss
    openConfirmModal({
        title: "Clôture du fin'ss "+usefinss.finssInfo.titre,
        centered: true,
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
}

function endBucquageFinss(usefinss) {
    openConfirmModal({
        title: "Fermeture des bucquages du fin'ss "+usefinss.finssInfo.titre,
        centered: true,
        children : (
            <Text size="sm">
                Une fois les bucquages du fin'ss fermé, il ne sera plus possible de bucquer d'autres
                personnes, <i><u>ni de modifier les produits</u></i>.
            </Text>
        ),
        labels : {confirm: "Fermer les bucquages", cancel:"Annuler"},
        confirmProps:{color:"red"},
        onConfirm: () => usefinss.endBucquageFinss(),
    });
}

function endPrebucquageFinss(usefinss) {
    openConfirmModal({
        title: "Fermeture des inscriptions au fin'ss "+usefinss.finssInfo.titre,
        centered: true,
        children : (
            <Text size="sm">
                Une fois les inscriptions fermés, bah les gens y pourront pu être inscrits quoi.
                Mais ils pourront toujours être bucqué même si ils n'étaient pas inscrits!
            </Text>
        ),
        labels : {confirm: "Fermer les inscriptions", cancel:"Annuler"},
        confirmProps:{color:"red"},
        onConfirm: () => usefinss.endPrebucquageFinss(),
    });
}

const GestionEtatEvent = ({usefinssinfo, usebucquage}) => {
    const theme = useMantineTheme()
    let button_text;
    let onClick;
    switch (usefinssinfo.finssInfo.etat_event) {
        case etatEventValues.PREBUCQUAGE:
            button_text = "Fermer les inscriptions";
            onClick = ()=>endPrebucquageFinss(usefinssinfo, usebucquage);
            break;
        case etatEventValues.BUCQUAGE:
            button_text = "Fermer les bucquages";
            onClick = ()=>endBucquageFinss(usefinssinfo, usebucquage);
            break;
        case etatEventValues.DEBUCQUAGE:
            button_text = "Clôturer le Fin'ss";
            onClick = ()=>endEvent(usefinssinfo, usebucquage);
            break;
        default:
            button_text = "";
            onClick = ()=>{};
    }
    return (
        <Box style={{width:400, position:'relative'}}>
            <Center>
                <Text>
                    Etat du fin'ss: {etatEventLabels[usefinssinfo.finssInfo.etat_event]}
                </Text>
            </Center>

            {usefinssinfo.finssInfo.etat_event < etatEventValues.TERMINE ?
            <Button
                    style={{width:"100%", marginTop: 10, backgroundColor:theme.colors.red[9]}}
                    onClick={onClick}>{button_text}
            </Button>
                : null}
        </Box>
    )
}

export default GestionEtatEvent;