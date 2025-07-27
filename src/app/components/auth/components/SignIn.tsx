import { SignIn, useUser } from "@clerk/nextjs"
import styles from "../styles/SignUpSignIn.module.css"

const ClerkSignIn = () => {
    const {isSignedIn} = useUser()
    if( isSignedIn ) {
        return null
    }
    return (
        <div className={styles.container}>
            <SignIn path="/auth/login" routing="path" />
        </div>
    )
}

export default ClerkSignIn