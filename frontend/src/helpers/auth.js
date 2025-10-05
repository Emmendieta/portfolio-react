const getCurrentUser = async () => {
    const opts = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    };
    try {
        const url = "http://localhost:8080/api/auth/current";
        const response = await fetch(url, opts);
        const data = await response.json();

        if (!response.ok || data.error) { return { user: null, error: true }; };

        return { user: data.response, error: false };
    } catch (error) {
        //LOGER:
        console.error(error);
        return { error: true };
    }
};

const loginUser = async (email, password) => {
    const data = { email, password };
    const opts = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
    };
    try {
        const url = "http://localhost:8080/api/auth/login";
        const response = await fetch(url, opts);
        const data = await response.json();

        if (!response.ok || data.error) { return { user: null, error: true, message: data?.error?.message || "Login failed!" }};

        return { user: data.response, error: false };
    } catch (error) {
        //LOGGER:
        console.error(error);
        return { error: true }
    }
};

const signOutUser = async () => {
    const opts = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    };
    try {
        const url = "http://localhost:8080/api/auth/signout";
        const response = await fetch(url, opts);
        const res = await response.json();
        return res;        
    } catch (error) {
        //LOGGER:
        console.error(error);
        return { error: true };
    }
};

export { getCurrentUser, signOutUser, loginUser };