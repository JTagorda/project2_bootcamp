$(document).ready(function() {
  /* global moment */

  // homecontainer holds all of our transactions
  var homecontainer = $(".home-container");
  var TransactionCategorySelect = $("#category");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.delete", handleTransactionDelete);
  $(document).on("click", "button.edit", handleTransactionEdit);
  // Variable to hold our transactions
  var transactions;

  // The code below handles the case where we want to get transactions for a specific source
  // Looks for a query param in the url for source_id
  var url = window.location.search;
  // var SourceId;
  var sourceId;
  if (url.indexOf("?source_id=") !== -1) {
    sourceId = url.split("=")[1];
    getTransactions(sourceId);
  }
  // If there's no sourceId we just get all transactions as usual
  else {
    getTransactions();
  }


  // This function grabs transactions from the database and updates the view
  function getTransactions(source) {
    sourceId = source || "";
    if (sourceId) {
      sourceId = "/?source_id=" + sourceId;
    }
    $.get("/api/transactions" + sourceId, function(data) {
      // console.log("transactions", data);
      transactions = data;
      if (!transactions || !transactions.length) {
        displayEmpty(source);
      }
      else {
        initializeRows();
      }
    });
  }

  // This function does an API call to delete transactions
  function deleteTransaction(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/transactions/" + id
    })
      .then(function() {
        getTransactions(TransactionCategorySelect.val());
      });
  }

  // InitializeRows handles appending all of our constructed transaction HTML inside homecontainer
  function initializeRows() {
    homecontainer.empty();
    var transactionsToAdd = [];
    for (var i = 0; i < transactions.length; i++) {
      transactionsToAdd.push(createNewRow(transactions[i]));
    }
    homecontainer.append(transactionsToAdd);
  }

  // This function constructs a transaction's HTML
/*
  function createNewRow(transaction) {
    var formattedDate = new Date(transaction.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    var newTransactionCard = $("<div>");
    newTransactionCard.addClass("card");
    var newTransactionCardHeading = $("<div>");
    newTransactionCardHeading.addClass("card-header");
    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-info");
    var newTransactionDescription = $("<h2>");
    var newTransactionDate = $("<small>");
    var newTransactionSource = $("<h5>");
    newTransactionSource.text("Source: " + transaction.Source.name);
    newTransactionSource.css({
      float: "right",
      color: "blue",
      "margin-top":
      "-10px"
    });
    var newTransactionCardBody = $("<div>");
    newTransactionCardBody.addClass("card-body");
    var newTransactionBody = $("<p>");
    newTransactionDescription.text(transaction.description + " ");
    newTransactionBody.text(transaction.amount);
    newTransactionDate.text(formattedDate);
    newTransactionDescription.append(newTransactionDate);
    newTransactionCardHeading.append(deleteBtn);
    newTransactionCardHeading.append(editBtn);
    newTransactionCardHeading.append(newTransactionDescription);
    newTransactionCardHeading.append(newTransactionSource);
    newTransactionCardBody.append(newTransactionBody);
    newTransactionCard.append(newTransactionCardHeading);
    newTransactionCard.append(newTransactionCardBody);
    newTransactionCard.data("transaction", transaction);
    return newTransactionCard;
  }
*/
  function createNewRow(transaction) {
    var formattedDate = new Date(transaction.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    var newTransactionTable = $("<tr>");
    //newTransactionCard.addClass("card");
    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-info");
    
	var newTransactionDate = $("<td>");
    var newTransactionSource = $("<td>");
    var newTransactionDescription = $("<td>");
    var newTransactionAmount = $("<td>");
    var newTransactionEdit = $("<td>");
    var newTransactionDelete = $("<td>");
	  
    newTransactionDate.text(formattedDate);
	newTransactionSource.text(transaction.Source.name);
    newTransactionDescription.text(transaction.description + " ");
    newTransactionAmount.text(transaction.amount);
    //newTransactionEdit.text(editBtn);
    //newTransactionDelete.text(deleteBtn);
	  
    newTransactionTable.append(newTransactionDate);
    newTransactionTable.append(newTransactionSource);
    newTransactionTable.append(newTransactionDescription);
    newTransactionTable.append(newTransactionAmount);
    newTransactionTable.append(deleteBtn);
    newTransactionTable.append(editBtn);
	  
    newTransactionTable.data("transaction", transaction);
	  
    return newTransactionTable;
  }

  // This function figures out which transaction we want to delete and then calls deleteTransaction
  function handleTransactionDelete() {
    var currentTransaction = $(this)
      .parent()
      .parent()
      .data("transaction");
    deleteTransaction(currentTransaction.id);
  }

  // This function figures out which transaction we want to edit and takes it to the appropriate url
  function handleTransactionEdit() {
    var currentTransaction = $(this)
      .parent()
      .parent()
      .data("transaction");
    window.location.href = "/transactions?transaction_id=" + currentTransaction.id;
  }

  // This function displays a message when there are no transactions
  function displayEmpty(id) {
    var query = window.location.search;
    var partial = "";
    if (id) {
      partial = " for Source #" + id;
    }
    homecontainer.empty();
    var messageH2 = $("<h2>");
    messageH2.css({ "text-align": "center", "margin-top": "50px" });
    messageH2.html("No transactions yet" + partial + ", navigate <a href='/transactions" + query +
    "'>here</a> in order to get started.");
    homecontainer.append(messageH2);
  }

});
