import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Content, Sider } = Layout;

const Console = () => {

    const [signals, setSignals] = useState([]);

    fetch(`http://localhost:1337/api/v1/signal`)
	.then(res => res.json())
	.then((result)=> {
	    setSignals({
		result,
	    });
	});

    return (<Layout hasSider={true} style={{height:'calc(100vh - 64px)'}}>
	<Sider width={200}>
	<Menu
	theme="dark"
	mode="vertical"
	defaultSelectedKeys={['1']}
	style={{ height: '100%', borderRight: 0 }}
	>
	{signals.map((value, i)=> {
	    return <Menu.Item key={i} style={{margin: 0}}>
		<span>
		    <UserOutlined />
		    Place {i}
		</span>
	    </Menu.Item>
	})
	}
	</Menu>
	</Sider>
	<Content
	    style={{
		padding: 24,
		margin: 0,
	    }}
	>
	    Content
	</Content>
    </Layout>)
};

export default Console;
