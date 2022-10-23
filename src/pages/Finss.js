
import {Stack, Text, Center} from "@mantine/core"
import {useEffect, useState} from "react";
import FinssSelector from "../components/FinssSelector";
import errorNotif from "../components/ErrorNotif";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useFinssList} from "../hooks/finssHooks/useFinssList";

const Finss = ({setPage}) => {


    useEffect(()=>{setPage("Finss")})

    const axiosPrivate = useAxiosPrivate()




    const {finssList, isLoading} = useFinssList()

    return(
        <Stack>
           <Center>
               <h1>Listes des fin'ss</h1>
           </Center>
            <FinssSelector data={finssList} isLoading={isLoading}
            />
        </Stack>
    );
}

export default Finss;