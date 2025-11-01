export const validateRecaptcha = async (token) => {
    const secretkey = process.env.RECAPTCHA_SECRET_KEY;
    console.log("Secret KEY:", secretkey)
    if(!secretkey) throw new Error("CAPTCHA SECRECT KEY is not defined!");

    const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify`,
        {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded"},
            body: `secret=${secretkey}&response=${token}`
        }
    );

    const data = await response.json();
    return data.success;
};