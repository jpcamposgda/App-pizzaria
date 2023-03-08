import Head from "next/head";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

import { setupAPIClient } from "../../services/api";

import styles from './styles.module.css'
import { canSSRAuth } from "../../utils/canSSRAuth";
import Router from "next/router";


export default function Orders(){

    const [table, setTable] = useState('')
    const [name, setName] = useState('')
    async function handleRegister(event: FormEvent) {

        event.preventDefault();

        

        if(name === '' || table === ''){
            toast.error("Preencha o Campo Mesa!")
            return;
        }

        const apiClient = setupAPIClient();
        const response = await apiClient.post('/order',{
            
            table: Number(table),
            name: name

        } 
        
        )

        
        toast.success("Mesa aberta com Sucesso!");
        setName('');
        setTable('');
        
        Router.push({
            pathname: '/order',
            query:{

                table,
                order_id: response.data.id
                
            }
            
        })

        

       
        
    }



    return(

        <>
        <Head>

            <title>Orders - Abrir Mesa</title>
        </Head>
        <div>
        
            
            <main className={styles.container}>
                <h1>Novo Pedido</h1>

                <form className={styles.form} onSubmit={handleRegister} >
                    <input 
                    type="text"
                    placeholder="Digite o Número da Mesa"
                    className={styles.input} 
                    value={table}
                    onChange={ (e)=> setTable(e.target.value)}
                    />
                    
                    <input 
                    type="text"
                    placeholder="Digite alguma descrição"
                    className={styles.input} 
                    value={name}
                    onChange={ (e)=> setName(e.target.value)}
                    />
                    <button type="submit" className={styles.buttonAdd}>
                        Abrir Mesa
                    </button>
                </form>
            </main>
        </div>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx) => {

    return {

        props: {}
    }
});