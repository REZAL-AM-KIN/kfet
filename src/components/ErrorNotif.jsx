import {showNotification} from "@mantine/notifications";
import {IconX} from "@tabler/icons-react";

export default function errorNotif (localisation, message) {
    showNotification({
        icon: <IconX size="1rem" />,
        color: "red",
        autoClose: 30000,
        title: 'Oh Oh.... Erreur de '+localisation,
        message: 'Une erreur est survenue: '+message,
    });
};
