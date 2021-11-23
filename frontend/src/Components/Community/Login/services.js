import axios from "axios";

const login = async (credentials) => {
    try {
        const response = await axios.post("/api/login", credentials);
        if (response.status === 401 || response.status === 404) {
            throw response.body.error;
        }
        if (response.data.token) {
            localStorage.setItem("user", response.data.token);
        }
        return response.data;
    } catch (error) {
        //TODO: Add a notification or something like that.
        console.log(error);
    }
};

const register = async (credentials) => {
    try {
        const response = await axios.post("/api/users", credentials);
        if (response.status === 400 || response.status === 404) {
            throw response.body.error;
        }
        return response.data;
    } catch (error) {
        //TODO: Add a notification or something like that.
        console.log(error);
    }
};

const logout = () => {
    localStorage.removeItem("user");
};

export { login, register, logout };
