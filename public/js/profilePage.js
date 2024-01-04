$(document).ready(() => {
  loadPosts();
});

function loadPosts() {
  $.get(
    "/api/posts",
    { postedBy: profileUserId, isReply: selectedTabs === "replies" },
    (results) => {
      outputPost(results, $(".postsContainer"));
    }
  );
}

$(document).on("click", ".followButtonContainer", (event) => {
  const button = $(event.currentTarget).find("button");
  isFollowing = !isFollowing;

  $.ajax({
    url: `/api/posts/${profileUserId}/follow`,
    method: "POST",
    data: { isFollowing: isFollowing },
    success: (response) => {
      if (response.success) {
        const buttonText = isFollowing ? "Following" : "Follow";
        const buttonClass = isFollowing
          ? "followButton following"
          : "followButton";
        button.text(buttonText);
        button.attr("class", buttonClass);

        const followerCountElement = $(".followers .value");
        const currentFollowerCount = parseInt(followerCountElement.text());
        const updatedFollowerCount = isFollowing
          ? currentFollowerCount + 1
          : currentFollowerCount - 1;
        followerCountElement.text(updatedFollowerCount);
      } else {
        alert("error");
      }
    },
    error: (error) => {
      alert(error.message);
    },
  });
});

$(document).on("click", ".userImageConrainer", (event) => {});
