const dashboard = document.querySelector(".dash-main");
const transactionMenu = document.querySelector(".transaction-main");
const dashTab = document.querySelector("#dash-tab");
const transactionTab = document.querySelector("#transaction-tab");
const menuAmount = document.getElementById("add-amount");
const menuCategory = document.getElementById("add-category");
const menuType = document.getElementById("add-type");

const addBtn = document.querySelector(".transaction-main .head .filters .add");
const addMenu = document.querySelector(".transaction-main .add-transaction");
const saveBtn = document.querySelector(".save-btn");
const cancelBtn = document.querySelector(".cancel-btn");
const balanceAmount = document.querySelector(".balance .amount");
const creditAmount = document.querySelector(".credit .amount");
const expenseAmount = document.querySelector(".expense .amount");
const removeBtn = document.querySelector(".remove");
const checkbox = document.querySelector("#transaction-checked");

dashTab.addEventListener("click", () => {
  transactionMenu.classList.add("hidden");
  dashboard.classList.remove("hidden");
});

transactionTab.addEventListener("click", () => {
  transactionMenu.classList.remove("hidden");
  dashboard.classList.add("hidden");
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
    this.check = false;
    transactionRow.addEventListener("click", this.editTransaction.bind(this));
    addBtn.addEventListener("click", this.addTransaction);
    removeBtn.addEventListener("click", this.removeTransaction);
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
            id="check-${this.id}"
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
    transactionRow.insertAdjacentHTML("beforeend", html);

    const checkbox = document.getElementById(`check-${this.id}`);
    checkbox.addEventListener("change", (event) => {
      this.check = event.target.checked;
    });

    this.calcAndDisplayAmounts();
  }

  editTransaction(e) {
    const id = e.target.closest("tr").dataset.id;
    addMenu.classList.remove("hidden");

    const target = transactions.find((res) => res.id == id);
    menuAmount.value = target.amount;
    menuCategory.value = target.category;
    menuType.value = target.type;

    saveBtn.addEventListener("click", () => {
      addMenu.classList.add("hidden");
      if (
        menuAmount.value !== "" ||
        menuCategory.value !== "" ||
        menuType.value !== ""
      ) {
        target.amount = menuAmount.value;
        target.type = menuType.value;
        target.category = menuCategory.value;
      }
    });
    cancelBtn.addEventListener("click", () => {
      addMenu.classList.add("hidden");
      menuAmount.value = menuCategory.value = menuType.value = "";
    });
  }

  addTransaction() {
    addMenu.classList.toggle("hidden");
    menuAmount.value = menuCategory.value = menuType.value = "";
    saveBtn.addEventListener("click", () => {
      addMenu.classList.add("hidden");
      const t = new Transaction(
        menuAmount.value,
        menuCategory.value,
        menuType.value
      );
      if (t.amount !== "" && t.category !== "" && t.type !== "") {
        transactions.push(t);
        t.renderTransaction();
      }
      menuAmount.value = menuCategory.value = menuType.value = "";
    });
    cancelBtn.addEventListener("click", () => {
      addMenu.classList.add("hidden");
      menuAmount.value = menuCategory.value = menuType.value = "";
    });
  }

  calcAndDisplayAmounts() {
    let credit = 0,
      expense = 0,
      balance = 0;
    transactions.forEach((res) =>
      res.type === "credit"
        ? (credit += Number(res.amount))
        : (expense += Number(res.amount))
    );
    balance = credit - expense;
    balanceAmount.textContent = balance.toFixed(2);
    creditAmount.textContent = credit.toFixed(2);
    expenseAmount.textContent = expense.toFixed(2);
  }

  removeTransaction() {
    addMenu.classList.add("hidden");
    let c = 0;
    transactions = transactions.filter((res) => res.check === false);
    transactionRow.innerHTML = "";

    transactions.forEach((res) => {
      res.renderTransaction();
    });

    if (transactions.length === 0) {
      balanceAmount.textContent = 0.00;
      creditAmount.textContent = 0.00;
      expenseAmount.textContent = 0.00;
    }
  }
}

const t1 = new Transaction(170, "food", "credit");
transactions.push(t1);
for (let i = 0; i < 100000000; i++);
const t2 = new Transaction(145, "clothes", "expense");
transactions.push(t2);
for (let i = 0; i < 100000000; i++);
const t3 = new Transaction(256, "clothes", "credit");
transactions.push(t3);
for (let i = 0; i < 100000000; i++);
const t4 = new Transaction(15, "clothes", "expense");
transactions.push(t4);

transactions.forEach((res) => {
  res.renderTransaction();
});
