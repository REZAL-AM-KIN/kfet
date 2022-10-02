import {Route, Routes, useLocation,} from 'react-router-dom';
import {useState} from "react";

import RequireAuth from './components/RequireAuth';
import {Container, MantineProvider, useMantineTheme} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";

import Login from './pages/Login';
import PG from './pages/PG';
import Home from "./pages/Home";
import NavigationBar from "./components/NavigationBar";
import Edit from "./pages/Edit";
import Finss from "./pages/Finss";

function App() {
    const theme = useMantineTheme()
    const { pathname } = useLocation();

    const [page, setPage] = useState("Finss")
    /*
    A chaque nouvelle page, il faut bien passer setPage à la page et penser à faire setPage(NomDeLaPage) avec
    NomDeLaPage identique à pageName spécifié dans la table des liens dans NavigationBar.js
     */

    const isSmallDevice = useMediaQuery('(max-width: '+theme.breakpoints.sm+'px)')

    const navBarWidth= 80
    const pathWithoutNav = ["/login"]

    const withNavBar = (path) => {
        return !pathWithoutNav.includes(path)
    }


    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>

            {withNavBar(pathname) ? <NavigationBar width={navBarWidth} page={page}/> : ""}
            <Container fluid // Permet de s'assurer que le container prend la largeur maximale (largeur totale de la page)
                       style={{
                margin: "0", //On s'assure qu'il n'y a aucune bordure de type margin ou padding
                padding: "0",
                           // Si la navbar est affiché, on met du padding sur le Container pour éviter la superposition
                           // de la nav bar sur le container
                marginLeft: (isSmallDevice || !withNavBar(pathname))? 0: navBarWidth,
                paddingLeft: "0"
            }}>

            <Routes>
                <Route path="/">
                    {/*public routes*/}
                    <Route path="login" element={<Login/>}/>

                    {/*privates routes*/}
                    <Route element={<RequireAuth/>}>

                        <Route path="/" element={<Home setPage={setPage}/>}/>
                        <Route path="pg/:pgId" element={<PG setPage={setPage}/>}/>
                        <Route path="edit" element={<Edit setPage={setPage}/>}/>
                        <Route path="finss" element={<Finss setPage={setPage}/>}/>

                    </Route>

                    {/* 404*/}
                    {/* TODO:*/}
                </Route>
            </Routes>
            </Container>

        </MantineProvider>
    );

}

export default App;
