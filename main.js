"use strict";

const newTransactionBtn = document.querySelector("#newTransactionBtn");
const showBudgetForm = document.querySelector("#showBudget");

const budgetForm = document.querySelector("#budgetForm");
const budgetInput = document.querySelector("#budgetInput");
// const submitBudget = document.querySelector("#submitBudget");

const budgetEl = document.querySelector("#budgetEl");
const remainingBudgetEl = document.querySelector("#remainingEl");
const expensesEl = document.querySelector("#expensesEl");

// Expense modal
const expenseModal = document.querySelector("#modal");
const expenseForm = document.querySelector("#expenseForm");
const amountExpense = document.querySelector("#amountExpense");
const expenseTitle = document.querySelector("#expenseTitle");
// const submitExpense = document.querySelector("#submit");

const transactionsSection = document.querySelector("#transactions");
const transactionList = document.querySelector("#transactionList");
// const expenseItem__header = document.querySelector("#expenseItem__header");

const delBtn = document.querySelector("#delBtn");
const editBtn = document.querySelector("#editBtn");

// data - ui state
let budget, remainingBudget, expense, expenseList;

// init
function init() {
	budget = parseFloat(localStorage.getItem("budget")) || 0.00;
	expenseList = JSON.parse(localStorage.getItem("expenseList")) || [];

	expense = expenseList.length
		? expenseList.reduce((acc, curr) => acc + curr.amount, 0)
		: 0.00;

	remainingBudget = (budget - expense).toFixed(2);

	updateUI();

	hasBudget();
	hasTransactionList();

	displayExpenses();
}
init();

//! HANDLERS
function handleBudgetForm(e) {
	e.preventDefault();

	budget = (budget + parseFloat(budgetInput.value)).toFixed(2);
	remainingBudget = (budget - expense).toFixed(2);

	updateUI();

	localStorage.setItem("budget", budget);

	budgetInput.value = "";
	budgetForm.classList.remove("isEditingBudget");
	hasBudget();
}
function handleExpenseForm(e) {
	e.preventDefault();
	const amount = parseFloat(amountExpense.value).toFixed(2);
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
		alert("Your're close exceeding your budget");
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
	displayExpenses();
}

// EVENT LISTENERS
showBudgetForm.addEventListener("click", () => {
	budgetForm.classList.toggle("isEditingBudget");
	budgetInput.focus();
});

budgetForm.addEventListener("submit", handleBudgetForm);

expenseForm.addEventListener("submit", handleExpenseForm);

newTransactionBtn.addEventListener("click", () => {
	expenseModal.classList.toggle("isOpen");
	amountExpense.focus();
});

expenseModal.addEventListener("click", (e) => {
	const modal = e.target.closest("#modal");

	if (e.target === modal) {
		expenseModal.classList.remove("isOpen");
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
});

// !EDIT_TRANSACTION
transactionList.addEventListener("click", (e) => {
	const editBtn = e.target.closest("#editBtn");
	if (!editBtn) return;

	const id = editBtn.dataset.id;

	const transactionArr = expenseList.filter(
		(transaction) => transaction.id === id
	);
	const transaction = transactionArr[0];

	const { amount, category, title } = transaction;

	expenseModal.classList.toggle("isOpen");
	expenseForm.dataset.type = "edit";
	expenseForm.dataset.editId = id;

	amountExpense.value = amount;
	expenseTitle.value = title;

	const buttons = document.querySelectorAll("input[name='category']");
	buttons.forEach((btn) => {
		if (btn.value === category) btn.checked = true;
	});
});

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
                    <span>${title}</span>
                  </p>
                  <p>
                    <span class="cardTitleHeader">Amount:</span>
                    <span>N${amount.toFixed(2)}</span>
                  </p>
                  <p>
                    <span class="cardTitleHeader">Category:</span>
                    <span>${category}</span>
                  </p>
  
                  <p>
                    <span class="cardTitleHeader">Date:</span>
                    <span>${date}</span>
                  </p>
                  <section class="btns">
  
                    <button id="editBtn" data-id=${id}>edit</button>
  
                    <button id="delBtn" data-id=${id}>del</button>
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
		: null;
}

function resetExpenseForm() {
	amountExpense.value = "";
	expenseTitle.value = "";
	expenseForm.dataset.type = "";
	resetCategory();
	expenseModal.classList.remove("isOpen");
}