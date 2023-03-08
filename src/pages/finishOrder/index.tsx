import Head from "next/head";
import { useRouter } from "next/router";
import styles from './styles.module.css';
import { FaShoppingCart } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { api } from "../../services/apiClient";

import { useEffect } from "react";


export default function FinishOrder(){

    const router = useRouter();

  

   

    function handleprevius() {
            
    
        router.back();
    }

    async function handleFinishOrder(){

        try{

            await api.put('/order/send',{

                order_id: router.query?.order_id
            })
                toast.success("Mesa Aberta com sucesso!");
                router.push('/orders')
            

        }catch(err){

            toast.error("Falha ao fechar pedido")
        }
    }

    return(
        <>
        <Head>
                <title>Finalizar Pedido - SujeitoPizza</title>
            </Head>

            <header>
                <div className={styles.header}>
                 <FaArrowLeft size={30} color="white"  className={styles.arrow} onClick={handleprevius} />
                <span className={styles.span}>Finalizando</span>
                </div>
                
            </header>

            <div className={styles.container}>
               <h1 className={styles.containerH1}>Você deseja finalizar esse pedido?</h1> 
               <span className={styles.title}>Mesa {router.query.table}</span>
               <button  className={styles.button} onClick={handleFinishOrder}>Finalizar Pedido <FaShoppingCart size={20} color="#1d1d2e"  /></button>
                
            </div>
            
        </>
    )
}