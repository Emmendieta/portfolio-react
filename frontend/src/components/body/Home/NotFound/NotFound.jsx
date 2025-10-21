import "./NotFound.css";

function NotFound() {
    return (
        <div className="divError">
            <h1 className="h1Error">The page you atempt to go doesn't Exist!</h1>
            <img src="/img/oops.png" alt="imageError" className="imgError" />
        </div>
    );
};

export default NotFound;