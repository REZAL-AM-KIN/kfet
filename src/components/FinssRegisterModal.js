import {Modal, Table, Text, Button, Center, NumberInput} from "@mantine/core";
import { useForm } from '@mantine/form';
import {useFinssProducts} from "../hooks/finssHooks/useFinssProduct";
import {Fragment, useEffect} from "react";
import {DataTable} from "mantine-datatable";

function sendParticipation(values){
    console.log(values)
    //TODO: Faire l'envoie des participations (prébucquage) --> Finir backend
}


const FinssRegisterModal = ({opened, setOpened, finssId})=>{


    const {isLoading, productsList} = useFinssProducts(finssId)


    const form = useForm({
        initialValues:{
            products:[]
        }
    })



    useEffect(()=>{
        const data = productsList.map(({id, ...product}) => ({key:id, ...product, qts: (product.obligatoire ? 1: 0)}))
        form.setValues({products:data})
    },[productsList])



    function closeModal(){
        setOpened(false);
    }


    const tableData = form.values.products.map((item,index)=>({...item, index}))

    const QtsInput = ({item})=> {

        return (

                <NumberInput
                    min={item.obligatoire ? 1 : 0}
                    {...form.getInputProps('products.' + item.index + '.qts', {type: 'numberinput'})}
                />

                );
    }

    console.log(tableData)


    /*

    <Table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Description</th>
                            <th style={{width:100}}>Quantités</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rows}
                    </tbody>
                </Table>
     */

    return (
        <Modal opened={opened} onClose={closeModal}>
            <form onSubmit={form.onSubmit((values)=>sendParticipation(values))}>
                <DataTable
                    minHeight={150}
                    fetching={isLoading}
                    records={tableData}
                    columns={[
                    {accessor: "nom", title:"Nom"},
                    {accessor: "actions", title:"Quantités", textAlignment:"center", width:"20%", render: (product) => (<QtsInput item={product}/>) }
                ]}
                    noRecordsText="Aucun produit n'existe pour se fin'ss"
                    rowExpansion={{
                        trigger: 'always',
                        content: ({product})=>(
                            <Text>{product.description}</Text>
                        ),
                    }}
                >
                </DataTable>

                <Center>
                    <Button type="submit">Submit</Button>
                </Center>
            </form>
        </Modal>
    )
}

export default FinssRegisterModal;