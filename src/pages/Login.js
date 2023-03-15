import {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useLocalPianss} from "../hooks/useLocalPianss";
import axios from "../auth/axios";

// style
import {
    Alert,
    Anchor,
    Button,
    Container,
    Group,
    LoadingOverlay,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,Box,
} from '@mantine/core';
import {IconAlertCircle} from '@tabler/icons';

// images
import bkgImg from '../assets/101516.jpg';


const LOGIN_URL = 'token/';
const PIANSS_LOGIN_URL = 'piansstoken/'

const Login = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const uselocalpianss = useLocalPianss();
    const from = location.state?.from?.pathname || "/";


    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
    const handleSubmit = async (e, forceClassicConnection) => {
        console.log(e)
        //don't forget to disable the default form submit (get method)
        e.preventDefault();

        // check if the user and pwd are not empty
        if(user === '' || pwd === '') {
            setErrMsg("L'utilisateur et le mot de passe ne sont pas zocquable !");
            errRef.current.focus();
            return;
        }


        // On sélectionne la bonne url: si on est sur un pian'ss et que on submit par le bouton on utilise l'url pianss
        // sinon on utilise l'url de login
        const url = uselocalpianss.isDeviceAPianss && !forceClassicConnection ? PIANSS_LOGIN_URL : LOGIN_URL;

        //On construit le contenu de la requête, si on est sur un pian'ss on rajoute le token
        const data = uselocalpianss.isDeviceAPianss && !forceClassicConnection ? {username: user, password: pwd, pianss_token: uselocalpianss.localPianss.token} : {username: user, password: pwd};

        try {
            setIsSubmitting(true);

            //On récupère les tokens
            const response = await axios.post(url,
                JSON.stringify(data),
                {
                    headers: {'Content-type': 'application/json'},
                }
            );

            setIsSubmitting(false);

            // on enregistre les tokens dans les cookies et dans le sessionStorage
            const access = response?.data?.access;
            const refresh = response?.data?.refresh;
            sessionStorage.setItem("access", access);
            sessionStorage.setItem("refresh", refresh);
            setUser('');
            setPwd('');


            // on renvoie a l'endroit ou il était si il s'est fait dégager
            navigate(from);

            //En cas d'erreur:
        } catch (err) {

            setIsSubmitting(false);


            if (!err?.response) {
                // pas de réponse
                setErrMsg('Pas de réponse serveur, va brasser au Rezal');

            } else if (err.response?.status === 400) {
                //WARNING : Si le message d'erreur est modifié côté serveur, il faut le modifier ici aussi
                if(err.response?.data?.non_field_errors?.includes("Invalid pian'ss token.")){
                    setErrMsg("Le token du pian'ss est invalide, contacte l'admin");
                }else{
                    //En cas d'erreur inconue, on affiche le message d'erreur du serveur: soit non_filed_errors, si pas définie, alors on affiche detail et sinon on affiche directement response
                    const errors = err.response?.data?.non_field_errors?.join("\n") || JSON.stringify(err.response?.data?.detail) || JSON.stringify(err.response.data, null, 2)
                    setErrMsg("Erreur inconnue, contacte l'admin:\n" +  errors)
                }

            } else if (err.response?.status === 401) {
                // invalid credentials
                setErrMsg('Utilisateur ou Mot de Passe erroné !');
            } else {
                console.log(err.response)
                setErrMsg(err.response)
            }
            // on focus sur l'erreur
            errRef.current.focus();
        }

    }

    return (
        <div style={{backgroundImage: `url(${bkgImg})`, backgroundSize: "cover", height:"100vh", width:"100%"}}>
            <Container size={420} pt={35} >
                <Box pos="relative">
                 <LoadingOverlay visible={isSubmitting} />


                    <Title
                        align="center"
                        sx={(theme) => ({fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900})}
                    >
                        Welcome back!
                    </Title>
                    <Text color="black" size="sm" align="center" mt={5}>
                        Utilise ton compte Niki!
                    </Text>
                    <Alert ref={errRef} style={{display:errMsg ? "block" : "none", whiteSpace: "pre-wrap"}} icon={<IconAlertCircle size={16} />} color={"red"} radius="lg">{errMsg}</Alert>

                    <Paper component="form" withBorder shadow="md" p={30} mt={30} radius="md">
                        <TextInput value={user} onChange={(e) => setUser(e.target.value)} label="Nom d'utilisateur" ref={userRef}
                                   placeholder="Username" required/>
                        <PasswordInput value={pwd} onChange={(e) => setPwd(e.target.value)} label="Mot de passe"
                                       placeholder="*******" required mt="md"/>

                        <Button name="connectButton" type="submit" fullWidth mt="xl" onClick={handleSubmit}>
                            Connexion {uselocalpianss.isDeviceAPianss ? "via pian'ss "+uselocalpianss.localPianss.nom : ""}
                        </Button>

                        <Group position="apart" mt="md">
                            <Anchor onClick={(event) => event.preventDefault()} href="#" size="sm">
                                Mot de passe oublié ?
                            </Anchor>

                            {uselocalpianss.isDeviceAPianss ?
                                <Anchor onClick={(e) => handleSubmit(e, true)} size="sm">
                                    Connexion sans pian'ss
                                </Anchor>
                                : ""}

                        </Group>
                    </Paper>
                </Box>
            </Container>
        </div>
    );
}

export default Login;

/*
 */