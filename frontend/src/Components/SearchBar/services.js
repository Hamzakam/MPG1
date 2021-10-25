import axios from "axios";

const search = async (filter, limit, offset) => {
  try {
    const response = await axios.get(
      `/api/sub/search?filter=${filter}&limit=${limit || 10}&offset=${
        offset || 0
      }`
    );
    if (response.status === 500 || response.status === 400) {
      throw response.body.error;
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export { search };
