import {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "../auth/axios";

// style
import {
    TextInput,
    PasswordInput,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
} from '@mantine/core';

// images
import bkgImg from '../assets/101516.jpg';


const LOGIN_URL = 'token/';

const Login = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";


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
        <section style={{backgroundImage: `url(${bkgImg})`, backgroundSize: "cover"}}>
            <Container size={420} my={40}>
                <Title
                    align="center"
                    sx={(theme) => ({fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900})}
                >
                    Welcome back!
                </Title>
                <Text color="dimmed" size="sm" align="center" mt={5}>
                    Tu n'as pas de Compte? Utilise ton compte Niki!
                </Text>

                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <TextInput value={user} onChange={(e) => setUser(e.target.value)} label="Username" ref={userRef}
                               placeholder="Username" required/>
                    <PasswordInput value={pwd} onChange={(e) => setPwd(e.target.value)} label="Password"
                                   placeholder="*******" required mt="md"/>
                    <Group position="apart" mt="md">
                        <Anchor onClick={(event) => event.preventDefault()} href="#" size="sm">
                            Forgot password?
                        </Anchor>
                    </Group>
                    <Button fullWidth mt="xl" onClick={handleSubmit}>
                        Sign in
                    </Button>
                </Paper>
                <div ref={errRef}>{errMsg}</div>
            </Container>
        </section>
    );
}

export default Login;
