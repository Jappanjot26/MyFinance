const dashboard = document.querySelector(".dash-main");
const transactionMenu = document.querySelector(".transaction-main");
const dashTab = document.querySelector("#dash-tab");
const transactionTab = document.querySelector("#transaction-tab");
const menuAmount = document.getElementById("add-amount");
const menuCategory = document.getElementById("add-category");
const menuType = document.getElementById("add-type");
const editAmount = document.getElementById("edit-amount");
const editCategory = document.getElementById("edit-category");
const editType = document.getElementById("edit-type");

const addBtn = document.querySelector(".transaction-main .head .filters .add");
const addMenu = document.querySelector(".transaction-main .add-transaction");
const editMenu = document.querySelector(".transaction-main .edit-transaction");
const saveBtnAdd = document.querySelector(".add-transaction .btns .save-btn");
const cancelBtnAdd = document.querySelector(
  ".add-transaction .btns .cancel-btn"
);
const saveBtnEdit = document.querySelector(".edit-transaction .btns .save-btn");
const cancelBtnEdit = document.querySelector(
  ".edit-transaction .btns .cancel-btn"
);
const balanceAmount = document.querySelector(".balance .amount");
const creditAmount = document.querySelector(".credit .amount");
const expenseAmount = document.querySelector(".expense .amount");
const removeBtn = document.querySelector(".remove");
const checkbox = document.querySelector("#transaction-checked");
let saveEdit;
let cancelEdit;

dashTab.addEventListener("click", () => {
  transactionMenu.classList.add("hidden");
  dashboard.classList.remove("hidden");
});

transactionTab.addEventListener("click", () => {
  transactionMenu.classList.remove("hidden");
  dashboard.classList.add("hidden");
});

const transactionRow = document.querySelector(".transactions table tbody");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

class Transaction {
  constructor(amount, category, type, id = null) {
    let now = new Date();
    this.date = this.formatDate(now);
    this.id = id || now.getTime();
    this.amount = amount;
    this.category = category;
    this.type = type;
    this.check = false;
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
    this.updateGraphs();
  }

  editTransaction(id) {
    addMenu.classList.add("hidden");
    editMenu.classList.remove("hidden");

    let target = transactions.find((res) => res.id == id);
    editAmount.value = target.amount;
    editCategory.value = target.category;
    editType.value = target.type;

    saveBtnEdit.removeEventListener("click", saveEdit);
    cancelBtnEdit.removeEventListener("click", cancelEdit);

    saveEdit = () => {
      if (
        editAmount.value !== "" &&
        editCategory.value !== "" &&
        editType.value !== ""
      ) {
        target.amount = editAmount.value;
        target.type = editType.value;
        target.category = editCategory.value;
      }
      transactionRow.innerHTML = "";

      transactions.forEach((res) => {
        res.renderTransaction();
      });
      editMenu.classList.add("hidden");
      this.updateLocalStorage();
      this.updateGraphs();
    };

    cancelEdit = () => {
      editMenu.classList.add("hidden");
      editAmount.value = editCategory.value = editType.value = "";
    };

    saveBtnEdit.addEventListener("click", saveEdit);
    cancelBtnEdit.addEventListener("click", cancelEdit);
  }

  addTransaction() {
    editMenu.classList.add("hidden");
    addMenu.classList.toggle("hidden");
    menuAmount.value = menuCategory.value = menuType.value = "";

    saveBtnAdd.addEventListener("click", () => {
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
      addMenu.classList.add("hidden");
      this.updateLocalStorage();
      this.updateGraphs();
    });

    cancelBtnAdd.addEventListener("click", () => {
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
    editMenu.classList.add("hidden");
    transactions = transactions.filter((res) => res.check === false);
    transactionRow.innerHTML = "";

    transactions.forEach((res) => {
      res.renderTransaction();
    });

    if (transactions.length === 0) {
      balanceAmount.textContent = 0.0;
      creditAmount.textContent = 0.0;
      expenseAmount.textContent = 0.0;
    }
    this.updateLocalStorage();
    this.updateGraphs();
  }

  getWeeklyExpenses() {
    const today = new Date();
    const weekStart = today.getDate() - today.getDay();
    const weeklyExpenses = Array(7).fill(0);

    const startOfWeek = new Date(
      today.setFullYear(today.getFullYear(), today.getMonth(), weekStart)
    );
    const endOfWeek = new Date(
      today.setFullYear(today.getFullYear(), today.getMonth(), weekStart + 7)
    );

    transactions.forEach((trans) => {
      if (trans.type === "expense") {
        const [day, month, year] = trans.date.split("/").map(Number);
        const transDate = new Date(year, month - 1, day);

        if (transDate >= startOfWeek && transDate < endOfWeek) {
          const dayIndex = transDate.getDay();
          weeklyExpenses[dayIndex] += Number(trans.amount);
        }
      }
    });

    return weeklyExpenses;
  }

  getCategoryExpenses() {
    const categories = ["grocery", "travel", "rent", "gromming", "others"];
    const categoryExpenses = Array(categories.length).fill(0);

    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));

    transactions.forEach((trans) => {
      if (trans.type === "expense") {
        const [day, month, year] = trans.date.split("/").map(Number);
        const transDate = new Date(year, month - 1, day);

        if (transDate >= weekStart) {
          const categoryIndex = categories.indexOf(trans.category);
          if (categoryIndex !== -1) {
            categoryExpenses[categoryIndex] += Number(trans.amount);
          }
        }
      }
    });

    return categoryExpenses;
  }

  updateGraphs() {
    const barData = [
      {
        x: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        y: this.getWeeklyExpenses(),
        type: "bar",
        marker: {
          color: "#26B2EC",
        },
      },
    ];

    const pieData = [
      {
        values: this.getCategoryExpenses(),
        labels: ["Grocery", "Travel", "Rent", "Gromming", "Others"],
        type: "pie",
        textinfo: "percent",
        insidetextorientation: "radial",
        marker: {
          colors: ["#FF6384", "#36A2EB", "#FFCE56"],
        },
        textfont: {
          size: 8,
        },
      },
    ];

    const layout = {
      margin: { t: 50, l: 35, r: 0, b: 20 },
      responsive: true,
    };

    Plotly.react("barGraph", barData, layout);
    Plotly.react("pieChart", pieData, layout);
  }

  updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }
}

transactions = transactions.map(
  (t) => new Transaction(t.amount, t.category, t.type, t.id)
);

transactions.forEach((res) => {
  res.renderTransaction();
});

const initialBarData = [
  {
    x: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    y: transactions.length ? transactions[0].getWeeklyExpenses() : [],
    type: "bar",
    marker: {
      color: "#26B2EC",
    },
  },
];

const initialPieData = [
  {
    values: transactions.length ? transactions[0].getCategoryExpenses() : [],
    labels: ["Grocery", "Travel", "Rent", "Gromming", "Others"],
    type: "pie",
    textinfo: "percent",
    insidetextorientation: "radial",
    marker: {
      colors: ["#FF6384", "#36A2EB", "#FFCE56"],
    },
    textfont: {
      size: 8,
    },
  },
];

const layout = {
  margin: { t: 50, l: 35, r: 0, b: 20 },
  responsive: true,
};

Plotly.newPlot("barGraph", initialBarData, layout);
Plotly.newPlot("pieChart", initialPieData, layout);

window.onresize = function () {
  Plotly.Plots.resize("barGraph");
  Plotly.Plots.resize("pieChart");
};

addBtn.addEventListener("click", () => {
  const t = new Transaction();
  t.addTransaction();
});

transactionRow.addEventListener("click", (e) => {
  const id = e.target.closest("tr").dataset.id;
  if (id) {
    const t = new Transaction();
    t.editTransaction(id);
  }
});

removeBtn.addEventListener("click", () => {
  const t = new Transaction();
  t.removeTransaction();
});

const mobileNav = document.querySelector("#mobile-nav-logo");

mobileNav.addEventListener("change", () => {
  if (mobileNav.value === "transactions") {
    transactionMenu.classList.remove("hidden");
    dashboard.classList.add("hidden");
  } else {
    transactionMenu.classList.add("hidden");
    dashboard.classList.remove("hidden");
  }
});
