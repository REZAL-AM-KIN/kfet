
import {Stack, Text} from "@mantine/core"
import {useEffect} from "react";

const Edit = ({setPage}) => {
    useEffect(()=>{setPage("Edition")})

    return(
        <Stack>
            <Text>Edition Page</Text>
        </Stack>
    );
}

export default Edit;