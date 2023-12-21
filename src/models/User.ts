type UserType = {
    name: string;
    lastName: string;
    email: string;
    address: AddressType;
};

type AddressType = {
    linha1: string;
    linha2: string;
    state: string;
    zip: number;
    country: number;
};

const user: UserType[] = [
    {
        name: '',
        lastName: '',
        email: '',
        address: {
            linha1: '',
            linha2: '',
            state: '',
            zip: 0,
            country: 0,
        }
    }
];

export const User = {
    getAll: (): UserType[] => {
        return user;
    }
};