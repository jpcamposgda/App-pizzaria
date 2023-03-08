import Head from 'next/head';
import styles from './styles.module.css';

import { canSSRAuth } from '../../utils/canSSRAuth';


import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { setupAPIClient } from '../../services/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { BiTrash } from 'react-icons/bi'
import { api } from '../../services/apiClient';








type ItemProps = {

    id: string;
    name: string;
}



interface CategoryProps {

    categoryList: ItemProps[];
    order_id: string;
}


export type ProductProps = {

    id: string;
    name: string;
}

type ItemIProps = {

    id: string;
    product_id: string;
    name: string;
    amount: string | number;
}

type OrderItemProps = {

    id: string;
    amount: number;
    order_id: string;
    product_id: string;
    product: {
        id: string;
        name: string;
        description: string;
        price: string;
        banner: string;
    }
    order: {
        id: string;
        table: string | number;
        status: boolean;
        name: string | null;
    }

}

export default function Order({ categoryList }: CategoryProps) {







    const [category, setCategory] = useState(categoryList || []);
    const [categorySelected, setCategorySelected] = useState(0)

    const [products, setProducts] = useState<ProductProps[] | []>([])
    const [productSelect, setProductSelected] = useState(0)
    const [amount, setAmount] = useState('1')
    const [items, setItems] = useState<ItemIProps[]>([])
    const [listItems, setListItems] = useState<OrderItemProps[]>([])
    


    const router = useRouter();


    // useEffect(()=>{

    //     async function FindItems(){

           
    //        const response =  await api.get('/order/detail',{

    //             params:{

    //                 order_id: router.query.order_id
    //             }
    //         })
            
    //         setItems(response.data)
            
           
    //     }
    //     FindItems();
    // })


      function handleFinishOrder(){

        router.push({
            pathname: '/finishOrder',
            query:{

                table: router.query.table,
                order_id: router.query.order_id
                
            }
            
        })

    }

    async function handleDeleteItem(id: string){

    await api.delete('/order/remove',{

        params:{
            item_id: id,
        }

       
    })

    let removeitem = items.filter( item =>{

        return (item.id !== id)    
    })

    setItems(removeitem)

    }

    function handleChangeCategory(event) {

        setCategorySelected(event.target.value);

    }

    function handleChangeProduct(event) {

        setProductSelected(event.target.value);

    }


    async function handleAddItem(event: FormEvent){

        event.preventDefault();

        // console.log(
        //     router.query?.order_id,
            
        //     products[productSelect]?.id,

        //     amount
        // )
        const response = await api.post('/order/add',{

          
                order_id: router.query?.order_id,
                product_id: products[productSelect]?.id,
                amount: Number(amount)
            
        })
        let data = {

            id: response.data.id,
            product_id: products[productSelect]?.id as string,
            name:products[productSelect]?.name as string,
            amount: amount
        }

        
        setItems(oldArray => [...oldArray, data])

    }




    useEffect(() => {

        async function loadProducts() {

          
            const response = await api.get('/category/product', {

                params: {
                    category_id: category[categorySelected].id
                }
            })


            setProducts(response.data);
            products[productSelect]?.name
             


        }

     
    
    loadProducts();
    },
        [categorySelected])


        async function handleCloseOrder() {

        try {


            await api.delete('/order', {
                params: {
                    order_id: router.query?.order_id
                }
            })

            router.back()

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <Head>
                <title>Abrir Mesa - SujeitoPizza</title>
            </Head>

            <div>


                <main className={styles.container}>
                    <div 
                    className={styles.containerDiv}> 
                    <h1>Mesa  {router.query.table} </h1> 
                    {items.length === 0 || listItems.length === 0 &&(
                        <BiTrash size={28} color="red" className={styles.buttonDiv} onClick={handleCloseOrder} />
                    )}   </div>

                    <form className={styles.form} >



                        {category.length !== 0 && (
                            <select value={categorySelected} onChange={handleChangeCategory} >

                                {category.map((item, index) => {

                                    return (
                                        <option key={item.id} value={index} >

                                            {item.name}
                                        </option>
                                    )

                                })}
                            </select>

                        )}

                        {products.length !== 0 && (
                            <select value={productSelect} onChange={handleChangeProduct}  >

                                {products.map((item, index) => {

                                    return (
                                        <option key={item.id} value={index} >

                                            {item.name}
                                        </option>
                                    )

                                })}
                            </select>

                        )}




                        <div className={styles.qtdContainer}>
                            <label className={styles.qtdLabel}>Quantidade</label>
                            <input
                                type="number"
                                className={styles.input}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}


                            /></div>




                        <div className={styles.buttons}>
                            <button
                                className={styles.button}
                                type="submit"
                                onClick={handleAddItem}

                            >
                                +
                            </button>
                            <button
                                className={items.length === 0 ? styles.buttonDisabled : styles.buttonAdd}
                                
                                type="submit"
                                disabled={items.length === 0}
                                onClick={handleFinishOrder}

                            >
                                Avançar
                            </button>
                        </div>
                    </form>

                    <ul className={styles.ul} >
                     {
                        items.map((item)=>
                        {
                            return(
                               <div className={styles.lista}>
                                <li key={item.id} >{item.amount} - {item.name}   </li>
                                <BiTrash size={25} color="red" className={styles.buttonDivItem} onClick={()=> handleDeleteItem(item.id)}  />
                              </div> 
                            )
                        }
                        )
                     }
                      {/* {
                        items.map((item)=>
                        {
                            return(
                               <div className={styles.lista}>
                                <li key={item.id} >{item.amount} - {item.product.name}   </li>
                                <BiTrash size={25} color="red" className={styles.buttonDivItem} onClick={()=> handleDeleteItem(item.id)}  />
                              </div> 
                            )
                        }
                        )
                     } */}
                    </ul>
                </main>
            </div>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx) => {



    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get('/category');







    return {

        props: {

            categoryList: response.data,

            

        }
    }
})