import { Navigate } from "react-router-dom";

export default function ErrorPage() {
    localStorage.clear();
    return (
        <Navigate to="/login" />
    )
}