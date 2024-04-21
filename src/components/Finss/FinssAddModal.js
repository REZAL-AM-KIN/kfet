import { Modal } from "@mantine/core";
import FinssGeneralParameters from "./FinssGeneralParameters";

//Modal pour ajouter un finss
const openFinssAddModal = (useFinssList)=> { (
        <Modal centered title="Ajouter une fin'ss">
            <FinssGeneralParameters useFinssList={useFinssList}/>
        </Modal>
    );
}

export default openFinssAddModal;