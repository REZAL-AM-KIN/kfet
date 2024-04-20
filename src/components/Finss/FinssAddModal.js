import {openModal} from "@mantine/modals";
import FinssGeneralParameters from "./FinssGeneralParameters";

//Modal pour ajouter un finss
const openFinssAddModal = (useFinssList)=> {
    openModal({
        title: "Ajouter un fin'ss",
        centered: true,
        children: (
            <>
                <FinssGeneralParameters useFinssList={useFinssList}/>
            </>
        ),
    });
}

export default openFinssAddModal;