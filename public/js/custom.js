// search
$(function () {
  $("#search").keyup(function () {
    let search_term = $(this).val();

    $.ajax({
      method: "POST",
      url: "/api/search",
      dataType: "json",
      data: { search_term },
      success: function (json) {
        let data = json.hits.hits.map(function (hit) {
          return hit;
        });
        console.log(data);
        $("#search-results").empty();
        for (let i = 0; i < data.length; i++) {
          let html = "";
          html += '<div class="categories-individual">';
          html += '<a href="/product/' + data[i]._source._id + '">"';
          html += '<div class="img-container">';
          html += '<img src="' + data[i]._source.image + '">';
          html += '<div class="caption" style="padding: 1rem;">';
          html += "<h3>" + data[i]._source.name + "</h3>";
          html += "<h3>" + data[i]._source.category.name + "</h3>";
          html += "<h3>$" + data[i]._source.price + "</h3>";
          html += "</div>";
          html += "</div>";
          html += "</a>";

          $("#search-results").append(html);
          console.log(data[i]._source.category.name, data[i]._source.price);
        }
      },
      error: function (err) {
        console.log(err);
      },
    });
  });
});
//cart

$(document).on("click", "#plus", function (e) {
  e.preventDefault();
  let pricevalue = parseFloat($("#priceValue").val());
  let quantity = parseInt($("#quantity").val());
  pricevalue += parseFloat($("#priceHidden").val());
  quantity += 1;
  $("#quantity").val(quantity);
  $("#priceValue").val(pricevalue.toFixed(2));
  $("#total").html(quantity);
});
$(document).on("click", "#minus", function (e) {
  e.preventDefault();
  let pricevalue = parseFloat($("#priceValue").val());
  let quantity = parseInt($("#quantity").val());
  if (quantity === 1) {
    pricevalue = $("#priceHidden").val();
    quantity = 1;
  } else {
    pricevalue -= parseFloat($("#priceHidden").val());
    quantity -= 1;
  }

  $("#quantity").val(quantity);
  $("#priceValue").val(pricevalue.toFixed(2));
  $("#total").html(quantity);
});
