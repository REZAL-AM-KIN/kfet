import { Routes, Route, } from 'react-router-dom';

import RequireAuth from './components/RequireAuth';

import TopMenu from './components/navbar';
import Login from './components/Login';
import Home from './pages/home'

function App() {
  return(
    <Routes>
      <Route path="/">
        {/*public routes*/}
        <Route path="login" element={<Login />} />

        {/*privates routes*/}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<TopMenu />}>
            {/*<Route path="/" element={<Home />} /> needed?*/}
            <Route path="pg" element={<div>PAGE PG</div>}>
              <Route path=":pgId" element={<Home />} />
            </Route>
          </Route>
        </Route>

        {/* 404*/}
        {/* TODO:*/}
      </Route>
    </Routes>
  );
}

export default App;
