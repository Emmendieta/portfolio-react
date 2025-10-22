import "./Forbidden.css";

function Forbidden() {
    return (
        <div className="divForbidden">
            <h1 className="h1Forbidden">You don't have the credentials to view this page or the credentials expired</h1>
            <img src="/img/forbidden2.svg" alt="imageForbidden" className="imgForbidden" />
        </div>
    )
};

export default Forbidden;