$(function () {
  $("#add-item-form").validate({
    rules: {
      titleInput: {
        required: true
      }
    }
  });

  $("#modal-edit-form").validate({
    rules: {
      modalTitle: {
        required: true
      }
    }
  });
});
