"use strict";

const newTransactionBtn = document.querySelector("#newTransactionBtn");
const showBudgetForm = document.querySelector("#showBudget");

const budgetFormContainer = document.querySelector("#budgetFormContainer");
const budgetContainer = document.querySelector("#budgetContainer");
const budgetForm = document.querySelector("#budgetForm");
const budgetInput = document.querySelector("#budgetInput");
// const submitBudget = document.querySelector("#submitBudget");

const budgetEl = document.querySelector("#budgetEl");
const remainingBudgetEl = document.querySelector("#remainingEl");
const expensesEl = document.querySelector("#expensesEl");

// Expense modal
const expenseModal = document.querySelector("#modal");
const overlay = document.querySelector("#overlay");

const expenseForm = document.querySelector("#expenseForm");
const amountExpense = document.querySelector("#amountExpense");
const expenseTitle = document.querySelector("#expenseTitle");

const transactionsSection = document.querySelector("#transactions");
const transactionList = document.querySelector("#transactionList");
// const expenseItem__header = document.querySelector("#expenseItem__header");

const delBtn = document.querySelector("#delBtn");
const editBtn = document.querySelector("#editBtn");

const app = document.querySelector("#app");

// data - ui state
let budget, remainingBudget, expense, expenseList;

// init
function init() {
	budget = parseFloat(localStorage.getItem("budget")) || 0;
	expenseList = JSON.parse(localStorage.getItem("expenseList")) || [];

	expense = expenseList.length
		? expenseList.reduce((acc, curr) => acc + curr.amount, 0)
		: 0;

	remainingBudget = budget - expense;

	updateUI();

	hasBudget();
	hasTransactionList();

	displayExpenses();
}
init();

//! HANDLERS
function handleBudgetForm(e) {
	e.preventDefault();

	const amount = parseFloat(budgetInput.value);

	if (!amount) {
		budgetFormContainer.classList.remove("isEditingBudget");
		return;
	}

	budget = budget + amount;
	remainingBudget = budget - expense;

	updateUI();

	localStorage.setItem("budget", budget);

	budgetInput.value = "";
	budgetFormContainer.classList.remove("isEditingBudget");
	hasBudget();
}
function handleExpenseForm(e) {
	e.preventDefault();
	const amount = parseFloat(amountExpense.value);
	const title = expenseTitle.value;
	const category = getSelectedCategory();

	if (!amount || !title || !category) {
		alert("Please fill all fields");
		return;
	}

	// check if your about to edit an existing transaction or it'a a new transaction
	const totalAmount =
		expenseForm.dataset.type === "edit"
			? amount +
			  (expense -
					expenseList.filter(
						(transaction) => transaction.id === expenseForm.dataset.editId
					)[0].amount)
			: amount + expense;

	if (totalAmount === budget) {
		alert("Your're about to exhaust your budget");
	}

	if (totalAmount > budget) {
		alert("That's over your budget, increase budget to continue");
		resetExpenseForm();
		return;
	}

	if (expenseForm.dataset.type === "edit") {
		const id = expenseForm.dataset.editId;

		expenseList = expenseList.map((transaction) => {
			if (transaction.id === id) {
				const transactionEdited = {
					...transaction,
					title,
					category,
					amount: parseFloat(amount),
				};

				return transactionEdited;
			}
			return transaction;
		});

		displayExpenses();
		updateFinances();
		localStorage.setItem("expenseList", JSON.stringify(expenseList));

		resetExpenseForm();
		return;
	}

	const expenseObj = {
		title,
		amount: parseFloat(amount),
		category,
		date: new Date().toLocaleDateString("en-GB"),
		id: crypto.randomUUID(),
	};

	expenseList = [...expenseList, expenseObj];
	localStorage.setItem("expenseList", JSON.stringify(expenseList));

	// update ui state
	updateFinances();

	//Reset input fields
	amountExpense.value = "";
	expenseTitle.value = "";
	resetCategory();
	expenseModal.classList.remove("isOpen");
	overlay.classList.remove("isOpen");
	displayExpenses();
}

// EVENT LISTENERS
showBudgetForm.addEventListener("click", () => {
	budgetFormContainer.classList.add("isEditingBudget");
	budgetInput.focus();
});

budgetForm.addEventListener("submit", handleBudgetForm);

expenseForm.addEventListener("submit", handleExpenseForm);

newTransactionBtn.addEventListener("click", () => {
	expenseModal.classList.toggle("isOpen");
	overlay.classList.toggle("isOpen");
	amountExpense.focus();
});

expenseModal.addEventListener("click", (e) => {
	const modal = e.target.closest("#modal");

	if (e.target === modal) {
		resetExpenseForm();
		

	}
});
overlay.addEventListener("click", () => {
	resetExpenseForm();
});
budgetFormContainer.addEventListener("click", (e) => {
	const modal = e.target.closest("#budgetContainer");

	if (e.target === modal) {
		budgetFormContainer.classList.remove("isEditingBudget");
	}
});

// !DELETE_TRANSACTION
transactionList.addEventListener("click", (e) => {
	const delBtn = e.target.closest("#delBtn");

	if (!delBtn) return;

	const id = delBtn.dataset.id;

	expenseList = expenseList.filter((transaction) => transaction.id !== id);

	displayExpenses();
	updateFinances();

	localStorage.setItem("expenseList", JSON.stringify(expenseList));
});

// !EDIT_TRANSACTION
transactionList.addEventListener("click", (e) => {
	const editBtn = e.target.closest("#editBtn");
	if (!editBtn) return;

	const id = editBtn.dataset.id;

	const transaction = expenseList.filter(
		(transaction) => transaction.id === id
	)[0];

	const { amount, category, title } = transaction;

	expenseModal.classList.toggle("isOpen");
	overlay.classList.toggle("isOpen");
	expenseForm.dataset.type = "edit";
	expenseForm.dataset.editId = id;

	amountExpense.value = amount;
	expenseTitle.value = title;

	const buttons = document.querySelectorAll("input[name='category']");
	buttons.forEach((btn) => {
		if (btn.value === category) btn.checked = true;
	});
});

// app.addEventListener("click", (e) => {
// 	const target = e.target.querySelector("#budgetForm")
// 	const isOpen = budgetForm.classList.contains("isEditingBudget");
// 	// if (isOpen) {
// 	// 	budgetForm.classList.remove("isEditingBudget");

// 	// 	console.log("budgetForm")
// 	// }
// 	console.log(target)
// })

// utils functions
function updateUI() {
	budgetEl.textContent = budget;
	remainingBudgetEl.textContent = remainingBudget;
	expensesEl.textContent = expense;
}

function getSelectedCategory() {
	const selectedCategory = document.querySelector(
		"input[name='category']:checked"
	);

	if (selectedCategory) {
		return selectedCategory.value;
	}

	return null;
}

function resetCategory() {
	const buttons = document.querySelectorAll("input[name='category']");
	buttons.forEach((btn) => {
		btn.checked = false;
	});
}

function displayExpenses() {
	hasTransactionList();
	transactionList.innerHTML = "";
	expenseList.forEach((expense) => {
		const { amount, category, date, id, title } = expense;

		const markup = `<li class="expenseItem" id="expenseItem">
                  <p>
                    <span class="cardTitleHeader">Title:</span>
                    <span class="capitalize">${title}</span>
                  </p>
                  <p class="flex">
                    <span class="cardTitleHeader">Amount:</span>
										<img src="./images/naira.svg" alt="currency" class="icon" />
                    <span>${amount}</span>
                  </p>
                  <p>
                    <span class="cardTitleHeader">Category:</span>
                    <span class="capitalize">${category}</span>
                  </p>
  
                  <p>
                    <span class="cardTitleHeader">Date:</span>
                    <span>${date}</span>
                  </p>
                  <section class="edit_del_btns_container">
  
                    <button id="editBtn" class="editBtn" data-id=${id}>
											<img src="./images/edit.svg" alt="currency" class="icon" />
										</button>
  
                    <button id="delBtn" class="delBtn" data-id=${id}>
											<img src="./images/delete1.svg" alt="currency" class="icon__del" />
										</button>
                  </section>
                </li>`;

		transactionList.insertAdjacentHTML("afterbegin", markup);
	});
}

function updateFinances() {
	expense = expenseList.reduce((acc, curr) => acc + curr.amount, 0);
	remainingBudget = budget - expense;

	updateUI();
}

function hasBudget() {
	budget !== 0 ? newTransactionBtn.classList.add("hasBudget") : null;
}

function hasTransactionList() {
	expenseList.length > 0
		? transactionsSection.classList.add("hasMadeTransaction")
		: transactionsSection.classList.remove("hasMadeTransaction");
}

function resetExpenseForm() {
	amountExpense.value = "";
	expenseTitle.value = "";
	expenseForm.dataset.type = "";
	resetCategory();
	expenseModal.classList.remove("isOpen");
	overlay.classList.remove("isOpen");
}
