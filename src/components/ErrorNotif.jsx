import {showNotification} from "@mantine/notifications";
import {IconX} from "@tabler/icons-react";

export default function errorNotif (localisation, message) {
    showNotification({
        icon: <IconX size="1rem" />,
        color: "red",
        autoClose: false,
        title: 'Oh Oh.... Erreur de '+localisation,
        message: 'Une erreur est survenue: '+message,
    });
};
