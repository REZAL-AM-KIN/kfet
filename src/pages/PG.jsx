import {useState} from 'react';
import {useParams} from 'react-router-dom';

import {PgCard} from '../components/PgCard';
import {Grid, SimpleGrid, Text, TextInput} from "@mantine/core";
import {PgHistory} from "../components/History";
import RechargeButton from "../components/RechargeButton";
import RechargeLydiaButton from "../components/RechargeLydiaButton";
import {usePermissions} from "../hooks/useUser";
import {useEntiteCtxt} from "../hooks/useEntiteCtxt";
import { usePGHistory } from '../hooks/useHistory';
import { usePG } from '../hooks/usePG';
import { useProduitByEntite } from '../hooks/useProduitByEntite';


function PG() {

    // current displayed pgId from url
    let params = useParams();
    const pgId = params.pgId;

    // here we get user's permissions
    const permissions = usePermissions();

    const pghistory = usePGHistory(pgId);
    const pg = usePG(pgId);

    const [entite, ] = useEntiteCtxt();

    const produits = useProduitByEntite(entite.id);

    const [recherche, setRecherche] = useState("");


    //callbacks
    const handleRecharge = () => {
        // update pgdata and history
        pghistory.retrieve();
        pg.retrieve();
    }


    return (
        <Grid>
            <Grid.Col md={8}>
                <PgCard data={pg.data}/>
                <SimpleGrid>
                    {permissions.recharge
                        ? <RechargeButton pgData={pg.data} onRecharge={handleRecharge}/>
                        : <></>}
                    {/*check lydia permissions*/}
                    <RechargeLydiaButton pgData={pg.data} onRecharge={handleRecharge}/>
                    <Text>Entite : {entite.name}</Text>
                    <TextInput
                          placeholder="Rechercher un produit"
                          value={recherche}
                          onChange={(event) => setRecherche(event.currentTarget.value)}
                    />
                    {produits.data.filter((produit) => {
                        return produit.raccourci.toLowerCase().includes(recherche.toLowerCase())
                    }).map((produit) => {
                        return (
                            <Text key={produit.id}>{produit.raccourci} - {produit.nom}</Text>
                        )
                    }
                    )}
                </SimpleGrid>
                {/*<Produits produits={produits} categorie={categorie}/>*/}
            </Grid.Col>
            <Grid.Col md={4}>
                <PgHistory history={pghistory.data}/>
            </Grid.Col>
        </Grid>
    );
}

export default PG;
