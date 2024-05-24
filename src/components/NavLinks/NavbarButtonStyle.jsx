import {createStyles} from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    icon: {
        width : "2rem",
        height: "2rem",
        "stroke-width" : 1.5,
    },

    link: {
        width: "3rem",
        height: "3rem",
        borderRadius: theme.radius.md,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.white,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
            color: theme.fn.variant({variant: 'light', color: theme.primaryColor}).color,
        },
    },

    active: {
        '&, &:hover': {
            backgroundColor: theme.fn.variant({variant: 'light', color: theme.primaryColor}).background,
            color: theme.fn.variant({variant: 'light', color: theme.primaryColor}).color,
        },
    },
}));

export default useStyles;