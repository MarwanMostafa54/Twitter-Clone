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

  $.post("/api/posts", data, (postData) => {
    var html = createpost(postData);
    var submitButton = $("#postButton");
    $(".postsContainer").prepend(html);
    textbox.val("");
    submitButton.prop("disabled", true);
  });
});

function createpost(postData) {
  const user = postData.postedBy;
  var timestamps = postData.createdAt;
  const postHTML = `
  <div class="post">
  <div class="mainContentContainer">
        <div class="userImageConatiner">
          <img src="${user.profilePic}">
          </div>
          <div class="postContentContainer">  
          <div class="header">        
          <a href="/profile/${user.username}" class="displayName">${user.firstName} ${user.lastName}</a>
          <span class="username">@${user.username}</span>
          <span class="date"> ${timestamps}</span>
         </div>
        <div class="postBody">
          <span>${postData.content}</span>
        </div>
        <div class="postFooter">
            <div class = "postbuttonContainer">
                <button>
                <i class="fa-solid fa-comments"></i>
                </button>
            </div>
            <div class = "postbuttonContainer">
                <button>
                <i class="fa-solid fa-retweet"></i>              
                </button>
            </div>
            <div class = "postbuttonContainer">
                <button>
                <i class="fa-solid fa-heart"></i>
                </button>
            </div>
        </div>
        </div>
        </div>
        </div>
    `;
  return postHTML;
}
