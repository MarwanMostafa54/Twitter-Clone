$("#postTextarea").keyup((event) => {
  var textbox = $(event.target);
  var value = textbox.val().trim();
  var submitButton = $("#postButton");
  if (submitButton.length == 0) {
    return alert("no submit button identified!");
  }
  if (value == "") {
    submitButton.prop("disabled", true);
  } else {
    submitButton.prop("disabled", false);
  }
});

$("#postButton").click((event) => {
  var button = $(event.target);
  var textbox = $("#postTextarea");
  var data = {
    content: textbox.val(),
  };

  $.post("/api/posts", data, (postData, status, xhr) => {
    alert(postData)
  });
});
