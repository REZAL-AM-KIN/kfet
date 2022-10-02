
import {Stack, Text} from "@mantine/core"
import {useEffect} from "react";

const Home = ({setPage}) => {
  useEffect(()=>{setPage("Home")})

  return(
      <Stack>
        <Text >Exemple Homehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh</Text>
        <Text>Ligne 2</Text>
          <Text>Ligne 2</Text>
          <Text>Ligne 2</Text>
          <Text>Ligne 2</Text>
          <Text>Ligne 2</Text>
          <Text>Ligne 2</Text>
          <Text>Ligne 2</Text>
          <Text>Ligne 2</Text>
          <Text>Ligne 2</Text><Text>Ligne 2</Text><Text>Ligne 2</Text>
          <Text>Ligne 2</Text>
          <Text>Ligne 2</Text><Text>Ligne 2</Text><Text>Ligne 2</Text>
          <Text>Ligne 2</Text>
          <Text>Ligne 2</Text>
          <Text>Ligne 2</Text>
      </Stack>
  );
}

export default Home;