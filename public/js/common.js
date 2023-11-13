$("#postTextarea, #replyTextarea").keyup((event) => {
  var textbox = $(event.target);
  var value = textbox.val().trim();
  var isModal = textbox.closest(".modal").length === 1;
  var submitButton = isModal ? $("#submitButtonReply") : $("#postButton");
  if (submitButton.length == 0) {
    return alert("no submit button identified!");
  }
  if (value == "") {
    submitButton.prop("disabled", true);
  } else {
    submitButton.prop("disabled", false);
  }
});

$("#postButton,#submitButtonReply").click((event) => {
  var button = $(event.target);
  var isModal = button.closest(".modal").length === 1;
  var textbox = isModal ? $("#replyTextarea") : $("#postTextarea");
  var data = {
    content: textbox.val(),
  };
  if (isModal) {
    var id = button.data("id");
    if (id === null) return alert("no button id");
    data.replyTo = id;
  }
  $.post("/api/posts", data, (postData) => {
    if (postData.replyTo) {
      location.reload();
    } else {
      var html = createpost(postData);
      var submitButton = $("#postButton");
      $(".postsContainer").prepend(html);
      textbox.val("");
      submitButton.prop("disabled", true);
    }
  });
});

$(document).on("click", ".likeButton", (event) => {
  var button = $(event.target);
  postId = getPostId(button);
  if (postId === undefined) {
    return;
  }
  $.ajax({
    url: `/api/posts/${postId}/like`,
    type: "PUT",
    success: (postData) => {
      button.find("span").text(postData.likes.length || "");
      if (postData.likes.includes(userLoggedIn._id)) {
        button.addClass("active");
      } else {
        button.removeClass("active");
      }
    },
  });
});
$(document).on("click", ".retweet", (event) => {
  var button = $(event.target);
  postId = getPostId(button);
  if (postId === undefined) {
    return;
  }
  $.ajax({
    url: `/api/posts/${postId}/retweet`,
    type: "POST",
    success: (postData) => {
      button.find("span").text(postData.retweetUsers.length || "");
      if (postData.retweetUsers.includes(userLoggedIn._id)) {
        button.addClass("active");
      } else {
        button.removeClass("active");
      }
    },
  });
});
$(document).on("click", ".post", (event) => {
  var element = $(event.target);
  postId = getPostId(element);
  if (postId !== undefined && !element.is("button")) {
    window.location.href = `/post/${postId}`;
  }
});
function getPostId(element) {
  var isRoot = element.hasClass("post");
  var rootElement = isRoot ? element : element.closest(".post");
  var postId = rootElement.data().id;
  if (postId === undefined) {
    return alert("postid");
  }
  return postId;
}
$("#replyModal").on("show.bs.modal", (event) => {
  var button = $(event.relatedTarget);
  postId = getPostId(button);
  $("#submitButtonReply").attr("data-id", postId);

  $.get(`/api/posts/${postId}`, (results) => {
    outputPost(results.postData, $("#originalPostContainer"));
  });
});
$("#replyModal").on("hidden.bs.modal", (event) => {
  $("#originalPostContainer").html("");
});
function createpost(postData) {
  if (postData === null) return alert("data is null");
  var isRetweeet = postData.retweetData !== undefined;
  var retweetedBy = isRetweeet ? postData.postedBy.username : null;
  postData = isRetweeet ? postData.retweetData : postData;
  const user = postData.postedBy;
  var timestamp = timeDifference(new Date(), new Date(postData.createdAt));
  var likeButtonActiveClass = postData.likes.includes(userLoggedIn._id)
    ? "active"
    : "";
  var retweetButtonActiveClass = postData.retweetUsers.includes(
    userLoggedIn._id
  )
    ? "active"
    : "";
  var retweetText = "";
  if (isRetweeet) {
    retweetText = `
    <span>
    <i class="fa-solid fa-retweet"></i>
    Retweeted by <a href="/profile/${retweetedBy}">@${retweetedBy}</a>
    </span>`;
  }
  var replyText = "";
  if (postData.replyTo) {
    if (postData.replyTo._id && postData.replyTo.postedBy._id) {
      var replyToUser = postData.replyTo.postedBy.username;
      replyText = `
      <span class="replyText"> <!-- Add the "replyText" class here -->
        <i class="fa-solid fa-comments"></i>
        replied To <a href="/profile/${replyToUser}">@${replyToUser}</a>
      </span>`;
    }
  }
  const postHTML = `
  <div class="postActionContainer">${retweetText}</div>
  <div class="post" data-id="${postData._id}">
    <div class="mainContentContainer">
      <div class="userImageConatiner">
        <img src="${user.profilePic}" />
      </div>
      <div class="postContentContainer">
        <div class="header">
          <a href="/profile/${user.username}" class="displayName"
            >${user.firstName} ${user.lastName}</a
          >
          <span class="username">@${user.username}</span>
          <span class="date"> ${timestamp}</span>
        </div>
        ${replyText}
        <div class="postBody">
          <span>${postData.content}</span>
        </div>
        <div class="postFooter">
          <div class="postbuttonContainer">
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#replyModal">
              <i class="fa-solid fa-comments"></i>
            </button>
          </div>
  
          <div class="postbuttonContainer green">
            <button class="retweet ${retweetButtonActiveClass}">
              <i class="fa-solid fa-retweet"></i>
              <span>${postData.retweetUsers.length || ""}</span>
            </button>
          </div>
          <div class="postbuttonContainer red">
            <button class="likeButton ${likeButtonActiveClass}">
              <i class="fa-solid fa-heart"></i>
              <span>${postData.likes.length || ""}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;

  return postHTML;
}
function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    if (elapsed / 1000) return "just now";
    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return Math.round(elapsed / msPerYear) + " years ago";
  }
}
function outputPost(results, container) {
  container.html("");
  results.forEach((result) => {
    var html = createpost(result);
    container.prepend(html);
  });
}
function outputPostWithReplies(results, container) {
  container.html("");
  if (results.replyTo) {
    var replyToHtml = createpost(results.replyTo);
    container.append(replyToHtml);
  }
  var userPostHtml = createpost(results.postData);
  container.append(userPostHtml);
  results.replies.forEach((result) => {
    var html = createpost(result);
    container.append(html);
  });
}
