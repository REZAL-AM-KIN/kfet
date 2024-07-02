import {useState} from "react";
import {Center, Paper, Tabs, Button, Modal, Stack, Text, Tooltip} from "@mantine/core"
import {closeAllModals, openConfirmModal, openModal} from "@mantine/modals";
import {IconCirclePlus} from "@tabler/icons-react";

import FinssProductForm from "./FinssProductForm";

const FinssProductsParameters = ({usefinssproduct, usebucquage, usefinssinfo}) => {

    const [productModalOpen, setProductModalOpen] = useState(false);

    const isDebucquageStarted = usebucquage.bucquages.some((bucquage)=>bucquage.participation_event.some((participation)=>participation.participation_debucquee))

    //Fonction appeler au clique sur le bouton de suppression.
    //On interdit la suppression du produit s'il y a des participations bucquée sur ce produit.
    function deleteProduct(event, product) {
        // On récupère tous les bucquages qui comporte des participations bucquee sur le produit à supprimer
        //On omet tout de même les participations avec une quantité de 0 car elle ne concerne pas des bucquages réel
        // (ce genre de cas peut arriver en cas de réctification sur un débucquage)
        const bucquagesOnThisProduct = usebucquage.bucquages.filter((bucquage)=> (
            bucquage.participation_event.some((participation)=>
                (participation.participation_bucquee
                    && participation.product_participation === product.id
                    && participation.quantity!==0))
        ))

        // Si il y a des bucquage (donc des participations) bucquee sur ce produit. Alors on interdit la suppression
        if(bucquagesOnThisProduct.length !==0 ){
            openModal({
                title: 'Suppression du produit impossible :',
                centered: true,
                children: (
                    <>
                        <Text size="sm">
                           Des participations bucquées existent déjà pour ce produit. <br/>
                           Il n'est plus possible de le supprimer.
                        </Text>
                        <Button fullWidth color="red" onClick={closeAllModals} mt="md">C'est compris.</Button>
                    </>
                ),
            });

        //Sinon, on demande juste confirmation à l'utilisateur
        }else{
            openConfirmModal({
                title: 'Suppression du produit '+product.nom+' ?',
                children: (
                    <Text size="sm">
                        Vous êtes sur le point de supprimer un produit.<br/>
                        Les inscriptions liées à ce produit seront <i><u><b>définitivement</b></u></i> supprimées.
                    </Text>
                ),
                labels: { confirm: 'Supprimer', cancel: 'Annuler' },
                confirmProps:{color:"red"},
                onConfirm: () => usefinssproduct.deleteProduct(product),
            })
        }

    }

    const tabsListProducts = usefinssproduct.productsList.map((product)=>(
        //On utilise les id comme value au cas où il y est deux produit avec le même nom
        <Tabs.Tab value={product.id.toString()} key={product.id}>{product.nom}</Tabs.Tab>

    ))


    const tabsPanelList = usefinssproduct.productsList.map((product) => {
        //On transforme les prix (prix_total et prix_min) qui sont en string dans le json
        product.prix_total=parseFloat(product.prix_total)
        product.prix_min=parseFloat(product.prix_min)

        //On utilise les id comme value au cas où il y est deux produit avec le même nom
        return (
            <Tabs.Panel value={product.id.toString()} key={product.id} style={{marginLeft: "10px"}}>
                <Stack spacing="xs">
                    <FinssProductForm
                        initialProduct={product}
                        formSubmitCallback={(values) => usefinssproduct.updateProduct(values)}
                        disabled={usefinssinfo.finssInfo.ended || isDebucquageStarted}
                    />

                    <Tooltip  label={usefinssinfo.finssInfo.ended || isDebucquageStarted ? "Suppression impossible, debucquage commencé" : "Ajouter un produit"}>
                            <Button
                                    disabled = {usefinssinfo.finssInfo.ended || isDebucquageStarted}
                                    sx={{ '&[disabled]': { pointerEvents: 'all' } }}
                                    color="red"
                                    onClick={(e) => deleteProduct(e, product)}
                            >Supprimer</Button>
                    </Tooltip>

                </Stack>
            </Tabs.Panel>
        )
    })


    return (
        <>
        <Center>
            <Paper shadow="md" radius="lg" p="md" withBorder style={{width:600, margin:"20px auto", position:'relative'}}>
                <Tabs
                    keepMounted={false}
                    orientation="vertical"
                    defaultValue={usefinssproduct.productsList.length>0 ? usefinssproduct.productsList[0].id.toString() : ""}
                    styles={{
                        tabsList:{display:'flex', flexDirection:'column', flexWrap: 'nowrap', maxWidth: "35%"},
                        tab:{ paddingLeft:'0.5vw'},
                        tabLabel: {display: 'inline-block', minWidth:0, wordWrap: 'break-word',  whiteSpace:'normal'},
                        }}
                >

                    <Tabs.List >
                        {tabsListProducts}

                        {/*Bouton d'ajout de produit*/}
                        <Tooltip  label={usefinssinfo.finssInfo.ended || isDebucquageStarted ? "Ajout impossible, debucquage commencé" : "Ajouter un produit"}>
                            <Button
                                disabled = {usefinssinfo.finssInfo.ended || isDebucquageStarted}
                                sx={{ '&[disabled]': { pointerEvents: 'all' } }}
                                variant="subtle"
                                onClick = {()=>{setProductModalOpen(true)}}
                            >
                                <IconCirclePlus color="green"/>
                            </Button>
                        </Tooltip>
                    </Tabs.List>

                    {tabsPanelList}

                </Tabs>
            </Paper>
        </Center>
        <Modal opened={productModalOpen} onClose={()=>setProductModalOpen(false)}>
            <FinssProductForm formSubmitCallback={(values)=>{
                                                                usefinssproduct.addProduct(values);
                                                                setProductModalOpen(false);
                                                            }}
            />
        </Modal>
        </>
    )
}
export default  FinssProductsParameters