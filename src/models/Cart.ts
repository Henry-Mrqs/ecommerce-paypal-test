type CartProductsType = {
    productId: number,
    name: string,
    price: number,
    image: string,
    amount: number
};

const products: CartProductsType[] = [];

export const CartProducts = {
    getAll: (): CartProductsType[] => {
        return products;
    },
    totalProducts: () => {
        return products.reduce((total, product) => total + product.amount, 0);
    },
    totalPrice: () => {
        return products.reduce((total, product) => total + (product.price * product.amount), 0);
    }
};

export { CartProductsType };
