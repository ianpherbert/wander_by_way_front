export const headerStyle = {
    header: {
        position: "absolute",
        left: "90px",
        top: "15px",
        right: "40px",
        justifyContent: "space-between",
        borderBottom: "black 2px solid",
        width: "90vw"
    },
    links: {
        languageGrid: {
            display: "flex",
            justifyContent: "center"
        },
        connectionGrid: {
            borderRight: "black 2px solid",
            display: "flex", justifyContent: "center"
        }
    },
    langIcon: {
        height: " 20px",
        width: " 30px",
        borderRadius: " 6px",
        cursor: " pointer",
        "&:hover": {
            boxShadow: "3px 3px 15px -2px rgba(139,190,178,0.68)",
        },
        "&:active": {
            boxShadow: "3px 3px 15px -2px rgb(139, 190, 178)",
        }
    }
};