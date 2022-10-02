import {Autocomplete, useMantineTheme} from "@mantine/core";


const SearchPg = ()=>{
    const theme = useMantineTheme()

    return (
        <Autocomplete
            data={["ddee","de"]}
            styles={{
                input: {
                    borderRadius: 9,
                    borderStyle: "none",
                    borderWidth: 2,
                    '&:focus': {
                        borderStyle: "solid",
                        borderColor: theme.fn.variant({variant: 'filled', color: theme.primaryColor}).background
                    }
                }
            }}
        >

        </Autocomplete>
    );
}

export default SearchPg