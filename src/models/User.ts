type AddressType = {
    line1: string;
    line2: string;
    state: string;
    zip: string;
    country: string;
};

type UserType = {
    name: string;
    lastName: string;
    phone: string;
    email: string;
    address: AddressType;
};

const users: UserType[] = [];

export const User = {
    getAll: (): UserType[] => {
        return users;
    }
};

export { UserType };
