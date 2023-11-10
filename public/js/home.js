$(document).ready(() => {
  $.get("/api/posts", (results) => {
    outputPost(results, $(".postsContainer"));
  });
});

function outputPost(results, container) {
  if (results.length == 0) {
    container.append("<span>Nothing to show</span>");
  }
  container.html("");
  results.forEach((result) => {
    var html = createpost(result);
    container.prepend(html);
  });
}
