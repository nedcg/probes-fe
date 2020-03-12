import React from 'react';
import './App.css';
import { Layout, Menu } from 'antd';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function validateForm() {
	return email.length > 0 && password.length > 0;
    }

    function handleSubmit(event) {
	event.preventDefault();
	fetch(`http://localhost:1337/api/v1/entrance/login`,
	      {method:"POST", body:{emailAddress:email, password:password, rememberMe: true}});
    }

    return (
	<Form>
	    <Form.Item>
		<Input placeholder="Email" value={email} />
	    </Form.Item>
	    <Form.Item>
		<Input type="password" placeholder="Password" value={password} />
	    </Form.Item>
	    <Form.Item>
		<Button type="primary" htmlType="submit">
		    Login
		</Button>
	    </Form.Item>
	</Form>
    )
};

export default Login;
