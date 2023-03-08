import { SelectHTMLAttributes, useEffect, useState } from "react";
import { setupAPIClient } from "../../services/api";
import { api } from "../../services/apiClient";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { ProductProps } from "../order";


type ItemProps = {

    id: string;
    name : string;
}


interface CategoryProps{

    categoryList: ItemProps[];
}

export default function Teste({categoryList}: CategoryProps) {

    const [category, setCategory] = useState(categoryList || []);
    const [categorySelected, setCategorySelected] = useState(0)
    
    const [products, setProducts] = useState<ProductProps[] | []>([])
    const [productSelect, setProductSelected] = useState<ProductProps | undefined>()








 
        function handleChangeCategory(event) {

        setCategorySelected(event.target.value);
        
}

function handleChangeProduct(event) {

    setProductSelected(event.target.value);
    
}


useEffect(() => {

    async  function savebtn(){

             const response = await api.get('/category/product',{
        
                 params:{
        
                     category_id: category[categorySelected].id
                 }
             })
        
             setProducts(response.data)
             console.log(response.data)
            
         }
         savebtn();
},[categorySelected])

// async  function savebtn(){

//     const response = await api.get('/category/product',{

//         params:{

//             category_id: category[categorySelected].id
//         }
//     })

//     console.log(response.data)
// }




    return (
        <div>

<select value={categorySelected} onChange={handleChangeCategory} >

    {category.map((item, index)=>{

    return(
        <option key={item.id} value={index} >

            {item.name}
        </option>
    )

})}
</select>

                       
                             <select value={productSelect} onChange={handleChangeProduct}  >

                             {products.map((item, index) => {

                                 return (
                                     <option key={item.id} value={index} >

                                         {item.name}
                                     </option>
                                 )

                             })}
                         </select>

                       


    

        </div>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx) => {

    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get('/category');
    



    return {

        props: {

            categoryList: response.data
        }
    }
})