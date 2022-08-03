import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate'

function PG(props) {
  const params = useParams();

  const axiosPrivate = useAxiosPrivate();



  // const solde = 0;
  const [nom, setNom] = useState("");
  const [solde, setSolde] = useState("");
  const [dep, setDep] = useState("");
  const id = props.id || params.pgId;
  // make the api call for pg info:
  const URL = "consommateurs/";
  useEffect(() => {
    const controller = new AbortController();

    const getUser = async () => {
      try {
        const response = await axiosPrivate.get(URL+id+'/');
        setNom(response.data.consommateur_nom);
        setSolde(response.data.solde);
        setDep(response.data.totaldep);
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    }

    getUser();
    return () => {
      controller.abort();
    }
  }, [id])

  return(
    <div>
      <div>PG n° {id}</div><br/>
      <div>Nom: {nom}</div><br/>
      <div>solde: {solde}</div><br/>
      <div>depenses: {dep}</div><br/>
    </div>
  )

}

export default PG;
