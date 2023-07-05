import LayoutAdmin from "@/components/LayoutAdmin";

const Dashboard = ({ user }) => {
	console.log(user, 'user Home');

	return (
		<>
			<h1>Dashboard</h1>
		</>
	);
};

Dashboard.getLayout = ({ page, pageProps }) => (
	<LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default Dashboard;
