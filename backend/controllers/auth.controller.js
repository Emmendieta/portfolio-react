class AuthController {
    registerCB = async (req, res) => {
        const { _id } = req.user;
        res.json201(_id, "Registered!");
    };

    loginCB = async (req, res) => {
        const { _id } = req.user;
        /*         const opts = { maxAge: 24 * 60 * 60 * 1000 };
                res.cookie("token", req.user.token, opts).json200(_id, "Logged In Success!(C)"); */
        const opts = {
            httpOnly: true,
            secure: false, // ⚠️ Ponelo en true si usás HTTPS
            sameSite: "lax", // O "none" si usás HTTPS y querés compartir entre dominios ⚠️ Si usás sameSite: "none", secure debe estar en true y necesitás usar HTTPS. Para desarrollo local, mejor usar sameSite: "lax" y secure: false.
            maxAge: 24 * 60 * 60 * 1000
        };
        res.cookie("token", req.user.token, opts).json200(_id, "Logged In Success!(C)");
    };

    singOutCB = async (req, res) => res.clearCookie("token").json200(req.user._id, "Sign Out Success!(C)");

    badAuthCB = async (req, res) => res.json401();

    forbiddenCB = async (req, res) => res.json403();

    currentCB = async (req, res) => res.json200(req.user, "User is online!(C)");
};

const authController = new AuthController();

export default authController;