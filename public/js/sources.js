$(document).ready(function() {
  // Getting references to the name input and source container, as well as the table body
  var nameInput = $("#source-name");
  var sourceList = $("#source-tbody");
  var sourceContainer = $(".source-container");
  // Adding event listeners to the form to create a new object, and the button to delete
  // an source
  $(document).on("submit", "#source-form", handlesourceFormSubmit);
  $(document).on("click", ".delete-source", handleDeleteButtonPress);

  // Getting the initial list of sources
  getsources();

  // A function to handle what happens when the form is submitted to create a new source
  function handlesourceFormSubmit(event) {
    console.log("test");
    event.preventDefault();
    // Don't do anything if the name fields hasn't been filled out
    if (!nameInput.val().trim().trim()) {
      return;
    }
    // Calling the upsertsource function and passing in the value of the name input
    upsertsource({
      name: nameInput
        .val()
        .trim()
    });
  }

  // A function for creating an source. Calls getsources upon completion
  function upsertsource(sourceData) {
    $.post("/api/sources", sourceData)
      .then(getsources);
  }

  // Function for creating a new list row for sources
  function createsourceRow(sourceData) {
    var newTr = $("<tr>");
    newTr.data("source", sourceData);
    newTr.append("<td>" + sourceData.name + "</td>");
    if (sourceData.Transactions) {
      newTr.append("<td> " + sourceData.Transactions.length + "</td>");
    } else {
      newTr.append("<td>0</td>");
    }
    newTr.append("<td><a href='/home?source_id=" + sourceData.id + "'>Go to Transaction</a></td>");
    //<a class="nav-link" data-toggle="tab" href="#panel3" role="tab">
    //newTr.append("<td><a href='#panel3?source_id=" + sourceData.id + "' data-toggle='tab' role='tab'>Create a Transaction</a></td>");
    newTr.append("<td><a href='/transactions?source_id=" + sourceData.id + "'>Create a Transaction</a></td>");
    newTr.append("<td><a style='cursor:pointer;color:red' class='delete-source'>Delete source</a></td>");
    return newTr;
  }

  // Function for retrieving sources and getting them ready to be rendered to the page
  function getsources() {
    $.get("/api/sources", function(data) {
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createsourceRow(data[i]));
      }
      rendersourceList(rowsToAdd);
      nameInput.val("");
    });
  }

  // A function for rendering the list of sources to the page
  function rendersourceList(rows) {
    sourceList.children().not(":last").remove();
    sourceContainer.children(".alert").remove();
    if (rows.length) {
      console.log(rows);
      sourceList.prepend(rows);
    }
    else {
      renderEmpty();
    }
  }

  // Function for handling what to render when there are no sources
  function renderEmpty() {
    var alertDiv = $("<div>");
    alertDiv.addClass("alert alert-danger");
    alertDiv.text("You must create an source before you can create a Post.");
    sourceContainer.append(alertDiv);
  }

  // Function for handling what happens when the delete button is pressed
  function handleDeleteButtonPress() {
    var listItemData = $(this).parent("td").parent("tr").data("source");
    var id = listItemData.id;
    $.ajax({
      method: "DELETE",
      url: "/api/sources/" + id
    })
      .then(getsources);
  }
});
