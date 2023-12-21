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
        name: '',
        price: 0,
        image: '',
        amount: 0
    }
];

export const Product = {
    getAll: (): ProductType[] => {
        return product;
    }
};