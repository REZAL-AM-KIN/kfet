import {Route, Routes,} from 'react-router-dom';

import RequireAuth from './old/components/RequireAuth';

import TopMenu from './old/components/TopMenu';
import Login from './pages/Login';
import Home from './old/pages/home';
import PG from './old/pages/PG';
import Test from './Test';

function App() {
    return (
        <Routes>
            <Route path="/">
                {/*public routes*/}
                <Route path="login" element={<Login/>}/>

                {/*privates routes*/}
                <Route element={<RequireAuth/>}>
                    <Route path="/" element={<TopMenu/>}>
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
