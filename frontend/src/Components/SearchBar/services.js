import axios from "axios";

const search = async (filter, limit, offset) => {
  try {
    const response = await axios.get(
      `/api/sub/search?filter=${filter}&limit=${limit || 0}&offset=${
        offset || 10
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
