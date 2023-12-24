type ProductType = {
    id: number,
    name: string,
    price: number,
    image: string,
    amount: number
};

const product: ProductType[] = [
    {
        id: 0,
        name: "Men's white t-shirt",
        price: 45.98,
        image: 'white-m-tshirt.jpg',
        amount: 0
    },
    {
        id: 1,
        name: "Men's black t-shirt.",
        price: 45.98,
        image: 'black-m-tshirt.jpg',
        amount: 0
    },
    {
        id: 2,
        name: "Men's graphic t-shirt.",
        price: 54.26,
        image: 'freestyle-m-tshirt.jpg',
        amount: 0
    },
    {
        id: 3,
        name: "Man's black jeans.",
        price: 115.97,
        image: 'black-m-jeans.jpg',
        amount: 0
    },
    {
        id: 4,
        name: "Man's blue jeans.",
        price: 115.97,
        image: 'blue-m-jeans.jpg',
        amount: 0
    },
    {
        id: 5,
        name: "Men's brown jacket.",
        price: 158.45,
        image: 'brown-m-jacket.jpg',
        amount: 0
    },//Homem
    {
        id: 6,
        name: "Woman's white t-shirt.",
        price: 45.98,
        image: 'white-f-tshirt.jpg',
        amount: 0
    },
    {
        id: 7,
        name: "Woman's black t-shirt.",
        price: 45.98,
        image: 'black-f-tshirt.jpg',
        amount: 0
    },
    {
        id: 8,
        name: "Woman's graphic t-shirt.",
        price: 54.26,
        image: 'freestyle-f-tshirt.jpg',
        amount: 0
    },
    {
        id: 9,
        name: "Woman's black jeans.",
        price: 115.97,
        image: 'black-f-jeans.jpg',
        amount: 0
    },
    {
        id: 10,
        name: "Woman's blue jeans.",
        price: 115.97,
        image: 'blue-f-jeans.jpg',
        amount: 0
    },
    {
        id: 11,
        name: "Woman's brown sweater.",
        price: 145.20,
        image: 'brown-f-sweater.jpg',
        amount: 0
    },
    {
        id: 12,
        name: "Woman's black jacket.",
        price: 158.45,
        image: 'black-f-jacket.jpg',
        amount: 0
    },
];

export const Product = {
    getAll: (): ProductType[] => {
        return product;
    },

    getFromAmount: (amount: number): ProductType[] => {
        return product.filter(item =>{
            if (item.amount > 0) {
                return true;
            } else {
                return false;
            }
        });
    }
};