//$(document).ready(function() {
  // Getting jQuery references to the transaction description, amount, form, and source select

$('a[data-toggle="tab"]').on('shown.bs.tab', function() {

  var descriptionInput = $("#description");
  var amountInput = $("#amount");
  var dateInput = $("#datepicker");
  var transactionForm = $("#transaction");
  var sourceSelect = $("#source");
  // Adding an event listener for when the form is submitted
  $(transactionForm).on("submit", handleFormSubmit);
  // Gets the part of the url that comes after the "?" (which we have if we're updating a transaction)
  var url = window.location.search;
  var transactionId;
  var sourceId;
  // Sets a flag for whether or not we're updating a transaction to be false initially
  var updating = false;

  // If we have this section in our url, we pull out the transaction id from the url
  // In '?transaction_id=1', transactionId is 1
  if (url.indexOf("?transaction_id=") !== -1) {
    transactionId = url.split("=")[1];
    gettransactionData(transactionId, "transaction");
  }
  // Otherwise if we have an source_id in our url, preset the source select box to be our Source
  else if (url.indexOf("?source_id=") !== -1) {
    sourceId = url.split("=")[1];
  }

  // Getting the Sources, and their transactions
  getSourcesT();

  // A function for handling what happens when the form to create a new transaction is submitted
  function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the transaction if we are missing a description, amount, or source
    if (!amountInput.val().trim() || !descriptionInput.val().trim() || !sourceSelect.val()) {
      return;
    }
    // Constructing a newtransaction object to hand to the database
    var newtransaction = {
      amount: amountInput
        .val()
        .trim(),
      description: descriptionInput
        .val()
        .trim(),
      date: dateInput
        .val(),
        //.trim(),
      SourceId: sourceSelect.val()
    };

    // If we're updating a transaction run updatetransaction to update a transaction
    // Otherwise run submittransaction to create a whole new transaction
    if (updating) {
      newtransaction.id = transactionId;
      updatetransaction(newtransaction);
    }
    else {
      submittransaction(newtransaction);
    }
  }

  // Submits a new transaction and brings user to home page upon completion
  function submittransaction(transaction) {
    $.post("/api/transactions", transaction, function() {
      window.location.href = "/home";
    });
  }

  // Gets transaction data for the current transaction if we're editing, or if we're adding to an source's existing transactions
  function gettransactionData(id, type) {
    console.log(id);
    // console.log("test");
    var queryUrl;
    switch (type) {
    case "transaction":
      queryUrl = "/api/transactions/" + id;
      break;
    case "source":
      queryUrl = "/api/sources/" + id;
      break;
    default:
      return;
    }
    $.get(queryUrl, function(data) {
      console.log(data.sourceId);
      if (data) {
        // console.log(data.sourceId || data.id);
        // If this transaction exists, prefill our Transactions forms with its data
        amountInput.val(data.amount);
        descriptionInput.val(data.description);
        dateInput.val(data.date);
        sourceId = data.sourceId || data.id;
        // If we have a transaction with this id, set a flag for us to know to update the transaction
        // when we hit submit
        updating = true;
      }
    });
  }

  // A function to get Sources and then render our list of Sources
  function getSourcesT() {
    $.get("/api/sources", renderSourceListT);
  }
  // Function to either render a list of Sources, or if there are none, direct the user to the page
  // to create an source first
  function renderSourceListT(data) {
    if (!data.length) {
      window.location.href = "/sources";
    }
    $(".hidden").removeClass("hidden");
    var rowsToAdd = [];
    for (var i = 0; i < data.length; i++) {
      rowsToAdd.push(createSourceRowT(data[i]));
    }
    sourceSelect.empty();
    // console.log(rowsToAdd);
    // console.log(sourceSelect);
    sourceSelect.append(rowsToAdd);
    sourceSelect.val(sourceId);
  }

  // Creates the source options in the dropdown
  function createSourceRowT(source) {
    var listOption = $("<option>");
    listOption.attr("value", source.id);
    listOption.text(source.name);
    return listOption;
  }

  // Update a given transaction, bring user to the home page when done
  function updatetransaction(transaction) {
    $.ajax({
      method: "PUT",
      url: "/api/transactions",
      data: transaction
    })
      .then(function() {
        window.location.href = "/home";
      });
  }
	
});
