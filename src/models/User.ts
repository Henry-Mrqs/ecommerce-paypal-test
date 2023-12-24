type UserType = {
    name: string;
    lastName: string;
    phone: string;
    email: string;
    address: AddressType;
};

type AddressType = {
    linha1: string;
    linha2: string;
    state: string;
    zip: string;
    country: string;
};

const user: UserType[] = [
    {
        name: '',
        lastName: '',
        phone: '',
        email: '',
        address: {
            linha1: '',
            linha2: '',
            state: '',
            zip: '',
            country: '',
        }
    }
];

export const User = {
    getAll: (): UserType[] => {
        return user;
    }
};