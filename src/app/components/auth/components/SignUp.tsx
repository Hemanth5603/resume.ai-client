import { SignUp } from "@clerk/nextjs"
import styles from "../styles/SignUpSignIn.module.css"

const ClerkSignUp = () => {
    return (
        <div className = {styles.container}>
            < SignUp path="/auth/signup" routing="path"/>
        </div>
    )
}

export default ClerkSignUp