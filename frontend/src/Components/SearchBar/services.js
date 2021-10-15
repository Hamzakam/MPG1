import axios from "axios";

const search = async (filter) => {
    try {
        const response = await axios.get("/api/sub/search");
        if (response.status === 500) {
            throw response.body.error;
        }
        return response.body;
    } catch (error) {
        console.log(error);
    }
};
