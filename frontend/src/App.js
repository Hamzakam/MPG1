import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
const UpDownCounter = () => {
    const [likeCount, setLikeCount] = useState(0);
    const onLike = () => setLikeCount(likeCount + 1);
    const onDislike = () => setLikeCount(likeCount - 1);
    return (
        <div className="UpDownCounter">
            <button id="like" onClick={onLike}>
                ▲
            </button>
            <p>{likeCount}</p>
            <button id="dislike" onClick={onDislike}>
                ▼
            </button>
        </div>
    );
};
const Post = (props) => {
    return (
        <div className="Post" id={props.id}>
            <UpDownCounter />
            <h3 className="PostTitle">{props.title}</h3>
            <p>{props.textContent}</p>
        </div>
    );
};

const PostFeed = () => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        axios
            .get("http://localhost:3000/api/posts")
            .then((res) => setPosts(res.data));
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

const App = () => {
    return (
        <div className="App">
            <h1>PeerHub</h1>
            <PostFeed />
        </div>
    );
};

export default App;
