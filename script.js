"use strict";

// Data
const account1 = {
  owner: "Andrei Castro",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Geralt Rivia",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Isabella Roma",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Ayakaa Kmisato",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
//login
const btnLogin = document.querySelector(".btn-login");
const loginInput = document.querySelector(".usernames");
const userPin = document.querySelector(".password");
const greet = document.querySelector(".greetings");
//transfer
const transferName = document.querySelector(`.transfer__name`);
const transferAmount = document.querySelector(`.transfer__amount`);
const transferBtn = document.querySelector(`.btn-transfer`);

// delete
const deleteName = document.querySelector(`.delete__name`);
const deletePin = document.querySelector(`.delete__pass`);
const deleteBtn = document.querySelector(`.btn-delete`);

// sort

const sortBtn = document.querySelector(`.btn-sort`);

// Loan
const loanAmount = document.querySelector(`.loan__amount`);
const loanBtn = document.querySelector(`.btn-loan`);

const logins = document.querySelector(`.login`);
const containerApp = document.querySelector(".container");
const containerMovements = document.querySelector(".movements");

const labelBalance = document.querySelector(".balance");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");

// Creat User Names

const createUsername = function(accs) {
  accs.forEach(
    (acc) =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(` `)
        .map((name) => name[0])
        .join(``))
  );
};

createUsername(accounts);

/// Display

const displayMovements = function(movements, sort = false) {
  containerMovements.innerHTML = ``;
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? `deposit` : `withdrawal`;
    const html = `

         <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${i + 1} ${type}
          </div>
          <div class="movements__value">${mov}</div>
        </div>     
    `;

    containerMovements.insertAdjacentHTML(`afterbegin`, html);
  });
};

const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function(acc) {
  const income = acc.movements
    .filter((cur) => cur > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = income;

  const outcome = acc.movements
    .filter((cur) => cur < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = outcome;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = interest;
};

const updateUI = function(acc) {
  displayMovements(acc.movements);

  calcDisplayBalance(acc);

  calcDisplaySummary(acc);
};

// Event Handlers

let currentAccount;

btnLogin.addEventListener(`click`, function(e) {
  e.preventDefault();

  currentAccount = accounts.find((acc) => acc.username === loginInput.value);

  console.log(currentAccount);
  if (currentAccount?.pin === Number(userPin.value)) {
    greet.textContent = `Welcome back, ${currentAccount.owner.split(` `)[0]}`;

    anime({
      targets: `.login`,
      translateY: [0, -1000],
      easing: "easeOutExpo",
      duration: 1000,
      opacity: [1, 0],
    });

    logins.style.visibility = `hidden`;

    anime({
      targets: `.container`,
      easing: "easeOutExpo",
      duration: 500,
      delay: 3500,
      opacity: [0, 1],
    });

    containerApp.style.visibility = `visible`;

    anime({
      targets: `.greetings`,
      easing: "easeOutExpo",
      duration: 3000,
      delay: 100,
      opacity: [0, 1],
      complete: function() {
        greet.style.visibility = `hidden`;
      },
    });

    greet.style.visibility = `visible`;

    updateUI(currentAccount);
  }
});

// TRANSFTER

transferBtn.addEventListener(`click`, function(e) {
  e.preventDefault();

  const amount = Number(transferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === transferName.value
  );

  transferAmount.value = transferName.value = ``;

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});

loanBtn.addEventListener(`click`, function(e) {
  e.preventDefault();

  const loans = Number(loanAmount.value);

  if (loans > 0 && currentAccount.movements.some((mov) => mov >= loans * 0.1)) {
    currentAccount.movements.push(loans);

    updateUI(currentAccount);
  }

  loanAmount.value = ``;
});

deleteBtn.addEventListener(`click`, function(e) {
  e.preventDefault();
  if (
    deleteName.value === currentAccount.username &&
    Number(deletePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);

    accounts.splice(index, 1);

    deleteName.value = deletePin.value = ``;

    anime({
      targets: `.container`,
      easing: "easeOutExpo",
      duration: 750,
      opacity: [1, 0],
      complete: function() {
        containerApp.style.visibility = `hidden`;
      },
    });

    anime({
      targets: `.login`,
      easing: "easeOutExpo",
      duration: 2000,
      delay:1000,
      opacity: [0, 1],
      translateY: [0, 0],
      complete: function() {
        logins.style.visibility = `visible`;
      },
    });
  }
});

let sorted = false;
sortBtn.addEventListener(`click`, function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

///////// ANIMAION

anime({
  targets: `.login`,
  translateX: [1000, 0],
  easing: "easeOutExpo",
  duration: 3000,
  opacity: [0, 1],
});

anime({
  targets: `.login__heading`,
  translateY: [-1000, 0],
  easing: "easeOutExpo",
  duration: 3000,
  delay: 1500,
  opacity: [0, 1],
});

anime({
  targets: `.usernames`,
  translateY: [-1000, 0],
  easing: "easeOutExpo",
  duration: 3000,
  delay: 1500,
  opacity: [0, 1],
});

anime({
  targets: `.password`,
  translateY: [1000, 0],
  easing: "easeOutExpo",
  duration: 3000,
  delay: 1500,
  opacity: [0, 1],
});

anime({
  targets: `.btn-login`,
  translateY: [1000, 0],
  easing: "easeOutExpo",
  duration: 3000,
  delay: 1700,
  opacity: [0, 1],
});