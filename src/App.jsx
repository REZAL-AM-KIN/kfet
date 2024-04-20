import {Outlet, Route, Routes} from 'react-router-dom';

import {Container, MantineProvider, useMantineTheme} from "@mantine/core";
import {useMediaQuery, useViewportSize} from "@mantine/hooks";

// authentification
import RequireAuth from './components/RequireAuth';
import NavigationBar from "./components/NavigationBar";

// pages
import Login from './pages/Login';
import PG from './pages/PG';
import Home from "./pages/Home";
import Edit from "./pages/Edit";
import Finss from "./pages/Finss";
import FinssEdit from "./pages/FinssEdit";

// contexts
import {ModalsProvider} from '@mantine/modals';
import { UserProvider } from "./context/User";
import { EntiteProvider } from './context/Entite';

// theme
import { kfetTheme } from './theme';


function App() {
    const theme = useMantineTheme()

    const isSmallDevice = useMediaQuery('(max-width: ' + theme.breakpoints.sm + 'px)')
    const viewportSize = useViewportSize();

    const navBarWidth = 80


    function LayoutRoute() {
        return (
            <EntiteProvider>
                 <Container
                        fluid // Permet de s'assurer que le container prend la largeur maximale (largeur totale de la page)
                        style={{
                            margin: "0", //On s'assure qu'il n'y a aucune bordure de type margin ou padding
                            padding: "0",
                            // Si la navbar est affiché, on met du padding sur le Container pour éviter la superposition
                            // de la nav bar sur le container
                            marginLeft: isSmallDevice ? 0 : navBarWidth,
                            paddingLeft: "0"
                        }}>
                    <NavigationBar width={navBarWidth}/>
                    <Outlet />
                </Container>
            </EntiteProvider>
        )
    };

    return (
        <MantineProvider theme={kfetTheme} withGlobalStyles withNormalizeCSS>
            <UserProvider>
                <Routes>
                    <Route path="/">
                        {/*public routes*/}
                        <Route path="login" element={<Login/>}/>

                        {/*privates routes*/}
                        <Route element={<RequireAuth/>}>
                            <Route element={<LayoutRoute/>}>
                                <Route path="/" element={<Home/>}/>
                                <Route path="pg/:pgId" element={<PG/>}/>
                                <Route path="edit" element={<Edit/>}/>
                                <Route path="finss" element={<Finss/>}/>
                                <Route path="finss/:applyto" element={<Finss setPage={setPage}/>}/>
                                <Route path="finssedit/:finssid" element={<FinssEdit setPage={setPage}/>}/>

                            </Route>
                        </Route>

                    {/* TODO: 404*/}
                    
                    </Route>
                </Routes>
            </UserProvider>
        </MantineProvider>
    );

}

export default App;
