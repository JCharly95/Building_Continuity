import axios from "axios";
import React from "react";

const baseURL = "https://jsonplaceholder.typicode.com/posts";

export default function Axios_PUT() {
  const [post, setPost] = React.useState(null);

  React.useEffect(() => {
    axios.get(`${baseURL}/1`).then((response) => {
      setPost(response.data);
    });
  }, []);

  function updatePost() {
    axios
      .put(`${baseURL}/1`, {
        title: "Hola Muchachos!",
        body: "Entonces cuando armamos la ViniPosada?."
      })
      .then((response) => {
        setPost(response.data);
      });
  }

  if (!post){
    return "No hay publicaciones!"
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <button onClick={updatePost}>Actualizar Publicacion</button>
    </div>
  );
}