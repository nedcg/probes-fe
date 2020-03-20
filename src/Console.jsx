import React, {useEffect, useState} from 'react';
import {Avatar, Button, Comment, Empty, Form, Input, Layout, List, Menu, message, Modal, Row, Spin} from 'antd';
import {HomeOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';

const {Content, Sider} = Layout;
const io = require('sails.io.js')(require('socket.io-client'));
io.sails.url = 'http://localhost:1337';

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

			io.socket.get(`/api/v1/signal?lat=${lat}&lng=${lng}`,
				(signals, resp) => {
					setSignals(signals);
					setLoadingSignals(false);
				});
		}

		findSignals();
	}, []);

	function signalSelected({key}) {
		let selectedSignal = signals[key];

		setSelectedSignal({...selectedSignal, messages: selectedSignal.messages || []});

		io.socket.on('signal', function (message) {
			setSelectedSignal(prev => ({...prev, messages: [...prev.messages, message]}));
		});

		setLoadingSelectedSignalMessages(true);
		io.socket.get(`/api/v1/signal/${selectedSignal.id}/messages?skip=0&limit=20`,
			(messages, resp) => {
				setSelectedSignal(prev => ({...prev, messages: messages}));
				setLoadingSelectedSignalMessages(false);
			});
	}

	function handlePostMessage() {
		io.socket.post(`/api/v1/signal/${selectedSignal.id}/messages`,
			{signal: selectedSignal.id, payload: messagePayload}, (respData, resp) => {
				if (resp.statusCode === 200) {
					message.success('Message posted on signal ' + selectedSignal.title);
					setMessagePayload('');
					setPostMessageModalVisible(false);
				} else {
					message.error('An error has ocurred trying to post a message to signal ' + selectedSignal.title);
				}
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
										<div>
											<div style={{padding: '2em'}}>
												<Button type="primary" onClick={() => setPostMessageModalVisible(true)}>
													Post Message
												</Button>
											</div>
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
										</div>
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
