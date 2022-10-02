import {Route, Routes, useLocation,} from 'react-router-dom';

import RequireAuth from './components/RequireAuth';

import Login from './pages/Login';
import PG from './pages/PG';
import Test from './Test';
import Home from "./pages/Home";
import NavigationBar from "./components/NavigationBar";
import {Container, MantineProvider, useMantineTheme} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";

function App() {
    const { pathname } = useLocation();
    const navBarWidth= 80
    const theme = useMantineTheme()
    const isSmallDevice = useMediaQuery('(max-width: '+theme.breakpoints.sm+'px)')
    const pathWithoutNav = ["/login"]

    const withNavBar = (path) => {
        return !pathWithoutNav.includes(path)
    }


    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>

            {withNavBar(pathname) ? <NavigationBar width={navBarWidth}/> : ""}
            <Container fluid={true} // Permet de s'assurer que le container prend la largeur maximale (largeur totale de la page)
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

                        <Route path="/" element={<Home/>}/>
                        <Route path="pg/:pgId" element={<PG/>}/>
                        <Route path="test" element={<Test/>}/>

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
