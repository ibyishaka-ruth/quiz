document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expenseForm");
    const expenseTableBody = document.getElementById("expenseTableBody");
    const filterCategory = document.getElementById("filterCategory");
    const startDate = document.getElementById("startDate");
    const endDate = document.getElementById("endDate");
    const applyFilters = document.getElementById("applyFilters");
    const resetFilters = document.getElementById("resetFilters");

    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    function updateTable(expensesToShow) {
        expenseTableBody.innerHTML = "";
        expensesToShow.forEach((expense, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${expense.description}</td>
                <td>${expense.amount}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button onclick="editExpense(${index})">Edit</button>
                    <button onclick="deleteExpense(${index})">Delete</button>
                </td>
            `;
            expenseTableBody.appendChild(row);
        });
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }

    expenseForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const description = document.getElementById("description").value;
        const amount = document.getElementById("amount").value;
        const category = document.getElementById("category").value;
        const date = document.getElementById("date").value;

        if (!description || !amount || !category || !date) return alert("Fill all fields!");
        if (new Date(date) > new Date()) return alert("Date cannot be in the future!");

        expenses.push({ description, amount, category, date });
        updateTable(expenses);
        expenseForm.reset();
    });

    window.deleteExpense = function(index) {
        expenses.splice(index, 1);
        updateTable(expenses);
    };

    window.editExpense = function(index) {
        const expense = expenses[index];
        document.getElementById("description").value = expense.description;
        document.getElementById("amount").value = expense.amount;
        document.getElementById("category").value = expense.category;
        document.getElementById("date").value = expense.date;

        expenses.splice(index, 1);
        updateTable(expenses);
    };

    applyFilters.addEventListener("click", function() {
        let filteredExpenses = expenses.filter(expense => 
            (!filterCategory.value || expense.category === filterCategory.value) &&
            (!startDate.value || new Date(expense.date) >= new Date(startDate.value)) &&
            (!endDate.value || new Date(expense.date) <= new Date(endDate.value))
        );
        updateTable(filteredExpenses);
    });

    resetFilters.addEventListener("click", function() {
        updateTable(expenses);
    });

    document.getElementById("date").max = new Date().toISOString().split("T")[0];
    updateTable(expenses);
});