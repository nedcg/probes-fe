import React, {useEffect, useState} from 'react';
import {Layout, Menu} from 'antd';
import {UserOutlined} from '@ant-design/icons';

const {Content, Sider} = Layout;

function getCoords() {
	return new Promise(((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject, {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0,
		});
	})).then(position => ({lat: position.coords.latitude, lng: position.coords.latitude}));
}

const Console = () => {

	const [signals, setSignals] = useState([]);

	useEffect(() => {
		async function findSignals() {
			const {lat, lng} = await getCoords();

			let res = await fetch(`http://localhost:1337/api/v1/signal?lat=${lat}&lng=${lng}`, {
				headers: {'Content-Type': 'application/json; charset=utf-8'},
				credentials: 'include',
				method: 'GET',
			});
			let json = await res.json();
			setSignals(json);
		}

		findSignals();
	}, []);

	return (<Layout hasSider={true} style={{height: 'calc(100vh - 64px)'}}>
		<Sider width={200}>
			<Menu
				theme="dark"
				mode="vertical"
				defaultSelectedKeys={['1']}
				style={{height: '100%', borderRight: 0}}
			>
				{signals?.map((value, i) => {
					return <Menu.Item key={i} style={{margin: 0}}>
		<span>
		    <UserOutlined/>
		    Place {i}
		</span>
					</Menu.Item>;
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
	</Layout>);
};

export default Console;
