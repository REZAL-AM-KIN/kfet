
import {Stack, Text} from "@mantine/core"
import {useEffect} from "react";

//TODO : Restreindre l'accès à la page sur permission
const Pianss = ({setPage}) => {
    useEffect(()=>{setPage("Pianss")})

    return(
        <Stack>
            <Text>Pianss Page</Text>
        </Stack>
    );
}

export default Pianss;