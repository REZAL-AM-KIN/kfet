import {Center, Stack} from "@mantine/core"
import {useEffect, useState} from "react";
import FinssSelector from "../components/FinssSelector";
import {useFinssList} from "../hooks/finssHooks/useFinssList";
import FinssRegisterModal from "../components/FinssRegisterModal";
import {useParams} from "react-router-dom";

const Finss = ({setPage}) => {
    let params = useParams()

    useEffect(()=>{setPage("Finss")})

    const [modalOpened, setModalOpened] = useState(false)
    const [finssBucquage, setFinssBucquage] = useState()


    const {finssList, isLoading} = useFinssList()

    useEffect(()=>{
        if(params.applyto){
            setFinssBucquage(params.applyto)
            setModalOpened(true)
        }
    },[params])


    return(
        <Stack>
           <Center>
               <h1>Listes des fin'ss</h1>
           </Center>
            <FinssSelector
                data={finssList}
                isLoading={isLoading}
                setFinssId={setFinssBucquage}
                setModalOpened={setModalOpened}
            />

            <FinssRegisterModal
                opened={modalOpened}
                setOpened={setModalOpened}
                finssId={finssBucquage}
            />



        </Stack>
    );
}

export default Finss;