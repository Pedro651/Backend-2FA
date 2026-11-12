// Pega a biblioteca nativa do Node.js para fazer operações de criptografia
const crypto = require("crypto");

// Chave secreta do servidor. É ela que impede que estranhos consigam adivinhar os códigos.
const SECRET_SERVER = process.env.COY_SECRET;



// 1. GERAR CÓDIGO 2FA
 export function gerarCodigo(user_id:string,timeStamp =Date.now()){

  //Essa linha serve para fazer o código mudar a cada 2 minutos.
  const tempoJanela = Math.floor(timeStamp/120000);
  //Gere um código 2FA específico para este usuário e para este período de 2 minutos
  const chaveCombinada = `${user_id}-${tempoJanela}`;

  //Crie um gerador de código secreto usando o algoritmo SHA256 e a chave secreta do servidor.
  //SHA256 é uma função matemática que cria uma "assinatura digital" dos dados. No 2FA, ele ajuda a gerar códigos que ninguém consegue adivinhar
  const hmac = crypto.createHmac('sha256',SECRET_SERVER);

  // Entrega a 'chaveCombinada' para o gerador
  //Essa linha serve para entregar a informação que será transformada em um código secreto.
  hmac.update(chaveCombinada);

  // Transforma tudo em um texto gigante misturado e indecifrável (hash hexadecimal)
  const hash = hmac.digest('hex');
  // Pega só os 8 primeiros caracteres desse texto gigante
  const numeroSubstr = hash.substring(0, 8);

  // Converte esse trecho (que está em hexadecimal) para um número inteiro comum
  const codigoInteiro = parseInt(numeroSubstr, 16);

  // Usa a matemática (resto da divisão % + 100000) para garantir que 
  // o resultado seja SEMPRE um número de exatamente 6 dígitos (entre 100000 e 999999)
  const codigo = (codigoInteiro % 900000) + 100000

  // Retorna o número final em formato de texto (ex: "548291")
  return codigo.toString();

}


/* 
//Validar o codigo
 export function validarCodigo(user_id:string, codigoInserido:string){

  //Pego o momento de agora
  const agora = Date.now()

  //Pega o codigo que foi gerado agora
  const codigoEsperadoAtual = gerarCodigo(user_id,agora)

  // Pega o codigo que foi gerado antes de agora
  const codigoEsperadodoPassado = gerarCodigo(user_id,agora - 120000)

    // Se o código digitado for igual ao atual OU ao anterior, aceita!
    if (codigoInserido === codigoEsperadoAtual || codigoInserido === codigoEsperadodoPassado) {
        return true; 
    }
    
    // Se não bater com nenhum dos dois, recusa.
    return false; 

}

*/






/* 
// ========================================================
// EXEMPLO PRÁTICO
// ========================================================
const userId = "usuario_9876";

// O servidor gera o código do usuário no momento do login e envia por e-mail/SMS
const codigoGerado = gerarCodigo(userId);
console.log(`Código enviado ao usuário: ${codigoGerado}`);

// Simula o usuário recebendo o código e digitando no site
const inputUsuario = codigoGerado; 
const ehValido = validarCodigo(userId, inputUsuario);

// Se tudo deu certo, imprime "SIM"
console.log(`O código digitado é válido? ${ehValido ? "SIM" : "NÃO"}`);
*/