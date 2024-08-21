import { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import './app.css'

function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdPost] = useState('');
  const [post, setPost] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});


  useEffect(() => {
    async function loadPost() {
      const unsub = onSnapshot(collection(db, 'post'), (snapshot) => {
        let listaPost = [];

        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          })
        })

        setPost(listaPost);
      })
    }

    loadPost();

  }, [])

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
    })
    .catch((error) => {
      console.log(error)
    })
  }

  async function excluirPost(id) {
    const docRef = doc(db, 'post', id)
    await deleteDoc(docRef)
    .then(() => {
      console.log('Post excluido!')
    })
    .catch((error) => {
      console.log(error)
    })
  }

  async function newUser() {
    await createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      console.log('Usuário cadastrado')
      setEmail('');
      setPassword('');
    })
    .catch((error) => {
      if(error.code === "auth/weak-password") {
        alert('Senha muito fraco!')
      } else if(error.code === "auth/email-already-in-use") {
        alert("E-mail já cadastrado")
      }
    })
  }

  async function loginUser() {
    await signInWithEmailAndPassword(auth, email, password)
    .then((value) => {
      console.log('Usuário logado com sucesso!')
      setUserDetail({
        uid: value.user.uid,
        email: value.user.email,
      })
      setUser(true);
      setEmail('');
      setPassword('');
    })
    .catch((error) => {
      console.log(error)
    })
  }

  async function logoutUser() {
    await signOut(auth)
    setUser(false);
    setUserDetail({})
  }

  return (
    <div>
      <h1>Firebase project</h1>

      {user && (
        <div>
          <strong>Seja bem-vindo(a) (Voce estã logado!)</strong> <br />
          <span>ID: {userDetail.uid} - E-mail: {userDetail.email}</span> <br />
          <button onClick={logoutUser}>Logout</button>
          <br /> <br />
        </div>
      )}

      <div className='container'>

        <h2>Usuários</h2> 

        <label>E-mail</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Digite um e-mail'/> <br />

        <label>Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Digite uma senha'/> <br />

        <button onClick={newUser}>Cadastrar</button>
        <button onClick={loginUser}>Fazer login</button>


      </div>

      <br /> <br />
      <hr/>

      <div className='container'>

        <h2>Postagens</h2> 

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
                <span>Autor: {post.autor}</span> <br/>
                <button onClick={ () => excluirPost(post.id) }>Excluir</button> <br/> <br/>  
              </li>
            )
          })}
        </ul>

      </div>
    </div>
  );
}

export default App;
