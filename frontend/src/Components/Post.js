import axios from "axios";
import { useEffect, useState } from "react";

const Post = (props) => {
    return (
        <div className="Post" id={props.id}>
            <h3 className="PostTitle">{props.title}</h3>
            <p>{props.textContent}</p>
        </div>
    );
};

const PostFeed = () => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        axios.get("/api/posts").then((res) => setPosts(res.data));
    }, []);
    return (
        <div className="Posts">
            {posts.map((post) => (
                <Post
                    key={post.id}
                    title={post.title}
                    textContent={post.content}
                />
            ))}
        </div>
    );
};

export default PostFeed;
