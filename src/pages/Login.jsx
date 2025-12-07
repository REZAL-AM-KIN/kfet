import {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "../auth/axios";

// style
import {Alert, Anchor, Button, Container, Group, Paper, PasswordInput, Text, TextInput, Title,} from '@mantine/core';
import {IconAlertCircle} from '@tabler/icons-react';

// images
import bkgImg from '../assets/101516.jpg';
import { useIsLogged, useIsActivated, useIsUserLoading } from "../hooks/useUser";
import {useDebouncedValue} from "@mantine/hooks";
import {handleLogout} from "../auth/logout";


const LOGIN_URL = 'token/';

const Login = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [isLogged, setIsLogged] = useIsLogged();
    const isActivated = useIsActivated();
    const isUserLoading = useIsUserLoading();
    const [authLoading, setAuthLoading] = useState(false);

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    // Si l'utilisateur n'est pas connecté, focus sur le champ texte référencé par userRef quand le composant est monté
    // Si l'utilisateur est déjà connecté et qu'il a un consommateur activé, redirection
    // Si l'utilisateur est connecté, mais isActivated est false, on ne change pas le focus.
    // isActivated peut encore être en chargement, et le champ user désactivé.
    useEffect(() => {
        if (sessionStorage.getItem("refresh") && sessionStorage.getItem("access")) {
            if (isActivated) {
                navigate(from);
            }
        }
        else {
            userRef.current.focus();
        }
        // eslint-disable-next-line
    }, [isActivated])

    // empty the error msg if the user changes user or pwd
    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    // function called when the login form is submited
    const handleSubmit = async (e) => {
        //don't forget to disable the default form submit (get method)
        e.preventDefault();
        try {
            setAuthLoading(true);
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({username: user, password: pwd}),
                {
                    headers: {'Content-type': 'application/json'},
                }
            );
            // on enregistre les tokens dans les cookies et dans le sessionStorage
            const access = response?.data?.access;
            const refresh = response?.data?.refresh;
            sessionStorage.setItem("access", access);
            sessionStorage.setItem("refresh", refresh);
            setIsLogged(true); //user context s'occupe de récupérer depuis l'API isActivated et pgData (si applicable)
            setUser('');
            setPwd('');
        } catch (err) {
            if (!err?.response) {
                // pas de réponse
                setErrMsg('Pas de réponse serveur, va brasser au Rezal');
            } else if (err.response?.status === 400) {
                setErrMsg("Zocque pas l'utilisateur ou le mot de passe, Creux que t'es");
            } else if (err.response?.status === 401) {
                // invalid credentials
                setErrMsg('Utilisateur ou Mot de Passe érroné, Creux!');
            } else {
                setErrMsg(err.response)
            }
            // on focus sur l'erreur
            errRef.current.focus();
        }
        setAuthLoading(false);
    }

    // pour éviter des clignotements dus au délai entre la fin de la requête de connexion,
    // et la requête pour les données utilisateur (dont isActivated)
    const [isLoading, ] = useDebouncedValue(authLoading || isUserLoading, 50);
    const showFrom = !isLogged || isLoading;

    return (
        <div style={{backgroundImage: `url(${bkgImg})`, backgroundSize: "cover", height:"100vh", width:"100%"}}>
            <Container size={420} pt={35}>
                <Title
                    align="center"
                    sx={(theme) => ({fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900})}
                >
                    Welcome back!
                </Title>
                <Text color="black" size="sm" align="center" mt={5}>
                    Tu n'as pas de Compte? Utilise ton compte Niki!
                </Text>
                <Alert ref={errRef} style={{display:errMsg?"block":"none"}} icon={<IconAlertCircle size={16} />} color={"red"} radius="lg">{errMsg}</Alert>

                <Paper
                    component={showFrom ? "form" : "div"}
                    withBorder
                    shadow="md"
                    p={30}
                    mt={30}
                    radius="md"
                >
                    {showFrom ? (
                        <>
                            <TextInput value={user} onChange={(e) => setUser(e.target.value)} label="Username" ref={userRef}
                                       placeholder="Username" disabled={isLoading} required/>
                            <PasswordInput value={pwd} onChange={(e) => setPwd(e.target.value)} label="Password"
                                           placeholder="*******" disabled={isLoading} required mt="md"/>
                            <Group position="apart" mt="md">
                                <Anchor onClick={(event) => event.preventDefault()} href="#" size="sm">
                                    Forgot password?
                                </Anchor>
                            </Group>
                            <Button type="submit" fullWidth mt="xl" onClick={handleSubmit} loading={isLoading}>
                                Sign in
                            </Button>
                        </>
                    ) : (
                        <>
                            <Text size="sm" mb="sm">
                                Tu es bien connecté, mais ton compte n'est pas/plus activé!<br/>
                                Si tu penses que c'est une erreur, contacte le Rezal.
                            </Text>
                            <Button fullWidth mt="xl" onClick={handleLogout}>
                                Déconnexion
                            </Button>
                        </>
                    )}
                </Paper>
            </Container>
        </div>
    );
}

export default Login;

/*
 */
