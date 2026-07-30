import { useNavigate }

from "react-router-dom";

function Navbar({

    title,

    dashboardPath

}) {

    const navigate = useNavigate();

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/");
    };

    return (

        <div
            style={{

                display: "flex",

                justifyContent:
                    "space-between",

                alignItems: "center",

                padding: "15px",

                backgroundColor:
                    "#1976d2",

                color: "white"
            }}
        >

            <h2>
                {title}
            </h2>

            <div>

                <button

                    onClick={() =>
                        navigate(
                            dashboardPath
                        )
                    }

                    style={{
                        marginRight: "10px"
                    }}
                >

                    Dashboard

                </button>

                <button
                    onClick={logout}
                >

                    Logout

                </button>

            </div>

        </div>
    );
}

export default Navbar;

