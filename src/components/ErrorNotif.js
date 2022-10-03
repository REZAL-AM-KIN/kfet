import {showNotification} from "@mantine/notifications";
import {IconX} from "@tabler/icons";

const errorNotif = (localisation, message) => {
    showNotification({
        icon: <IconX size={18} />,
        color: "red",
        autoClose: false,
        title: 'Oh Oh.... Erreur de '+localisation,
        message: 'Une erreur est survenue: '+message,
    });
}

export default errorNotif;