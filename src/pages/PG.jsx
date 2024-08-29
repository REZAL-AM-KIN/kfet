import {forwardRef, useCallback, useRef, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import {Grid, Stack, Group, Box} from "@mantine/core";

import {PgCard} from '../components/PgCard';
import {PgHistory} from "../components/History";
import RechargeButton from "../components/RechargeButton";
import RechargeLydiaButton from "../components/RechargeLydiaButton";
import Produits from "../components/Produits";

import {usePermissions} from "../hooks/useUser";
import {useEntiteCtxt} from "../hooks/useEntiteCtxt";
import { usePGHistory } from '../hooks/useHistory';
import { usePG } from '../hooks/usePG';

const ProduitsFwdRef = forwardRef(Produits);

function PG() {

    // current displayed pgId from url
    let params = useParams();
    const pgId = params.pgId;

    // here we get user's permissions
    const permissions = usePermissions();

    const pghistory = usePGHistory(pgId);
    const pg = usePG(pgId);

    const { entite } = useEntiteCtxt();

    const produitRef = useRef(null);

    // // focus on the use input refferenced by userRef when the component mounts
    useEffect(() => {
        produitRef.current.focus();
    }, [produitRef, pgId, entite]);

    //callbacks
    const handleSubmit = useCallback(() => {
        // update pgdata and history
        pghistory.retrieve();
        pg.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pghistory, pg]);

    return (
        <Grid>
            <Grid.Col md={8}>
                <PgCard data={pg.data}/>
                <Group grow px="md">
                    <ProduitsFwdRef
                        ref={produitRef}
                        entite={entite}
                        pgData={pg.data}
                        length={7}
                        onSubmit={handleSubmit}/>
                    <Stack>
                        {/* <Button onClick={handleSubmit}>Refresh</Button> */}
                        {permissions.recharge
                            ? <RechargeButton pgData={pg.data} onRecharge={handleSubmit}/>
                            : <></>}
                        {/*check lydia permissions*/}
                        <RechargeLydiaButton pgData={pg.data} onRecharge={handleSubmit}/>
                    </Stack>
                </Group>
            </Grid.Col>
            <Grid.Col md={4}>
                <Box h="calc(100vh - 2rem)">
                    <PgHistory history={pghistory.data}/>
                </Box>
            </Grid.Col>
        </Grid>
    );
}

export default PG;
