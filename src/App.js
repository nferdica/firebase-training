import { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import './app.css'

function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdPost] = useState('');
  const [post, setPost] = useState([]);

  async function buscarPost() {

  //  const postRef = doc(db, 'post', '1');

  //  await getDoc(postRef)
  //  .then((snapshot) => {
  //    setAutor(snapshot.data().autor)
  //   setTitulo(snapshot.data().titulo)
  //  })
  //  .catch((error) => [
  //    console.log(error)
  // ])

    const postRef = collection(db, 'post')
    await getDocs(postRef)
    .then((snapshot) => {
      let lista = [];
      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor
        })
      })

      setPost(lista);

    })
    .catch((error) => {
      console.log(error)
    })

  }
  
  async function handleAdd() {
  //  await setDoc(doc(db, 'post', '2'), {
  //    titulo: titulo,
  //    autor: autor,
  //  })
  //  .then(() => {
  //    console.log('Dados registrados')
  //  })
  //  .catch((error) => {
  //    console.log(error)
  //  })

    await addDoc(collection(db, 'post'), {
      titulo: titulo,
      autor: autor,
    })
    .then(() => {
      console.log('Dados registrados');
      setAutor('');
      setTitulo('');
    })
    .catch((error) => {
      console.log(error)
    })
  }

  async function editarPost() {
    const docRef = doc(db, 'post', idPost)
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor,
    })
    .then(() => {
      setIdPost('');
      setAutor('');
      setTitulo('');
      buscarPost();
    })
    .catch((error) => {
      console.log(error)
    })
  }

  return (
    <div>
      <h1>ReactJs + Firebase</h1>

      <div className='container'>

        <label>ID: </label>
        <input placeholder='Digite o ID do post' value={idPost} onChange={(e) => setIdPost(e.target.value)} /> <br />

        <label>Titulo:</label>
        <textarea placeholder='Digite o titulo' type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)}/>

        <label>Autor:</label>
        <input type="text" placeholder='Autor do post' value={autor} onChange={(e) => setAutor(e.target.value)}/>

        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPost}>Buscar post</button> <br/>
        <button onClick={editarPost}>Atualizar post</button>

        <ul>
          {post.map((post) => {
            return(
              <li key={post.id}>
                <strong>ID: {post.id}</strong> <br/>
                <span>Titulo: {post.titulo}</span> <br/>
                <span>Autor: {post.autor}</span> <br/> <br/>
              </li>
            )
          })}
        </ul>

      </div>
    </div>
  );
}

export default App;
