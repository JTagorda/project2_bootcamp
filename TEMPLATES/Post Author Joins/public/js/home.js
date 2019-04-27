$(document).ready(function() {
  /* global moment */

  // homecontainer holds all of our transactions
  var homecontainer = $(".home-container");
  // var TransactionCategorySelect = $("#category");
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
  function getTransactions(Source) {
    sourceId = Source || "";
    if (sourceId) {
      sourceId = "/?source_id=" + sourceId;
    }
    $.get("/api/transactions" + sourceId, function(data) {
      console.log("Transactions", data);
      transactions = data;
      if (!transactions || !transactions.length) {
        displayEmpty(Source);
      }
      else {
        initializeRows();
      }
    });
  }

  // This function does an API call to delete transactions
  // function deleteTransaction(id) {
  //   $.ajax({
  //     method: "DELETE",
  //     url: "/api/transactions/" + id
  //   })
  //     .then(function() {
  //       getTransactions(TransactionCategorySelect.val());
  //     });
  // }

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
    var newTransactionTitle = $("<h2>");
    var newTransactionDate = $("<small>");
    var newTransactionSource = $("<h5>");
    newTransactionSource.text("Written by: " + transaction.Source.name);
    newTransactionSource.css({
      float: "right",
      color: "blue",
      "margin-top":
      "-10px"
    });
    var newTransactionCardBody = $("<div>");
    newTransactionCardBody.addClass("card-body");
    var newTransactionBody = $("<p>");
    newTransactionTitle.text(transaction.title + " ");
    newTransactionBody.text(transaction.body);
    newTransactionDate.text(formattedDate);
    newTransactionTitle.append(newTransactionDate);
    newTransactionCardHeading.append(deleteBtn);
    newTransactionCardHeading.append(editBtn);
    newTransactionCardHeading.append(newTransactionTitle);
    newTransactionCardHeading.append(newTransactionSource);
    newTransactionCardBody.append(newTransactionBody);
    newTransactionCard.append(newTransactionCardHeading);
    newTransactionCard.append(newTransactionCardBody);
    newTransactionCard.data("transaction", transaction);
    return newTransactionCard;
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
    window.location.href = "/cms?Transaction_id=" + currentTransaction.id;
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
    messageH2.html("No transactions yet" + partial + ", navigate <a href='/cms" + query +
    "'>here</a> in order to get started.");
    homecontainer.append(messageH2);
  }

});
