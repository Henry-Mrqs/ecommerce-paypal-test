import { Request, Response } from "express";
import { User, UserType } from "../models/User";

export const home = (req: Request, res: Response) => {
    const usersArray = User.getAll();
    res.render('pages/home', {
        usersArray
    });
}

export const homeSubmit = (req: Request, res: Response) => {
    try {
        if (req.body) {
            // Certifique-se de que req.body tem a estrutura correta (UserType)
            const newUser: UserType = req.body;

            // Obtenha o array de usuários
            const usersArray = User.getAll();

            // Verifique se já existe um usuário com o mesmo email
            const existingUserIndex = usersArray.findIndex(user => user.email === newUser.email);

            // Se já existe, substitua-o; caso contrário, adicione o novo usuário
            if (existingUserIndex !== -1) {
                usersArray[existingUserIndex] = newUser;
            } else {
                usersArray.push(newUser);
            }

            // Armazene o array atualizado em um cookie
            res.cookie('users', JSON.stringify(usersArray), { path: '/shop' }); // Defina o caminho correto

            console.log("Usuários atualizados:", usersArray);
            // Redirecione para a rota de shop após definir o cookie
            res.redirect('/shop');
        } else {
            console.error("Erro ao processar a solicitação: Body vazio");
            res.status(500).send("Erro interno do servidor");
        }
    } catch (error) {
        console.error("Erro ao processar a solicitação:", error);
        res.status(500).send("Erro interno do servidor");
    }
}


