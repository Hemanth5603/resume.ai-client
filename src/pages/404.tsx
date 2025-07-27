import Custom404 from "@/app/styled_components/404"
import Head from "next/head"

const NotFoundPage = () => {
    return (
        <>
            < Head>
                <title>Not Found | Resume.ai</title>
            </Head>
            < Custom404 />
        </>
    )
}

export default NotFoundPage