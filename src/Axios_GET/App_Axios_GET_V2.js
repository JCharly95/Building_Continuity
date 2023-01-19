import axios from "axios";
import React from "react";

const baseURL = "https://dummyjson.com/products";

export default function Axios_GET() {
  const [post, setPost] = React.useState(null);

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setPost(response.data);
    });
  }, []);

  if (!post) {
    return null;
  }

  return (
    <div>{
      post.map((res) => (
      <>
      <h1>Titulo de la Publicacion: {res.title}</h1>
      <p>Registro de la Publicacion: {res.id};</p>
      <hr />
      </>
      ))
    }</div>
  );
}