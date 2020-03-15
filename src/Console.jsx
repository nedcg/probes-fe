import React, {useEffect, useState} from 'react';
import {Avatar, Button, Comment, Empty, Form, Input, Layout, List, Menu, message, Modal, Row, Spin} from 'antd';
import {HomeOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar'

const {Content, Sider} = Layout;

dayjs.extend(calendar);

function getCoords() {
	return new Promise(((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject, {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0,
		});
	})).then(position => ({lat: position.coords.latitude, lng: position.coords.longitude}));
}

async function fetchSignals(lat, lng) {
	let res = await fetch(`http://localhost:1337/api/v1/signal?lat=${lat}&lng=${lng}`, {
		headers: {'Content-Type': 'application/json; charset=utf-8'},
		credentials: 'include',
		method: 'GET',
	});
	return res.json();
}

async function fetchMessagesBySignalId(signalId, skip, limit) {
	let res = await fetch(`http://localhost:1337/api/v1/signal/${signalId}/messages?skip=${skip}&limit=${limit}`, {
		headers: {'Content-Type': 'application/json; charset=utf-8'},
		credentials: 'include',
		method: 'GET',
	});
	return res.json();
}

async function postMessage(signalId, message) {
	let res = await fetch(`http://localhost:1337/api/v1/signal/${signalId}/messages`, {
		headers: {'Content-Type': 'application/json; charset=utf-8'},
		credentials: 'include',
		method: 'POST',
		body: JSON.stringify({signal: signalId, payload: message}),
	});
	return res.json();
}

const Console = () => {

	const [selectedSignal, setSelectedSignal] = useState(null);
	const [signals, setSignals] = useState([]);
	const [messagePayload, setMessagePayload] = useState('');
	const [loadingSignals, setLoadingSignals] = useState(false);
	const [postMessageModalVisible, setPostMessageModalVisible] = useState(false);
	const [loadingSelectedSignalMessages, setLoadingSelectedSignalMessages] = useState(false);

	useEffect(() => {
		setLoadingSignals(true);

		async function findSignals() {
			const {lat, lng} = await getCoords();

			let signals = await fetchSignals(lat, lng);
			setSignals(signals);
			setLoadingSignals(false);
		}

		findSignals();
	}, []);

	function signalSelected({key}) {
		console.log('selected');
		let selectedSignal = signals[key];
		setSelectedSignal({...selectedSignal, messages: selectedSignal.messages || []});

		setLoadingSelectedSignalMessages(true);
		fetchMessagesBySignalId(selectedSignal.id, 0, 20)
			.then(messages => {
				setSelectedSignal(prev => ({...prev, messages: messages}));
				setLoadingSelectedSignalMessages(false);
			});
	}

	function handlePostMessage() {
		postMessage(selectedSignal.id, messagePayload)
			.then(res => {
				message.success('Message posted on signal ' + selectedSignal.title);
				setMessagePayload('');
				setPostMessageModalVisible(false);
			})
			.catch(reason => {
				console.error(reason);
				message.error('An error has ocurred trying to post a message to signal ' + selectedSignal.title);
			});
	}

	return (
		<Spin spinning={loadingSignals} size="large">
			<Layout hasSider={true} style={{height: 'calc(100vh - 64px)'}}>
				<Sider width={200}>
					<Menu theme="dark"
						  mode="vertical"
						  defaultSelectedKeys={['-1']}
						  onSelect={signalSelected}>
						{signals?.map((signal, idx) => (
							<Menu.Item key={idx} style={{margin: 0}} title={signal.description}>
							<span>
								<HomeOutlined/>
								{signal.title}
							</span>
							</Menu.Item>
						))}
					</Menu>
				</Sider>
				<Content>
					{!selectedSignal ? (
							<Row justify="space-around" align="middle" style={{height: '80vh'}}>
								<Empty description={false}/>
							</Row>
						) :
						(
							<Spin spinning={loadingSelectedSignalMessages} size="large">
								{selectedSignal.messages.length > 0 ? (
										<List
											dataSource={selectedSignal.messages}
											renderItem={item => (
												<li>
													<Comment
														actions={[<span key="comment-nested-reply-to">Reply</span>]}
														author={<a>{item.author.fullName}</a>}
														avatar={
															<Avatar
																src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
																alt="Han Solo"
															/>
														}
														datetime={dayjs(item.createdAt).calendar()}
														content={
															<p>
																{item.payload}
															</p>
														}
													/>
												</li>
											)}
										/>
									) :
									(
										<Row justify="space-around" align="middle" style={{height: '80vh'}}>
											<Empty description={false}>
												<Button type="primary" onClick={() => setPostMessageModalVisible(true)}>
													Post Message
												</Button>
											</Empty>
										</Row>
									)}
							</Spin>
						)
					}
					<Modal
						centered
						visible={postMessageModalVisible}
						onOk={handlePostMessage}
						onCancel={() => {
							setMessagePayload('');
							setPostMessageModalVisible(false);
						}}
					>
						<Form {...{
							labelCol: {span: 6},
							wrapperCol: {span: 16},
						}}>
							<Form.Item
								label="payload"
								name="payload"
								rules={[{required: true, message: 'Please input your username!'}]}
							>
								<Input.TextArea onChange={(e) => setMessagePayload(e.target.value)}/>
							</Form.Item>
						</Form>
					</Modal>
				</Content>
			</Layout>
		</Spin>
	);
};

export default Console;
