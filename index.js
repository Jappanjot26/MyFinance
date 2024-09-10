const dashboard = document.querySelector(".dash-main");
const transactionMenu = document.querySelector(".transaction-main");
const dashTab = document.querySelector("#dash-tab");
const transactionTab = document.querySelector("#transaction-tab");

const addBtn = document.querySelector(".transaction-main .head .filters .add");
const addMenu = document.querySelector(".transaction-main .add-transaction");
const saveBtn = document.querySelector(".save-btn");
const cancelBtn = document.querySelector(".cancel-btn");
const balanceAmount = document.querySelector(".balance .amount");
const creditAmount = document.querySelector(".credit .amount");
const expenseAmount = document.querySelector(".expense .amount");

addBtn.addEventListener("click", () => {
  addMenu.classList.toggle("hidden");
});

dashTab.addEventListener("click", () => {
  transactionMenu.classList.add("hidden");
  dashboard.classList.remove("hidden");
});

transactionTab.addEventListener("click", () => {
  transactionMenu.classList.remove("hidden");
  dashboard.classList.add("hidden");
});

saveBtn.addEventListener("click", () => {
  // saveTransaction();
  addMenu.classList.add("hidden");
});

cancelBtn.addEventListener("click", () => {
  addMenu.classList.add("hidden");
});

const transactionRow = document.querySelector(".transactions table tbody");

let transactions = [];
class Transaction {
  constructor(amount, category, type) {
    let now = new Date();
    this.date = this.formatDate(now);
    this.id = now.getTime();
    this.amount = amount;
    this.category = category;
    this.type = type;
    transactionRow.addEventListener("click", this.editTransaction.bind(this));
  }

  formatDate(anyDate) {
    let date = anyDate.getDate();
    let month = anyDate.getMonth() + 1;
    const year = anyDate.getFullYear();

    date = date < 10 ? `0${date}` : date;
    month = month < 10 ? `0${month}` : month;

    return `${date}/${month}/${year}`;
  }

  renderTransaction() {
    const html = `        
    <tr data-id="${this.id}">
        <td>
          <input
            type="checkbox"
            name="transaction"
          />
        </td>
        <td>${this.date}</td>
        <td>${this.id}</td>
        <td>₹ ${this.amount}</td>
        <td>${this.category[0].toUpperCase() + this.category.slice(1)}</td>
        <td><span class="status-Credit">${
          this.type[0].toUpperCase() + this.type.slice(1)
        }
          </span></td>
    </tr>
    `;
    transactions.push(this);
    transactionRow.insertAdjacentHTML("beforeend", html);
    this.calcAndDisplayAmounts();
  }

  editTransaction(e) {
    const id = e.target.closest("tr").dataset.id;
    addMenu.classList.remove("hidden");

    const transaction = transactions.find((res) => res.id == id);

    const menuAmount = document.getElementById("add-amount");
    const menuCategory = document.getElementById("add-category");
    const menuType = document.getElementById("add-type");

    menuAmount.value = transaction.amount;
    menuCategory.value = transaction.category;
    menuType.value = transaction.type;
  }

  calcAndDisplayAmounts() {
    let credit = 0,
      expense = 0,
      balance = 0;
    transactions.forEach((res) =>
      res.type === "credit" ? (credit += res.amount) : (expense += res.amount)
    );
    balance = credit - expense;
    balanceAmount.textContent = balance;
    creditAmount.textContent = credit;
    expenseAmount.textContent = expense;
  }
}

const t1 = new Transaction(170, "food", "credit");
t1.renderTransaction();
for (let i = 0; i < 100; i++) console.log("HELLO");
const t2 = new Transaction(145, "clothes", "expense");
t2.renderTransaction();
