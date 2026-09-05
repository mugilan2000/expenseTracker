import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function OAuthSuccess() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("FULL URL:", window.location.href);
        console.log("QUERY STRING:", window.location.search);

        const token = searchParams.get("token");
        const uname = searchParams.get("username");

        if (token) {

            localStorage.setItem("accessToken", token);
            localStorage.setItem("username", uname);

            // Remove token from URL
            window.history.replaceState(
                {},
                document.title,
                "/oauth-success"
            );

            window.location.href = "/";

        } else {
            console.log("No token received");
            navigate("/login", { replace: true });
        }

    }, [searchParams, navigate]);

    return <div>Logging you in...</div>;
}

export default OAuthSuccess;