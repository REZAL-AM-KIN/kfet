import {Route, Routes,} from 'react-router-dom';

import RequireAuth from './components/RequireAuth';

import Login from './pages/Login';
import PG from './pages/PG';
import Test from './Test';
import Home from "./pages/Home";
import NavigationBar from "./components/NavigationBar";

function App() {
    return (
        <Routes>
            <Route path="/">
                {/*public routes*/}
                <Route path="login" element={<Login/>}/>

                {/*privates routes*/}
                <Route element={<RequireAuth/>}>
                    <Route path="/" element={<NavigationBar/>}>
                        <Route path="/" element={<Home/>}/>
                        <Route path="pg/:pgId" element={<PG/>}/>
                        <Route path="test" element={<Test/>}/>
                    </Route>
                </Route>

                {/* 404*/}
                {/* TODO:*/}
            </Route>
        </Routes>
    );
}

export default App;
