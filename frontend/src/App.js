import "./App.css";
import { useState } from "react";

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
  let posts = [
    {key:1, title: "Who am i", textContent: "it's me mario" },
    {key:2, title: "Half as Creative", textContent: "I am an uncreative fuck" },
  ];
  
  return (
    <div className="Posts">
      {
        posts.map(post=>(<Post key={post.key} title={post.title} textContent={post.textContent}/>))
      }
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
