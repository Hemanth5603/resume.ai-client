import PDFUploadForm from "./PDFUploadForm"
import styles from "../styles/Dashboard.module.css"

const Dashboard = () => {
    return (
        <div className={styles.dashboardContainer}>
            <main className={styles.mainContent}>
                <div className={styles.heroSection}>
                    <h1 className={styles.heroTitle}>
                        CURATE YOUR PROFESSIONAL NARRATIVE
                        <br />
                        WITH SURGICAL PRECISION
                    </h1>
                </div>
                <PDFUploadForm />
            </main>
        </div>
    )
}

export default Dashboard