import {Modal} from "@mantine/core";


const FinssRegisterModal = ({opened, setOpened, FinssId})=>{

    function closeModal(){
        setOpened(false);
    }

    return (
        <Modal opened={opened} onClose={closeModal}>

        </Modal>
    )
}