# Programmify - Personal Budget Tracker solution (ExpenseEase)

This is a solution to the Programmify PIP3 Insternship week-one project

## Project Timeline:
- Start Date: Friday, July 19, 2024
- Finish Date: Friday, July 26, 2024


## Description:

Develop a Budget Tracker application that allows users to manage their finances by adding, editing, and deleting income and expenses. This project will strengthen your understanding of vanilla JavaScript, as well as HTML and CSS for building and styling the user interface. This project will be a simple one to get you started, not using any JavaScript frameworks.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [how to set it up](#how-to-set-it-up)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)

## Overview

The Budget Tracker project(ExpenseEase) aims to enhance your skills in front-end web development using HTML, CSS, and JavaScript. This project will help you understand how to create interactive web applications, manipulate the DOM (Document Object Model), and manage state without any libraries or frameworks.

### The challenge

Users should be able to:

- Add Transaction: Users can add a new transaction by entering a description and amount. The transaction will be added to the list and the totals will be updated.

- Delete Transaction: Each transaction in the list will have a delete button. Clicking this button will remove the transaction from the list and update the totals.

- Edit Transaction: Users can edit an existing transaction. This will involve allowing users to change the description or amount of a transaction.

- Calculate Totals: The application will automatically calculate and display the total income, total expenses, and balance based on the transactions.

### Screenshot

![](./screenshot.jpg)

### Links

- Solution URL: [GitHub Repo](https://github.com/alfredthompsonOvie/expenseEase)
- Live Site URL: [Add live site URL here](https://your-live-site-url.com)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- [Vite](https://vite.org/) 
- [TailwindCSS](https://tailwindcss.com/) - For styles

### how to set it up
After cloning this project or downloading the zip file, run the following command

```bash
npm install
```

To start the project:
```bash
npm run dev
```

open a new terminal and run the following command:
```bash
npx tailwindcss -i ./style.css -o ./src/output.css --watch
```


### What I learned

Use this section to recap over some of your major learnings while working through this project. Writing these out and providing code samples of areas you want to highlight is a great way to reinforce your own knowledge.


```js
	const totalAmount =
		expenseForm.dataset.type === "edit"
			? amount +
			  (expense -
					expenseList.filter(
						(transaction) => transaction.id === expenseForm.dataset.editId
					)[0].amount)
			: amount + expense;
```

### Continued development

while i'm very comfortable working with vanilla css i want to be as good with tailwindCSS as i am with vanilla css.


### Useful resources

- [TailwindCSS](https://www.example.com) - This helped me with tailwindCSS's documentation


## Author

- Website - [Alfred Thompson Ovie](https://www.your-site.com)
- GitHub - [@yourusername](https://www.frontendmentor.io/profile/yourusername)
- LinkedIn - [@yourusername](https://www.twitter.com/yourusername)



