
import {Stack, Text} from "@mantine/core"
import {useEffect} from "react";

const Finss = ({setPage}) => {
    useEffect(()=>{setPage("Finss")})

    return(
        <Stack>
           <Text>Finss Page</Text>
        </Stack>
    );
}

export default Finss;