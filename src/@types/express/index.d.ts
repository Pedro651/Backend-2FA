    //É pra falar pra variavel request que tem o usuário do id la dentro, n da pra tipar no arquivo dele 
//pq o req ele n vem com a variável user_id
declare namespace Express{
    export interface Request{
        user: User;
        user_id:user_id
    }
}