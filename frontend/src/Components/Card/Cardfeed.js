import MultiActionAreaCard from "./Card";
import {useState,useEffect} from "react";
import axios from "axios";
const Cardfeed = ()=>{
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        axios.get("/api/posts").then((res) => setPosts(res.data));
    }, []);
    return (
        <div className="Posts">
            {posts.map((post) => (
                <MultiActionAreaCard
                    key={post.id}
                    post={post}
                />
            ))}
        </div>
    );
};
export default Cardfeed;