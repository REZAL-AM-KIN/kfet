import {useEffect, useState} from "react";
import errorNotif from "../../components/ErrorNotif";
import useAxiosPrivate from "../useAxiosPrivate";

export function useFinssProducts(finssId){
    const axiosPrivate = useAxiosPrivate()

    const [isLoading, setLoading] = useState(true)
    const [productsList, setProductsList] = useState([])

    // get Finss list
    useEffect(() => {
        const controller = new AbortController();
        const getFinss = async () => {
            try {
                const response = await axiosPrivate.get("productevent/?finss="+finssId);
                if (response.data) {
                    setProductsList(response.data.results);
                } else {
                    errorNotif("Finss","Impossible de récupérer la liste des produits");
                }
            } catch (error) {
                errorNotif("Finss", error.message)
                console.log("Error getting Finss", error);
            }
            setLoading(false)
        }
        if(finssId) {
            setLoading(true)
            getFinss();
        }
        return () => {
            controller.abort();
        }
        // eslint-disable-next-line
    }, [finssId]);

    return {isLoading, productsList}
}