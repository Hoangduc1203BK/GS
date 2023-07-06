import LayoutPages from "@/components/LayoutPages";
import { Button, Row } from "antd";
import Link from "next/link";

export default function Home({ user }) {
	return (
		<main className="items-center">
			<h1 className="uppercase font-bold text-[25px] text-center text-blue-500">
				Welcome to GS App!
			</h1>
			<Row justify="center" className="mt-4">
				<Link href="/admin">
					<Button type="primary">Admin</Button>
				</Link>
			</Row>
		</main>
	);
}

Home.getLayout = ({ page, pageProps }) => (
	<LayoutPages {...pageProps}>{page}</LayoutPages>
);
