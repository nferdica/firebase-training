import { useState } from 'react';
import { db } from './firebase';
import { doc, collection, addDoc, getDoc } from 'firebase/firestore';
import './app.css'

function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

  async function buscarPost() {

    const postRef = doc(db, 'post', '1');

    await getDoc(postRef)
    .then((snapshot) => {
      setAutor(snapshot.data().autor)
      setTitulo(snapshot.data().titulo)
    })
    .catch((error) => [
      console.log(error)
    ])

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

  return (
    <div>
      <h1>ReactJs + Firebase</h1>

      <div className='container'>

        <label>Titulo:</label>
        <textarea placeholder='Digite o titulo' type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)}/>

        <label>Autor:</label>
        <input type="text" placeholder='Autor do post' value={autor} onChange={(e) => setAutor(e.target.value)}/>

        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPost}>Buscar post</button>

      </div>
    </div>
  );
}

export default App;
