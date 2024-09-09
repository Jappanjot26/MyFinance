const dashboard = document.querySelector(".dash-main");
const transactionMenu = document.querySelector(".transaction-main");
const dashTab = document.querySelector("#dash-tab");
const transactionTab = document.querySelector("#transaction-tab");

const addBtn = document.querySelector(".transaction-main .head .filters .add");
const addMenu = document.querySelector(".transaction-main .add-transaction");
const saveBtn = document.querySelector(".save-btn");
const cancelBtn = document.querySelector(".cancel-btn");

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

class Transaction {
  constructor(amount, category, type) {
    let now = new Date();
    this.date = this.formatDate(now);
    this.id = now.getTime();
    this.amount = amount;
    this.category = category;
    this.type = type;
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
    const transactionRow = document.querySelector(".transactions table tbody");
    console.log(transactionRow);

    const html = `
    <tr>
        <td>
          <input
            type="checkbox"
            name="transaction"
            value="${this.id}"
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
  }

  editTransaction() {
    addMenu.classList.remove("hidden");
    const menuAmount = document.getElementById("add-amount");
    const menuCategory = document.getElementById("add-category");
    const menuType = document.getElementById("add-type");

    menuAmount.value = this.amount;
    menuCategory.value = this.category;
    menuType.value = this.type;
  }
}

const t1 = new Transaction(140, "food", "credit");
t1.renderTransaction();
const t2 = new Transaction(145, "clothes", "expense");
t2.renderTransaction();

const t3 = new Transaction(1500, "clothes", "expense");
t3.renderTransaction();

t3.editTransaction();
