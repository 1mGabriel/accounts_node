// modulos externos:
const inquirer = require("inquirer");
const chalk = require("chalk");

//modulos internos
const fs = require("fs");


// menu de funcionalidades
function operation() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "O que você deseja fazer?",
        choices: [
          "Criar Conta",
          "Consultar Saldo",
          "Depositar",
          "Sacar",
          "Sair",
        ],
      },
    ])
    .then((answer) => {
      const action = answer["action"];

      if (action == "Criar Conta") {
        createAccount();
      } else if (action == "Consultar Saldo") {
        getAccountBalance();
      } else if (action == "Depositar") {
        deposit();
      } else if (action == "Sacar") {
        withdraw()
      } else if (action == "Sair") {
        console.log(chalk.bgBlue.black("Obrigado por usar o Accounts!"));
        process.exit();
      }

      console.log(action);
    })
    .catch((err) => console.log(err));
}

operation();

//criar uma conta

function createAccount() {
  console.log(chalk.bgGreen.black("Parabéns por escolher o nosso banco!"));
  console.log(chalk.green("Defina as opções da sua conta a seguir:"));

  buildAccount();
}

function buildAccount() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite o noem para a sua conta",
      },
    ])
    .then((answer) => {
      const nameAccount = answer["accountName"];
      console.info(nameAccount);

      if (!fs.existsSync("accounts")) {
        fs.mkdirSync("accounts");
      }

      if (fs.existsSync(`accounts/${nameAccount}.json`)) {
        console.log(
          chalk.bgRed.black("Esta conta já existe, escolha outro nome!")
        );
        buildAccount();
        return;
      }

      fs.writeFileSync(
        `accounts/${nameAccount}.json`,
        '{"balance":0}',
        function (err) {
          console.log(err);
        }
      );
      console.log(chalk.green("Parabéns, a sua conta foi criada"));

      operation();
    })
    .catch((err) => console.log(err));
}

//Depositar

function deposit() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      // Verificar se a conta existe:
      if (!checkAccount(accountName)) {
        return deposit();
      }

      inquirer
        .prompt([
          {
            name: "amount",
            message: "Quanto você deseja depositar",
          },
        ])
        .then((answer) => {
          const amount = answer["amount"];

          // Adcionar quantia
          addAmount(accountName, amount);
          operation();
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

// Verificação da existencia da conta:
function checkAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(
      chalk.bgRed("Essa conta não existe! Insira o nome de uma conta existente")
    );
    return false;
  }
  return true;
}

function addAmount(accountName, amount) {
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(
      chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde")
    );
    deposit();
  }

  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);
  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (eer) {
      console.log(err);
    }
  );
  console.log(
    chalk.green("Foi depositado o valor de: R$" + amount + " na sua conta")
  );
}

function getAccount(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: "utf8",
    flag: "r",
  });
  return JSON.parse(accountJSON);
}

// Consultar saldo

function getAccountBalance() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      // Verificar se a conta existe:
      if (!checkAccount(accountName)) {
        return getAccountBalance();
      }

      const accountData = getAccount(accountName);
      console.log(
        chalk.bgBlue.black(
          `Olá, o saldo da suia conta pe de R$: ${accountData.balance}`
        )
      );

      operation();
    })
    .catch((err) => console.log(err));
}

// Sacar quantia da conta:
function  withdraw(){

inquirer.prompt([
    {
        name: "accountName",
        message: "Qual o nome da sua conta?"
    }
]).then((answer)=>{
    const accountName = answer["accountName"];

          // Verificar se a conta existe:
          if (!checkAccount(accountName)) {
            return withdraw();
          }

          
inquirer.prompt([
    {
        name: "amount",
        message: "Quanto você deseja sacar?"
    }
]).then((answer)=>{
    const amount = answer["amount"]
    removeAmount(accountName, amount)
}).catch((err)=>console.log(err))
}).catch((err) => console.log(err))

}

function removeAmount(accountName, amount){

    const accountData = getAccount(accountName)

    if(!amount){
        console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde"))
        return withdraw()
    }

    if(accountData.balance < amount){
        console.log(chalk.bgRed.black("Valor indisponivel"))
        return withdraw()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
          console.log(err);
        }
      );
      console.log(chalk.green(`Foi realizado um saque de R$${amount} da sua conta`))
      operation()
}