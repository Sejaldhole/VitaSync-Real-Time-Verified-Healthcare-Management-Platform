
import { Navigate }

from "react-router-dom";

import { jwtDecode }

from "jwt-decode";

function ProtectedRoute({

    children,

    allowedRole

}) {

    const token =
        localStorage.getItem("token");

    // NO TOKEN
    if (!token) {

        return <Navigate to="/" />;
    }

    try {

        const decoded =
            jwtDecode(token);

        // WRONG ROLE
        if (
            decoded.role
            !==
            allowedRole
        ) {

            return <Navigate to="/" />;
        }

        return children;

    } catch (error) {

        localStorage.removeItem(
            "token"
        );

        return <Navigate to="/" />;
    }
}

export default ProtectedRoute;

