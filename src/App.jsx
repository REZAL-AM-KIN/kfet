import {Route, Routes,} from 'react-router-dom';

import RequireAuth from './components/RequireAuth';

import Login from './pages/Login';
import PG from './pages/PG';
import Test from './Test';

function App() {
    return (
        <Routes>
            <Route path="/">
                {/*public routes*/}
                <Route path="login" element={<Login/>}/>

                {/*privates routes*/}
                <Route element={<RequireAuth/>}>
                    <Route path="/" > {/* element={<TopMenu/>}>*/}
                        <Route path="/" element={<PG/>}/>
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
