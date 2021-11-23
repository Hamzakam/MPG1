import axios from "axios";

const sendCommunityData = async (community) => {
  try {
    let config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user"),
      },
    };
    const response = await axios.post(
      "/api/sub",
      { name: community.communityName, description: community.communityDesc },
      config
    );
    if (response.status === 401 || response.status === 404) {
      throw response.body.error;
    }
    return response.data;
  } catch (error) {
    //TODO: Add a notification or something like that.
    console.log(error);
  }
};
export { sendCommunityData };
