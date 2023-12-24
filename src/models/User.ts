type AddressType = {
    line1: string;
    line2: string;
    state: string;
    zip: string;
    country: string;
};

type CartItemType = {
    productId: number;
    quantity: number;
};

type UserType = {
    name: string;
    lastName: string;
    phone: string;
    email: string;
    address: AddressType;
    cart: CartItemType[]; // Adicione a propriedade cart ao tipo UserType
};

const users: UserType[] = [];

export const User = {
    getAll: (): UserType[] => {
        return users;
    },
    addUser: (newUser: UserType) => {
        users.length = 0;  // Limpa o array antes de adicionar um novo usuário
        users.push(newUser);
    }
};

export { UserType, CartItemType };
