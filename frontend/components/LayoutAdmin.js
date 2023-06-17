"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import {
	AreaChartOutlined,
	DashboardOutlined,
	FileProtectOutlined,
	IdcardOutlined,
	LogoutOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	SettingOutlined,
	UploadOutlined,
	UserOutlined,
	UsergroupAddOutlined,
	VideoCameraOutlined,
} from "@ant-design/icons";
import {
	Avatar,
	Button,
	Col,
	Dropdown,
	Layout,
	Menu,
	Row,
	theme,
} from "antd";
import { useState } from "react";
const { Header, Sider, Content } = Layout;
const inter = Inter({ subsets: ["latin"] });

export default function LayoutAdmin({
	children,
	user_name,
}) {
	const [collapsed, setCollapsed] = useState(false);
	const {
		token: { colorBgContainer },
	} = theme.useToken();
	const [widthMenu, setWidthMenu] = useState(250);
	const handleClickCollapse = () => {
		setCollapsed(!collapsed);
		if (collapsed) {
			setWidthMenu(250);
			// setTimeout(() => {
			//   setOpenMenuKeys(openMenuKey ? [openMenuKey] : ["home"])
			// }, 10)
		} else {
			setWidthMenu(80);
		}
	};

	const itemStudent = [
		{
			label: "Học sinh",
			key: "studentManagement",
			icon: <UsergroupAddOutlined />,
			children: [
				{
					label: (
						<Link href="/admin">Thông tin cá nhân</Link>
					),
					key: "infoStudent",
				},
				{
					label: <Link href="/admin">Thời khóa biểu</Link>,
					key: "tkbStudent",
				},
				{
					label: <Link href="/admin">Đăng ký lớp</Link>,
					key: "regisClass",
				},
			],
		},
	]

	const itemsTeacher = [
		{
			label: "Giáo viên",
			key: "teacherManagement",
			icon: <IdcardOutlined />,
			children: [
				{
					label: (
						<Link href="/admin">Thông tin cá nhân</Link>
					),
					key: "infoTeacher",
				},
				{
					label: <Link href="/admin">Thời khóa biểu</Link>,
					key: "tkbTeacher",
				},
				{
					label: <Link href="/admin">Đăng ký dạy</Link>,
					key: "regisTeach",
				},
				{
					label: <Link href="/admin">Danh sách lớp</Link>,
					key: "listClass",
				},
			],
		},
	]

	const itemsSlider = [
		{
			label: <Link href="/admin">Dashboard</Link>,
			key: "dashboard",
			icon: <DashboardOutlined />,
		},
		// {
		// 	type: "divider",
		// },
		{
			label: "Trung tâm",
			key: "centerManagement",
			icon: <FileProtectOutlined />,
			children: [
				{
					label: <Link href="/admin">Thời khóa biểu</Link>,
					key: "tkbCenter",
				},
				{
					label: (
						<Link href="/admin/classroom">Quản lý phòng học</Link>
					),
					key: "classroomManagement",
				},
				{
					label: "Thi đầu vào",
					key: "extranceExam",
					children: [
						{
							label: (
								<Link href="/admin/regisEntranceExam">Đăng ký thi thử</Link>
							),
							key: "regisExam",
						},
						{
							label: (
								<Link href="/admin">Danh sách thi thử</Link>
							),
							key: "listRegisExam",
						},
						{
							label: (
								<Link href="/admin">Kết quả thi thử</Link>
							),
							key: "resultExam",
						},
					],
				},
				{
					label: "Học thử",
					key: "entrialLearning",
					children: [
						{
							label: (
								<Link href="/admin">Đăng ký học thử</Link>
							),
							key: "regisLearning",
						},
						{
							label: (
								<Link href="/admin">Danh sách học thử</Link>
							),
							key: "listLearning",
						},
					],
				},
				{
					label: "Lớp học",
					key: "class",
					children: [
						{
							label: (
								<Link href="/admin">Tạo lớp học mới</Link>
							),
							key: "createClass",
						},
						{
							label: (
								<Link href="/admin">Danh sách lớp</Link>
							),
							key: "listClass",
						},
					],
				},
			],
		},
		{
			label: "Báo cáo - thống kê",
			key: "report",
			icon: <AreaChartOutlined />,
			children: [
				{
					label: (
						<Link href="/admin">Báo cáo tổng quát</Link>
					),
					key: "generalReport",
				},
				{
					label: (
						<Link href="/admin">Báo cáo theo lớp</Link>
					),
					key: "classReport",
				},
				{
					label: <Link href="/admin">Đăng ký lớp</Link>,
					key: "regisClassReport",
				},
			],
		},
	];

	const items = [
		{
			key: "account",
			icon: (
				<SettingOutlined
					style={{
						fontSize: 14,
						marginRight: "4px",
						verticalAlign: "middle",
					}}
				/>
			),
			label: <Link href="/">Tài khoản</Link>,
		},
		{
			key: "logout",
			icon: (
				<LogoutOutlined
					style={{
						fontSize: 14,
						marginRight: "4px",
						verticalAlign: "middle",
					}}
				/>
			),
			label: <Link href="/">Đăng xuất</Link>,
		},
	];

	const logout = () => {
		message.success("Đăng xuất!!!!");
		localStorage.clear();
	};
	return (
		<div className={`${inter.className}`}>
			<Layout className="!min-h-screen">
				<Sider
					trigger={null}
					collapsible
					collapsed={collapsed}
					theme="light"
					collapsedWidth={widthMenu}
					width={widthMenu}
					style={{
						overflow: "auto",
						height: "100%",
						position: "fixed",
						left: 0,
						top: 0,
						paddingBottom: 0,
						minWidth: widthMenu,
						width: widthMenu,
					}}
				>
					<div className="h-16 flex justify-center items-center border-r border-b">
						<p className="uppercase p-4">
							{!collapsed ? "Trung tâm gia sư" : "GS"}
						</p>
					</div>
					<Menu
						theme="light"
						mode="inline"
						defaultSelectedKeys={["1"]}
						items={itemsSlider}
					/>
				</Sider>
				<Layout
					style={{
						marginLeft: widthMenu,
						transition: "all 0.2s",
					}}
				>
					<Header
						style={{
							padding: 0,
							background: colorBgContainer,
						}}
					>
						<Row>
							<Col xs={18}>
								<Button
									type="text"
									icon={
										collapsed ? (
											<MenuUnfoldOutlined />
										) : (
											<MenuFoldOutlined />
										)
									}
									onClick={handleClickCollapse}
									style={{
										fontSize: "16px",
										height: 64,
									}}
								/>
							</Col>
							<Col
								xs={6}
								className="flex justify-end text-end px-4"
							>
								<Dropdown
									menu={{ items }}
									trigger={["click"]}
									placement="bottomLeft"
									arrow
								>
									<a onClick={(e) => e.preventDefault()}>
										<Avatar icon={<UserOutlined />} />{" "}
										&nbsp; Username
									</a>
								</Dropdown>
							</Col>
						</Row>
					</Header>
					<Content
						style={{
							margin: "16px",
							padding: 16,
							minHeight: 280,
							background: colorBgContainer,
						}}
					>
						<div>{children}</div>
					</Content>
				</Layout>
			</Layout>
		</div>
	);
}
