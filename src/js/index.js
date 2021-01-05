// #region HTTP methonds
function deleteItem(event) {
  let itemRow = $(event.target).closest("tr");
  let itemId = itemRow.attr("id");

  $.ajax({
    url: "http://localhost:51425/api/items/" + itemId,
    type: "DELETE",
    success: function () {
      itemRow.remove();
    },
    error: showError,
  });

  event.preventDefault();
}

function postItem(item) {
  $.ajax({
    url: "http://localhost:51425/api/items",
    type: "POST",
    data: JSON.stringify(item),
    contentType: "application/json",
    success: refreshTable,
    error: showError,
  });
}

function putItem(item) {
  $.ajax({
    url: "http://localhost:51425/api/items",
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify(item),
    success: refreshTable,
    error: showError,
  });
}

function getItems() {
  let status = $("#status-select").val();
  $.ajax({
    url: "http://localhost:51425/api/items/" + status,
    type: "GET",
    dataType: "json",
    success: setTable,
    error: showError,
  });
}

function getItemById(itemId) {
  $.ajax({
    url: "http://localhost:51425/api/items/" + itemId,
    type: "GET",
    dataType: "json",
    success: populateModal,
    error: showError,
  });
}

function putChangeState(item) {
  $.ajax({
    url: "http://localhost:51425/api/items/changestate",
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify(item),
    success: refreshTable,
    error: showError,
  });
}
// #endregion

// #region Modal
function setDetailsModal(event) {
  let itemRow = $(event.relatedTarget).closest("tr");
  let itemId = itemRow.attr("id");

  getItemById(itemId);
}

function populateModal(item) {
  $("#modal-id-input").val(item.id);
  $("#modal-title-input").val(item.title);
  $("#modal-description-text").val(item.description);
  $("#modal-done-checkbox").attr("checked", item.isDone);
}

function updateItem(event) {
  event.preventDefault();   

  if($("#modal-edit-form").valid()){
    let item = {
      id: $("#modal-id-input").val(),
      title: $("#modal-title-input").val(),
      description: $("#modal-description-text").val(),
      isDone: document.getElementById("modal-done-checkbox").checked,
    };

    putItem(item);
    $("#detailsModal").modal("toggle");
  }
    
  
}
// #endregion

// #region Table Setup
function setTable(items) {
  var todoTable = $("#todo-table");
  for (var i in items) {
    createTableRow(todoTable, items[i]);
  }
}

function createTableRow(todoTable, item) {
  if (item.description.length > 60) {
    item.description = `${item.description.slice(0, 60)}...`;
  }

  let todoRow = document.createElement("tr");
  todoRow.setAttribute("id", item.id);
  todoRow.append(createDoneCheckbox(item.isDone));
  todoRow.append(createTableData(item.title, "title"));
  todoRow.append(createTableData(item.description, "description"));
  todoRow.append(createButtons());

  todoTable.append(todoRow);
}

function createButtons() {
  let buttonsCell = document.createElement("td");
  buttonsCell.classList.add("text-right");

  let detailsAnchor = document.createElement("a");
  detailsAnchor.setAttribute("data-target", "#detailsModal");
  detailsAnchor.setAttribute("data-toggle", "modal");
  detailsAnchor.setAttribute("title", "Details");
  detailsAnchor.classList.add("text-warning", "p-2");
  detailsAnchor.innerHTML =
    '<i class="fa fa-pencil-square-o" aria-hidden="true"></i>';

  let deleteAnchor = document.createElement("a");
  deleteAnchor.classList.add("delete-item-btn", "text-danger", "p-2");
  deleteAnchor.setAttribute("title", "Delete");
  deleteAnchor.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true"></i>';

  buttonsCell.append(detailsAnchor);
  buttonsCell.append(deleteAnchor);
  return buttonsCell;
}

function createTableData(content) {
  let td = document.createElement("td");
  td.innerHTML = content;
  return td;
}

function createDoneCheckbox(isDone) {
  let checkboxCell = document.createElement("td");

  let isDoneCheckbox = document.createElement("input");
  isDoneCheckbox.type = "checkbox";
  isDoneCheckbox.checked = isDone;
  isDoneCheckbox.classList.add("done-checkbox");

  checkboxCell.append(isDoneCheckbox);
  return checkboxCell;
}

function refreshTable() {
  $("#todo-table").html("");
  getItems();
}
// #endregion

function addItem(event) {
  event.preventDefault();

  if($("#add-item-form").valid()){
    let item = {
      title: $("#title-input").val(),
      description: $("#description-input").val(),
    };

    postItem(item);
    clearInputFields();
  }
}

function clearInputFields() {
  $("#title-input").val("");
  $("#description-input").val("");
}

function showError() {
  console.log("Error!");
}

function changeState(event) {
  let itemRow = $(event.target).closest("tr");

  let item = {
    id: itemRow.attr("id"),
    isDone: $(event.target).is(":checked"),
  };
  putChangeState(item);
}

function init() {
  getItems();

  $("#add-item-form").on("submit", addItem);

  $("#todo-table").on("click", ".delete-item-btn", deleteItem);

  $(document).on("change", ".done-checkbox", changeState);
  $(document).on("change", "#status-select", refreshTable);

  $("#detailsModal").on("show.bs.modal", setDetailsModal);
  $("#modal-update-btn").on("click", updateItem);
}

$(document).ready(init);
