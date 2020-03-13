import React from 'react';
import {Avatar, Card, Col, Layout, Row, Typography} from 'antd';
import {EllipsisOutlined, SettingOutlined} from '@ant-design/icons';

const {Title} = Typography;
const {Meta} = Card;
const {Content} = Layout;

const Overview = () => (
	<Content style={{'background': 'white', 'padding': '2em'}}>
		<Title>Recomended</Title>
		<div>
			<Row gutter={16}>
				<Col span={8}>
					<Card
						cover={
							<img
								alt="example"
								src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
							/>
						}
						actions={[
							<SettingOutlined key="setting"/>,
							<EllipsisOutlined key="ellipsis"/>,
						]}
					>
						<Meta
							avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
							title="Card title"
							description="This is the description"
						/>
					</Card>
				</Col>
				<Col span={8}>
					<Card
						cover={
							<img
								alt="example"
								src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
							/>
						}
						actions={[
							<SettingOutlined key="setting"/>,
							<EllipsisOutlined key="ellipsis"/>,
						]}
					>
						<Meta
							avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
							title="Card title"
							description="This is the description"
						/>
					</Card>
				</Col>
				<Col span={8}>
					<Card
						cover={
							<img
								alt="example"
								src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
							/>
						}
						actions={[
							<SettingOutlined key="setting"/>,
							<EllipsisOutlined key="ellipsis"/>,
						]}
					>
						<Meta
							avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
							title="Card title"
							description="This is the description"
						/>
					</Card>
				</Col>
			</Row>
		</div>
	</Content>

);

export default Overview;
