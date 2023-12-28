import { Request, Response } from "express";
import { User, UserType } from "../models/User";

export const home = (req: Request, res: Response) => {
    console.log("Usuários Existentes:", User.getAll());
    res.render('pages/home');
}

export const homeSubmit = (req: Request, res: Response) => {
    try {
        if (req.body) {
            // Certifique-se de que req.body tem a estrutura correta (UserType)
            const newUser: UserType = req.body;

            // Obtenha o array de usuários
            const usersArray = User.getAll();

            //Adicione o novo usuário

                usersArray.length = 0;  // Limpa o array antes de adicionar um novo usuário
                usersArray.push(newUser);

            console.log("Usuários atualizados:", User.getAll());
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


