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
          html += '<a href="/product/' + data[i]._id + '">"';
          html += '<div class="img-container">';
          html += '<img src="' + data[i]._source.image + '">';
          html += '<div class="caption" style="padding: 1rem;">';
          html += "<h3>" + data[i]._source.name + "</h3>";
          html += "<h3>$" + data[i]._source.price + "</h3>";
          html += "</div>";
          html += "</div>";
          html += "</a>";

          $("#search-results").append(html);
          console.log(data[i]._source._id);
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

// payment stripe
var Stripe = Stripe(
  "pk_test_51H50w7LOJkrpYleY0MoAuhjv15an8TZ2gZYUqENwfMtfWe7GNvGvn07qNZWL6mcud2EhcjlLTxTwL3IiiIvUpHAV00CcdLRJKz"
);
function stripeResponseHandler(status, response) {
  console.log("object");
  let $form = $("#payment-form");
  if (response.error) {
    //show error on the form
    $form.find(".payment-errors").text(response.error.message);
    $form.find("button").prop("disabled", false);
  } else {
    let token = response.id;
    $form.append($('<input type="hidden" name="stripeToken" />')).val(token);

    $form.get(0).submit();
  }
}

$("#payment-form").submit(function (event) {
  console.log(".....hello");
  let $form = $(this);
  $form.find("button").prop("disabled", true);
  Stripe.card.createToken($form, stripeResponseHandler);
  return false;
});
