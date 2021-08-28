import './App.css';

const Posts = (props)=>{
  return (
    <div className="Post">
      <h3>{props.title}</h3>
      <p>{props.textContent}</p>
    </div>
  )
}

const App = ()=> {
  return (
    <div className="App">
      <h1>PeerHub</h1>
      <Posts title="Who am i" textContent="it's me mario"/>
      <Posts title="Half as Creative" textContent="I am an uncreative fuck"/>
    </div>
  );
}

export default App;
