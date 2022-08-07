import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

import axios from '../auth/axios';

// react-bootstrap css
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

// images
import left_image from '../assets/Profile.jpg'; // TODO: randomize with funny ones
import am_kfet from '../assets/am_kfet.jpg';
import bkgImg from '../assets/101516.jpg'; // TODO: image du pian'sss

const LOGIN_URL = 'token/';

const Login = () => {
  // set the context cookie? non utilisé actuellement
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";


  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');

  // focus on the use input refferenced by userRef when the component mounts
  // and checks if the user isn't already connected
  useEffect(() => {
    if (sessionStorage.getItem("refresh") && sessionStorage.getItem("access")) {
      navigate("/");
    }
    userRef.current.focus();
    // eslint-disable-next-line
  }, [])

  // empty the error msg if the user changes user or pwd
  useEffect(() => {
    setErrMsg('');
  }, [user, pwd])

  // function called when the login form is submited
  const handleSubmit = async (e) => {
    //don't forget to disable the default form submit (get method)
    e.preventDefault();
    try {
      const response = await axios.post(LOGIN_URL,
        JSON.stringify({ username: user, password: pwd }),
        {
          headers: { 'Content-type': 'application/json' },
          // withCredentials = envoie le cookie, je crois que ça fonctionne pas
          withCredentials: true
        }
      );
      // on enregistre les tokens dans les cookies et dans le sessionStorage
      const access = response?.data?.access;
      const refresh = response?.data?.refresh;
      sessionStorage.setItem("access", access);
      sessionStorage.setItem("refresh", refresh);
      setAuth({ user, access, refresh });
      setUser('');
      setPwd('');
      // on renvoie a l'endroit ou il était si il s'est fait dégager
      navigate(from);
    } catch (err) {
      if (!err?.response) {
        // pas de réponse
        setErrMsg('Pas de réponse serveur, va brasser au Rezal');
      } else if (err.response?.status === 400) {
        setErrMsg("Zocque pas l'utilisateur ou le mot de passe, Creux que t'es");
      } else if (err.response?.status === 401) {
        // invalid credentials
        setErrMsg('Utilisateur ou Mot de Passe érroné, Creux!');
      } else {
        setErrMsg(err.response)
      }
      // on focus sur l'erreur
      errRef.current.focus();
    }
  }

  return (
    <section className="vh-100" style={{ backgroundImage: `url(${bkgImg})`, backgroundSize: "cover" }}>
      <Container className="py-5 h-100">
        <Row className="d-flex justify-content-center align-items-center h-100">
          <Col xl={10}>
            <Card style={{ borderRadius: '1rem' }}>
              <Row className="g-0">

                <Col md={6} lg={5} className="d-none d-md-block">
                  {/*image*/}
                  <Image src={left_image} fluid alt="login form" style={{ borderRadius: "1rem 0 0 1rem", Width: "100%", height: "100%" }} />
                </Col>

                <Col md={6} lg={7} className="d-flex align-item-center">
                  <Card.Body className="p-lg-5 p-4 text-black">
                    <form onSubmit={handleSubmit}>
                      <div className="d-flex align-item-center mb-3 pb-1">
                        <Image src={am_kfet} height="50px" width="50px" />
                        <span className="h1 fw-bold mb-0">K'fet</span>
                      </div>

                      <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: "1px" }}>Se Connecter</h5>

                      <div className="form-outline mb-4" >
                        <input
                          type="text"
                          id="username"
                          ref={userRef}
                          autoComplete="off"
                          onChange={(e) => setUser(e.target.value)}
                          value={user}
                          required
                          placeholder="Nom d'utilisateur"
                          className="form-control form-control-lg"
                        />
                        <label htmlFor='username' className="form-label">Nom d'Utilisateur</label>
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          id="password"
                          onChange={(e) => setPwd(e.target.value)}
                          value={pwd}
                          required
                          placeholder="Mot de Passe"
                          className="form-control form-control-lg"
                        />
                        <label htmlFor="password" className="form-label">Mot de Passe</label>
                      </div>

                      <div className="pt-1 mb-4 d-grid">
                        <Button variant="dark" size="lg" type="submit">Sign In</Button>
                      </div>

                      {/*TODO, redirect*/}
                      <a className="small text-muted" href="#!">a faire oubli</a>
                      <Alert variant="danger" ref={errRef} show={errMsg ? true : false}>{errMsg}</Alert>
                    </form>
                  </Card.Body>
                </Col>

              </Row>
            </Card>
          </Col>
        </Row>
      </Container>

    </section>


  )

}
export default Login;
