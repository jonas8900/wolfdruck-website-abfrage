import { useState } from "react";
import { useRouter } from "next/router";
import LoginScreen from "../../components/Login/Loginscreen";
import { signIn } from "next-auth/react";
import ToastMessage from "@/components/toast/toastmessage";

export default function Login() {
    const [toastMessage, setToastMessage] = useState(null);
    const router = useRouter();



    async function handleSubmit(event) {
        event.preventDefault();
    
        const formData = new FormData(event.target);
        const email = formData.get("email");
        const password = formData.get("password");

    
        const response = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });
    
        if (response.error) {
            setToastMessage({
                type: 'error',
                message: "Login nicht Erfolgreich",
                timestamp: Date.now(),
            });
        } else {
           setToastMessage({
                type: 'success',
                message: "Login erfolgreich!",
                timestamp: Date.now(),
            });
            router.push("/admindata");

        }
    }

    return (
        <>
            <LoginScreen handleSubmit={handleSubmit} />
            {toastMessage && (
                <ToastMessage
                    message={toastMessage.message}
                    type={toastMessage.type}
                    timestamp={toastMessage.timestamp}
                />
            )}
        </>
        
    )
}