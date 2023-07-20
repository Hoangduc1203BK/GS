"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import {
	ApartmentOutlined,
	AreaChartOutlined,
	AuditOutlined,
	BankOutlined,
	CalculatorOutlined,
	ContainerOutlined,
	DashboardOutlined,
	FileProtectOutlined,
	IdcardOutlined,
	InfoCircleOutlined,
	LogoutOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	OrderedListOutlined,
	PicCenterOutlined,
	ReadOutlined,
	RetweetOutlined,
	SettingOutlined,
	SnippetsOutlined,
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
	message,
	theme,
} from "antd";
import { useState } from "react";
import { deleteCookie } from "@/api/cookies";
import { goTo } from "@/common/util";
const { Header, Sider, Content } = Layout;
const inter = Inter({ subsets: ["latin"] });

export default function LayoutAdmin({
	children,
	user,
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
			label: (
				<Link href="/student">Thông tin cá nhân</Link>
			),
			key: "infoStudent",
			icon: <InfoCircleOutlined />
		},
		{
			label: <Link href="/student/class">Quản lý danh sách lớp</Link>,
			key: "classStudent",
			icon: <OrderedListOutlined />
		},
		{
			label: <Link href="/student/fee">Quản lý điểm danh</Link>,
			key: "classDeeStudent",
			icon: <AuditOutlined />
		},
		{
			label: <Link href="/student/suggest">Quản lý đề xuất</Link>,
			key: "studentSuggest",
			icon: <SnippetsOutlined />
		},
	]

	const itemsTeacher = [
		{
			label: (
				<Link href="/teacher">Thông tin cá nhân</Link>
			),
			key: "infoTeacher",
			icon: <InfoCircleOutlined />
		},
		{
			label: <Link href="/teacher/class">Danh sách lớp học</Link>,
			key: "tkbTeacher",
			icon: <OrderedListOutlined />
		},
		{
			label: <Link href="/teacher/fee">Bảng chấm công</Link>,
			key: "feeTeacher",
			icon: <RetweetOutlined />
		},
		{
			label: <Link href="/teacher/suggest">Quản lý đề xuất</Link>,
			key: "teacherSuggestClass",
			icon: <SnippetsOutlined />
		},
	]

	const itemsSlider = [
		// {
		// 	label: <Link href="/admin">Dashboard</Link>,
		// 	key: "dashboard",
		// 	icon: <DashboardOutlined />,
		// },
		// {
		// 	type: "divider",
		// },
		{
			label: (
				<Link href="/admin/classroom">Quản lý phòng học</Link>
			),
			key: "classroomManagement",
			icon: <BankOutlined />
		},
		{
			label: "Quản lý chung",
			key: "manageSumary",
			icon: <ApartmentOutlined />,
			children: [
				{
					label: <Link href="/admin/departmentManage">Quản lý bộ môn</Link>,
					key: "departmentManage",
				},
				{
					label: <Link href="/admin/manageTeacher">Quản lý giáo viên</Link>,
					key: "adminTeacherManage",
				},
				{
					label: <Link href="/admin/manageStudent">Quản lý học sinh</Link>,
					key: "adminStudentManage",
				},
				{
					label: <Link href="/admin/recommendManage">Quản lý đề xuất</Link>,
					key: "recommend",
				},
			]
		},
		{
			label: "Thi đầu vào",
			key: "extranceExam",
			icon: <CalculatorOutlined />,
			children: [
				{
					label: (
						<Link href="/admin/manageEntranceExam/regisEntranceExam">Đăng ký thi thử</Link>
					),
					key: "regisExam",
				},
				{
					label: (
						<Link href="/admin/manageEntranceExam/listEntranceExam">Danh sách thi thử</Link>
					),
					key: "listRegisExam",
				},
				{
					label: (
						<Link href="/admin/manageEntranceExam/resultExam">Kết quả thi thử</Link>
					),
					key: "resultExam",
				},
			],
		},
		{
			label: "Học thử",
			key: "entrialLearning",
			icon: <ContainerOutlined />,
			children: [
				{
					label: (
						<Link href="/admin/testLearning/regisTestLearning">Đăng ký học thử</Link>
					),
					key: "regisLearning",
				},
				{
					label: (
						<Link href="/admin/testLearning/listTestLearning">Danh sách học thử</Link>
					),
					key: "listLearning",
				},
			],
		},
		{
			label: "Lớp học",
			key: "class",
			icon: <ReadOutlined />,
			children: [
				{
					label: (
						<Link href="/admin/manageClass/createClass">Tạo lớp học mới</Link>
					),
					key: "createClass",
				},
				{
					label: (
						<Link href="/admin/manageClass/listClass">Danh sách lớp</Link>
					),
					key: "listClass",
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
	const logout = () => {
		message.success("Đăng xuất!!!!");
		localStorage.clear();
		deleteCookie('token')
		goTo('/login')
	};
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
			label: <p onClick={logout}>Đăng xuất</p>,
		},
	];


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
					{
						user?.role == "admin" &&
						<Menu
							theme="light"
							mode="inline"
							defaultSelectedKeys={["1"]}
							items={itemsSlider}
						/>
					}
					{
						user?.role == "teacher" &&
						<Menu
							theme="light"
							mode="inline"
							defaultSelectedKeys={["1"]}
							items={itemsTeacher}
						/>
					}
					{
						user?.role == "user" &&
						<Menu
							theme="light"
							mode="inline"
							defaultSelectedKeys={["1"]}
							items={itemStudent}
						/>
					}
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
										&nbsp; {user?.name}
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
