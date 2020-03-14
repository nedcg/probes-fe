import React, {useState} from 'react';
import './App.css';
import Overview from './Overview';
import Console from './Console';
import {Button, Col, Form, Input, Layout, Menu, Row} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {BrowserRouter as Router, Link, Redirect, Route, Switch, useHistory, useLocation} from 'react-router-dom';

const {Header} = Layout;

function PrivateRoute({children, ...rest}) {
  return (
    <Route
      {...rest}
      render={({location}) =>
        fakeAuth.isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: {from: location}
            }}
          />
        )
      }
    />
  );
}

const fakeAuth = {
  isAuthenticated: false,
  authenticate(email, password, cb) {
    fetch(`http://localhost:1337/api/v1/entrance/login`, {
      method: 'PUT',
      credentials: 'include',
      headers: {'Content-Type': 'application/json; charset=utf-8'},
      body: JSON.stringify({emailAddress: email, password: password, rememberMe: true})
    }).then(res => {
      if (res.ok) {
        fakeAuth.isAuthenticated = true;
      }
      cb();
    });
  },
  signout(cb) {
    fetch(`http://localhost:1337/api/v1/account/logout`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json; charset=utf-8'},
    }).then(res => {
      if (res.ok) {
        fakeAuth.isAuthenticated = false;
        cb();
      }
    });
  }
};

function AuthButton() {
  let history = useHistory();

  return fakeAuth.isAuthenticated ? (
    <p>
      Welcome!{' '}
      <button
        onClick={() => {
          fakeAuth.signout(() => history.push('/'));
        }}
      >
        Sign out
      </button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  );
}

const App = () => (
  <Router>
    <Layout>
      <Header>
        <Menu
          mode="horizontal"
          theme="dark"
          defaultSelectedKeys={['1']}
          style={{lineHeight: '64px'}}
        >
          <Menu.Item key="1"><Link to="/login">Login</Link></Menu.Item>
          <Menu.Item key="2"><Link to="/">Overview</Link></Menu.Item>
          <Menu.Item key="3"><Link to="/console">Console</Link></Menu.Item>
        </Menu>
      </Header>
      <Switch>
        <Route exact path="/login">
          <Login/>
        </Route>
        <PrivateRoute exact path="/">
          <Overview/>
        </PrivateRoute>
        <PrivateRoute exact path="/console">
          <Console/>
        </PrivateRoute>
      </Switch>
    </Layout>
  </Router>
);

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  let history = useHistory();
  let location = useLocation();

  let {from} = location.state || {from: {pathname: '/'}};

  function handleSubmit(event) {
    fakeAuth.authenticate(email, password, () => {
      history.replace(from);
    });
  }

  return (
    <Row>
      <Col span={8}/>
      <Col span={8}>
        <Form style={{margin: '2em'}}>
          <Form.Item>
            <Input placeholder="Email" value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   prefix={<UserOutlined/>}/>
          </Form.Item>
          <Form.Item>
            <Input.Password placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSubmit}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col span={8}/>
    </Row>
  );
};

export default App;
