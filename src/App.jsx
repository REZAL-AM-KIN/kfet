import {Route, Routes, useLocation,} from 'react-router-dom';

import RequireAuth from './components/RequireAuth';

import Login from './pages/Login';
import PG from './pages/PG';
import Test from './Test';
import Home from "./pages/Home";
import NavigationBar from "./components/NavigationBar";
import {AppShell, Burger, MantineProvider} from "@mantine/core";
import {useState} from "react";

function App() {
    const { pathname } = useLocation();



    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <AppShell
                padding={0}
                navbar={pathname !== '/login' ? <NavigationBar  /> : null}
            >
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
            </AppShell>
        </MantineProvider>
    );
}

export default App;
