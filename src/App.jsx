import {Outlet, Route, Routes} from 'react-router-dom';

import {AppShell, Container, MantineProvider, useMantineTheme} from "@mantine/core";
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

// contexts
import { UserProvider } from "./context/User";
import { EntiteProvider } from './context/Entite';

// theme
import { kfetTheme } from './theme';


function App() {
    const theme = useMantineTheme()

    const isSmallDevice = useMediaQuery('(max-width: ' + theme.breakpoints.sm + ')')

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
                            // marginLeft: isSmallDevice ? 0 : navBarWidth,
                            // paddingLeft: "0"
                        }}>

                     <AppShell
                         navbarOffsetBreakpoint="sm"
                         navbar={ <NavigationBar width={navBarWidth}/> }
                     >
                         <Outlet />
                     </AppShell>

                    {/*<NavigationBar width={navBarWidth}/>*/}
                    {/*<Outlet />*/}
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
