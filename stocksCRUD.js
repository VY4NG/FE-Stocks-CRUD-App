/*
Coding Steps:
    - Create a full CRUD application of your choice using an API or JSON Server. --> COMPLETE
    - Use JQuery/AJAX to interact with the API. --> COMPLETE
    - Use a form to post new entities. --> COMPLETE
    - Build a way for users to update or delete entities. --> COMPLETE
    - Include a way to get entities from the API. --> COMPLETE
    - Use Bootstrap and CSS to style your project. --> COMPLETE

Recommended API:
    - MockAPI - This is one of the most popular APIs with our mentors! 
        - Get more tips on CRUD with MockAPI!
    - You are free to use an API of your choosing; however, it must support all CRUD operations.
    - Refer to the Week 12 Lab for how to use db.json/json-server
*/

// Define API endpoint to interact with MockAPI.
const urlEndpointStocks = "https://66858386b3f57b06dd4d0089.mockapi.io/crud/app/tests/api/stocks";

// READ - Fetch the stocks, get entities from the API.
// Function to fetch all stocks from MockAPI.
function fetchStocks() {
    $.ajax({
        url: urlEndpointStocks,
        method: 'GET',
        success: function(data) {
            displayStocks(data);
        },
        error: function(xhr, status, error) {
            console.error('Error fetching stocks:', error);
        }
    });
}

// Function to display stocks in the table created in the index.html file.
function displayStocks(stocks) {
    let tableBody = $('#list tbody');
    tableBody.empty(); // Clear existing rows in the table body.

    stocks.forEach(stock => {
        let row = `<tr>
            <td>${stock.id}</td>
            <td>${stock.company}</td>
            <td>${stock.ticker}</td>
            <td>${stock.priceBuy}</td>
            <td>${stock.sharesBuy}</td>
            <td>${stock.costBasis}</td>
            <td>${formatDate(stock.dateAdded)}</td>
            <td>${stock.priceSell}</td>
            <td>${stock.sharesSell}</td>
            <td>${stock.priceCurrent}</td>
            <td>${stock.unrealizedProfitLoss}</td>
            <td>${stock.realizedProfitLoss}</td>
            <td><button class="btn btn-danger btn-sm" onclick="deleteStock('${stock.id}')">Delete</button></td>
        </tr>`; // Delete button created so we can delete a stock when needed.
        tableBody.append(row);  // Adds a new row to the end of the collection in the table body.
    });
}

// Function to format date as mm/dd/yyyy to be consistent with the forms format.
function formatDate(dateString) {
    if (!dateString) return "";
    let date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;    // Months are zero indexed.
}

// Fetch stocks on page load to complete the READ part of CRUD.
$(document).ready(function() {
    fetchStocks();
});

// CREATE - Adding stocks from the form to the table.
// Function to add a new stock.
function addStock(company, ticker, priceBuy, sharesBuy, costBasis, dateAdded, priceSell, sharesSell, priceCurrent, unrealizedProfitLoss, realizedProfitLoss) {
    const newStock = {
        company: company,
        ticker: ticker,
        priceBuy: priceBuy,
        sharesBuy: sharesBuy,
        costBasis: costBasis,
        dateAdded: dateAdded,
        priceSell: priceSell,
        sharesSell: sharesSell,
        priceCurrent: priceCurrent,
        unrealizedProfitLoss: unrealizedProfitLoss,
        realizedProfitLoss: realizedProfitLoss
    };


    $.ajax({
        url: urlEndpointStocks,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(newStock),
        success: function(data) {
            fetchStocks(); // Refresh table after successful addition.
        },
        error: function(xhr, status, error) {
            console.error('Error adding stock:', error);
        }
    });
};

// Event listener for the Add button to successfully add a new stock.
$('#add').click(function(event) {
    event.preventDefault();

    const company = $('#new-company').val();
    const ticker = $('#new-ticker').val();
    const priceBuy = $('#new-price-buy').val();
    const sharesBuy = $('#shares-buy').val();
    const costBasis = $('#cost-basis').val();
    const dateAdded = $('#date-added').val();
    const priceSell = $('#new-price-sell').val();
    const sharesSell = $('#shares-sell').val();
    const priceCurrent = $('#new-price-current').val();
    const unrealizedProfitLoss = $('#unrealized-profit-loss').val();
    const realizedProfitLoss = $('#realized-profit-loss').val();

    addStock(company, ticker, priceBuy, sharesBuy, costBasis, dateAdded, priceSell, sharesSell, priceCurrent, unrealizedProfitLoss, realizedProfitLoss);

    // Clear input fields after adding a new stock.
    $('form')[0].reset();
});

// UPDATE - Event listener to update stocks that has already populated in the table by stockId.
// This can change or update all fields, so you can change the stock itself per the stockId.
// Function to fetch stock details for update.
$('#update').click(function (event) {
    event.preventDefault();
    const id = $('#stockId').val();
    const updatedStock = {
        company: $('#update-company').val(),
        ticker: $('#update-ticker').val(),
        priceBuy: $('#update-price-buy').val(),
        sharesBuy: $('#update-shares-buy').val(),
        costBasis: $('#update-cost-basis').val(),
        dateAdded: $('#update-date-added').val(),
        priceSell: $('#update-price-sell').val(),
        sharesSell: $('#update-shares-sell').val(),
        priceCurrent: $('#update-price-current').val(),
        unrealizedProfitLoss: $('#update-unrealized-profit-loss').val(),
        realizedProfitLoss: $('#update-realized-profit-loss').val()
    };

    $.ajax({
        url: `${urlEndpointStocks}/${id}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(updatedStock),
        success: function(data) {
            fetchStocks(); // Refresh table after successful update.

            // Clear the form fields after a successful update on an existing stock.
            $('#stockId').val('');
            $('#update-company').val('');
            $('#update-ticker').val('');
            $('#update-price-buy').val('');
            $('#update-shares-buy').val('');
            $('#update-cost-basis').val('');
            $('#update-date-added').val('');
            $('#update-price-sell').val('');
            $('#update-shares-sell').val('');
            $('#update-price-current').val('');
            $('#update-unrealized-profit-loss').val('');
            $('#update-realized-profit-loss').val('');
        },
        error: function(xhr, status, error) {
            console.error('Error updating stock:', error);
        }
    });
});

// DELETE - Delete an existing stock from the table.
// Function to delete a stock.
function deleteStock(id) {
    if (confirm("Are you sure you want to delete this stock?")) {
        $.ajax({
            url: `${urlEndpointStocks}/${id}`,
            method: 'DELETE',
            success: function(data) {
                fetchStocks(); // Refresh table after successful deletion.
            },
            error: function(xhr, status, error) {
                console.error('Error deleting stock:', error);
            }
        });
    }
}