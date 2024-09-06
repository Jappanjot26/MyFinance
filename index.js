const dashboard = document.querySelector(".dash-main");
const transactionMenu = document.querySelector(".transaction-main");
const dashTab = document.querySelector("#dash-tab");
const transactionTab = document.querySelector("#transaction-tab");

const addBtn = document.querySelector(".transaction-main .head .filters .add");
const addMenu = document.querySelector(".transaction-main .add-transaction");

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

class Transaction {
  #date = new Date();
  constructor(amount, category, type) {
    this.date = this.formatDate();
    this.id = this.#date.getTime();
    this.amount = amount;
    this.category = category;
    this.type = type;
    console.log(this.date, this.id, this.amount, this.category, this.type);
  }

  formatDate() {
    let date = this.#date.getDate();
    let month = this.#date.getMonth() + 1;
    const year = this.#date.getFullYear();

    date = date < 10 ? `0${date}` : date;
    month = month < 10 ? `0${month}` : month;

    return `${date}/${month}/${year}`;
  }

}

const t1 = new Transaction(140, "food", "credit");
