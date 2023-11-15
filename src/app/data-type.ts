export interface SignUpDataType{
    name:string,
    email:string,
    password:string
}


export interface LoginDataType{
    email:string,
    password:string
}

export interface product{
    name:string,
    price:number,
    category:string,
    color:string,
    description:string,
    image:string,
    _id:string,
    quantity:undefined | number,
    productId:undefined | string
}


export interface cart{
    name:string,
    price:number,
    category:string,
    color:string,
    description:string,
    image:string,
    _id:string |undefined,
    quantity:undefined | number,
    userId:string,
    productId:string
}

export interface priceSummary{
    price:number,
    discount:number,
    tax:number,
    delivery:number,
    total:number
}

export interface order{
    email:string,
    address:string,
    contact:string,
    totalPrice:number,
    userId:string
}