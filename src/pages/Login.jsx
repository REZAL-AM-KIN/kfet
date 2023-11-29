import {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "../auth/axios";

// style
import {Alert, Anchor, Button, Container, Group, Paper, PasswordInput, Text, TextInput, Title,} from '@mantine/core';
import {IconAlertCircle} from '@tabler/icons';

// images
import bkgImg from '../assets/101516.jpg';
import { useIsLogged, useUser } from "../hooks/useUser";


const LOGIN_URL = 'token/';

const Login = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [,setIsLogged] = useIsLogged();

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    // focus on the use input refferenced by userRef when the component mounts
    // and checks if the user isn't already connected
    useEffect(() => {
        if (sessionStorage.getItem("refresh") && sessionStorage.getItem("access")) {
            navigate("/");
        }
        userRef.current.focus();
        // eslint-disable-next-line
    }, [])

    // empty the error msg if the user changes user or pwd
    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    // function called when the login form is submited
    const handleSubmit = async (e) => {
        //don't forget to disable the default form submit (get method)
        e.preventDefault();
        try {
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
            setUser('');
            setPwd('');
            // on renvoie a l'endroit ou il était si il s'est fait dégager
            setIsLogged(true);
            navigate(from);
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
    }

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

                <Paper component="form" withBorder shadow="md" p={30} mt={30} radius="md">
                    <TextInput value={user} onChange={(e) => setUser(e.target.value)} label="Username" ref={userRef}
                               placeholder="Username" required/>
                    <PasswordInput value={pwd} onChange={(e) => setPwd(e.target.value)} label="Password"
                                   placeholder="*******" required mt="md"/>
                    <Group position="apart" mt="md">
                        <Anchor onClick={(event) => event.preventDefault()} href="#" size="sm">
                            Forgot password?
                        </Anchor>
                    </Group>
                    <Button type="submit" fullWidth mt="xl" onClick={handleSubmit}>
                        Sign in
                    </Button>
                </Paper>
            </Container>
        </div>
    );
}

export default Login;

/*
 */
