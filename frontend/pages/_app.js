// import "antd/dist/antd.css";
import "tailwindcss/tailwind.css";
import "../styles/globalPages.css";
import Head from "next/head";
import { getCookie, hasCookie } from "@/api/cookies";
import { authMe, getMeInfo, setToken } from "@/api/address";
// import App from "next/app";
export default function MyApp({ Component, pageProps }) {
	if (typeof window !== "undefined") {
		if (hasCookie("token")) {
			pageProps.token = getCookie("token");
		} else {
			delete pageProps.user;
		}
	}
	if (pageProps?.token) {
		setToken(pageProps?.token);
	}

	const getLayout = Component.getLayout || (({ page, pageProps }) => page);
	return getLayout({
		page: (
			<>
				<Head>
					<title>GS App</title>
				</Head>
				<Component {...pageProps} />
			</>
		),
		pageProps,
	});
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
	const pageProps = Component.getInitialProps
		? await Component.getInitialProps(ctx)
		: {};
	if (typeof window !== "undefined") {
		pageProps.token = getCookie("token");
	} else {
		pageProps.token = ctx?.req?.cookies?.token;
	}
	if (pageProps.token) {
		try {
			let res = await getMeInfo(pageProps.token)
			pageProps.user = await res.json()
		} catch (error) {
			console.log("call api error", error)
		}
	}

	//Anything returned here can be access by the client
	return { pageProps };
};
