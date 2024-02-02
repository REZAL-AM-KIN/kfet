
import {Stack, Text} from "@mantine/core"
import {useEffect} from "react";

const Stats_PG = ({setPage}) => {
    useEffect(()=>{setPage("Stat_PG")})

    return(
        <Stack>
           <Text>Statistiques PG Page</Text>
        </Stack>
    );
}

export default Stats_PG;