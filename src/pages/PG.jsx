import {forwardRef, useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';

import {Grid, SimpleGrid, Text} from "@mantine/core";

import {PgCard} from '../components/PgCard';
import {PgHistory} from "../components/History";
import RechargeButton from "../components/RechargeButton";
import RechargeLydiaButton from "../components/RechargeLydiaButton";
import Produits from "../components/Produits";

import {usePermissions} from "../hooks/useUser";
import {useEntiteCtxt} from "../hooks/useEntiteCtxt";
import { usePGHistory } from '../hooks/useHistory';
import { usePG } from '../hooks/usePG';


function PG() {

    // current displayed pgId from url
    let params = useParams();
    const pgId = params.pgId;

    // here we get user's permissions
    const permissions = usePermissions();

    const pghistory = usePGHistory(pgId);
    const pg = usePG(pgId);

    const [entite, ] = useEntiteCtxt();

    const produitRef = useRef(null);

    const ProduitFwdRef = forwardRef(Produits);

    // focus on the use input refferenced by userRef when the component mounts
    useEffect(() => {
        produitRef.current.focus();
    }, [produitRef, pgId, entite]);

    //callbacks
    const handleRecharge = () => {
        // update pgdata and history
        pghistory.retrieve();
        pg.retrieve();
    }

    const handleSubmit = (produit) => {
        console.log(produit);
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

                    <Text>Entite : {entite.nom}</Text>
                    <ProduitFwdRef entiteId={entite.id} ref={produitRef} length={7} onSubmit={handleSubmit}/>
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
