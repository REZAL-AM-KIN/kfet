import {Outlet, Route, Routes} from 'react-router-dom';

import {AppShell, MantineProvider, useMantineTheme, Box} from "@mantine/core";
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
import FinssEdit from "./pages/FinssEdit";

// Provides des bibliothèques
import 'dayjs/locale/fr';
import {DatesProvider} from '@mantine/dates';
import {Notifications} from '@mantine/notifications';
import {ModalsProvider} from '@mantine/modals';

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
                 <AppShell
                     padding="0rem"
                     navbarOffsetBreakpoint="sm"
                     navbar={ <NavigationBar width={navBarWidth}/> }
                 >
                     <Box sx={{
                         // on laisse AppShell mettre du padding seulement pour la taille de Header/Navbar/Footer (ici,
                         // on utilise que Navbar), et on met un padding pour le contenu en fonction de la taille de
                         // l'écran. paddingTop sert à avoir le burger menu qui ne se superpose pas sur le contenu.
                         padding: (isSmallDevice ? "0.5rem" : "1rem"),
                         paddingTop: (isSmallDevice ? "2rem" : undefined),
                         }}
                     >
                         <Outlet />
                     </Box>
                 </AppShell>
            </EntiteProvider>
        )
    }

    return (
        <MantineProvider theme={kfetTheme} withGlobalStyles withNormalizeCSS>
            <Notifications />
            <DatesProvider settings={{locale: 'fr'}}>
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
                                        <Route path="finss/:applyto" element={<Finss/>}/>
                                        <Route path="finssedit/:finssid" element={<FinssEdit/>}/>

                                    </Route>
                                </Route>

                            {/* TODO: 404*/}

                            </Route>
                        </Routes>
                    </UserProvider>
                </ModalsProvider>
            </DatesProvider>
        </MantineProvider>
    );

}

export default App;
