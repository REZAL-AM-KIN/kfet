import useAxiosPrivate from "./useAxiosPrivate";
import {useEffect, useState} from "react";
import errorNotif from "../components/ErrorNotif";

export function useConsommateursList(){
    const axiosPrivate = useAxiosPrivate()

    const [isLoading, setLoading] = useState(true)
    const [consommateurs, setConsommateurs] = useState([])

    const retrieveConsommateurs = async () => {
        setLoading(true)
        try {
            const response = await axiosPrivate.get("consommateurs/");
            if (response.data) {
                setConsommateurs(response.data.results);
            } else {
                errorNotif("Consommateurs","Impossible de récupérer la liste des consommateurs");
            }
        } catch (error) {
            errorNotif("Consommateurs", error.message)
            console.log("Error getting Consommateurs", error);
        }
        setLoading(false)
    }

    // get Finss list
    useEffect(() => {
        const controller = new AbortController();

        setLoading(true)
        retrieveConsommateurs();

        return () => {
            controller.abort();
        }
        // eslint-disable-next-line
    }, []);

    return {consommateurs, isLoading, retrieveConsommateurs}
}