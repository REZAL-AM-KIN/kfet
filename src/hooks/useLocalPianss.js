import {Text, Button} from "@mantine/core";
import {closeAllModals, openModal} from "@mantine/modals";
import errorNotif from "../components/ErrorNotif";
import {useEffect, useState} from "react";
import {showNotification} from "@mantine/notifications";
import {IconCheck} from "@tabler/icons";

export function useLocalPians(){

    const [localPianss, setLocalPianss] = useState(null)

    const isDeviceAPianss = localPianss!==null

    const installPianss= (pianssInfo)=> {
        // On installe le pian'ss
        if(localStorage.getItem("pianss")!==null){
            errorNotif("Pian'ss", "Un pian'ss est déjà installé sur cet appareil.")
            return
        }
        localStorage.setItem("pianss", JSON.stringify(pianssInfo))
        checkPianssInstalled()

        showNotification( {
            icon: <IconCheck size={18} />,
            color: "green",
            autoClose: true,
            title: "Installation du Pian'ss",
            message: 'Le pian\'ss a bien été installé'
        })

    }

    const uninstallPianss = ()=>{
        if(localStorage.getItem("pianss")===null){
            errorNotif("Pian'ss", "Aucun pian'ss n'est installé sur cet appareil.")
            return
        }

        localStorage.removeItem("pianss")
        checkPianssInstalled()

        showNotification( {
            icon: <IconCheck size={18} />,
            color: "green",
            autoClose: true,
            title: "Désinstallation du Pian'ss",
            message: 'Le pian\'ss a bien été désinstallé'
        })

    }

    const getInstalledPianss = ()=>{
        return JSON.parse(localStorage.getItem("pianss"))
    }

    const checkPianssInstalled = ()=>{
         setLocalPianss(getInstalledPianss())
    }


    useEffect(()=>{
        checkPianssInstalled()
    }, [])

    return {localPianss, isDeviceAPianss, installPianss, getInstalledPianss, uninstallPianss}
}