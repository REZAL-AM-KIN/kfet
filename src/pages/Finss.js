
import {Stack, Text} from "@mantine/core"
import {useEffect} from "react";
import FinssSelector from "../components/FinssSelector";

const Finss = ({setPage}) => {
    useEffect(()=>{setPage("Finss")})

    return(
        <Stack>
           <Text>Finss Page</Text>
            <FinssSelector data={[{ "id":1, "name":"test", "desc":"test desc", "date":"22/06/2001"}]}></FinssSelector>
        </Stack>
    );
}

export default Finss;