import { FormEvent, useContext, useState } from 'react';
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import logoImg from '../../public/logo.svg';
import Image from 'next/image';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/Button';
import Link from 'next/link';

import { GetServerSideProps } from 'next';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { canSSRGuest } from '../utils/canSSRGuest';
export default function Home() {
  
  const {signIn} = useContext(AuthContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false)

async function handleLogin(event: FormEvent){

     event.preventDefault();


     if(email === '' || password === ''){

      toast.warning("preencha os campos")

      return;
     }


     setLoading(true)

     let data = {

      email,
      password
     }

     await signIn(data)

     setLoading(false);
}

  return (
<>
<Head>
  <title> SujeitoPizza - Faça seu login</title>
</Head>
<div className={styles.containerCenter}>

  <Image src={logoImg} alt="logo sujeito pizzaria" />

  <div className={styles.login}>

    <form  onSubmit={handleLogin} className="form-login">

    <Input
    placeholder='Digite seu email'
    type="text"
    value={email}
    onChange={ (e)=> setEmail(e.target.value)}
    />

    <Input
    placeholder='Sua senha'
    type="password"
    value={password}
    onChange= { (e)=> setPassword(e.target.value)}
    />
 
    <Button
    type="submit"
    loading={loading}
    
    >
      Acessar
    </Button>
    </form>
 
   
  </div>
</div>
</>
  )
}


export const getServerSideProps = canSSRGuest(async (ctx) =>{

  return {

    props: {
      
    }
  }

})