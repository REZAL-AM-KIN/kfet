import {Outlet, Route, Routes} from 'react-router-dom';

import {Container, MantineProvider, useMantineTheme} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";

// authentification
import RequireAuth from './components/RequireAuth';
import NavigationBar from "./components/NavigationBar";

// pages
import Login from './pages/Login';
import PG from './pages/PG';
import Home from "./pages/Home";
import Edit from "./pages/Edit";
import Finss from "./pages/Finss";

import {Notifications} from '@mantine/notifications';
import {ModalsProvider} from '@mantine/modals';

// contexts
import { UserProvider } from "./context/User";
import { EntiteProvider } from './context/Entite';

// theme
import { kfetTheme } from './theme';


function App() {
    const theme = useMantineTheme()

    const isSmallDevice = useMediaQuery('(max-width: ' + theme.breakpoints.sm + 'px)')

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
    }

    return (
        <MantineProvider theme={kfetTheme} withGlobalStyles withNormalizeCSS>
            <Notifications />
            <ModalsProvider>
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
                            </Route>
                        </Route>

                        {/* TODO: 404*/}

                        </Route>
                    </Routes>
                </UserProvider>
            </ModalsProvider>
        </MantineProvider>
    );

}

export default App;
