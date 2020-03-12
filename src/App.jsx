import React from 'react';
import './App.css';
import Overview from './Overview';
import Console from './Console';
import Login from './Login';
import { Layout, Menu } from 'antd';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";

const { Header } = Layout;

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        fakeAuth.isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

const App = () => (
    <Router>
	<Layout>
	    <Header >
		<Menu
		    mode="horizontal"
		    theme="dark"
		    defaultSelectedKeys={['1']}
		    style={{ lineHeight: '64px' }}
		>
		    <Menu.Item key="1"><Link to="/">Overview</Link></Menu.Item>
		    <Menu.Item key="2"><Link to="/console">Console</Link></Menu.Item>
		</Menu>
	    </Header>
	    <Switch>
		<Route exact path="/login">
		    <Login />
                </Route>
                <Route exact path="/overview">
		    <Overview />
                </Route>
		<Route exact path="/console">
		    <Console />
                </Route>
            </Switch>
	</Layout>
    </Router>
);

export default App;
