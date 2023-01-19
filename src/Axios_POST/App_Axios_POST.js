import axios from "axios";
import React from "react";

const baseURL = "https://jsonplaceholder.typicode.com/posts";

export default function Axios_POST() {
  const [post, setPost] = React.useState(null);

  React.useEffect(() => {
    axios.get(`${baseURL}/1`).then((response) => {
      setPost(response.data);
    });
  }, []);

  function createPost() {
    axios
      .post(baseURL, {
        title: "Hola Gamer!",
        body: "Quieres jugar League of Legends?"
      })
      .then((response) => {
        setPost(response.data);
      });
  }

  if (!post){
    return "No hay Publicaciones!"
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <button onClick={createPost}>Crear Publicacion</button>
    </div>
  );
}