import {useEffect, useState} from "react";
import errorNotif from "../../components/ErrorNotif";
import {axiosPrivate} from "../../auth/axios";

export function useFinssList(){
    const [isLoading, setLoading] = useState(true)
    const [finssList, setFinssList] = useState([])

    // get Finss list
    useEffect(() => {
        const controller = new AbortController();
        const getFinss = async () => {
            try {
                const response = await axiosPrivate.get("event/");
                if (response.data) {
                    setFinssList(response.data.results);
                } else {
                    errorNotif("Finss","Impossible de récupérer la liste des finss");
                }
            } catch (error) {
                errorNotif("Finss", error.message)
                console.log("Error getting Finss", error);
            }
            setLoading(false)
        }
        setLoading(true)
        getFinss();
        return () => {
            controller.abort();
        }
        // eslint-disable-next-line
    }, []);

    return {isLoading, finssList}
}