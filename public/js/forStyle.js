let mainCircle = document.querySelector("#circle");
let mainNav = document.querySelector(".nav-one");
let secondNav = document.querySelector(".allIcons");
let mainBody = document.querySelector("#main-body");
let leftArrow = document.querySelector("#moveRight");
let click = 0;
mainCircle.addEventListener("click", () => {
  click += 1;
  mainCircle.style.animation = "none";
  mainNav.classList.toggle("nav-one-2");
  mainCircle.classList.toggle("circle-transform");
  leftArrow.classList.toggle("arrow-transform");
  secondNav.classList.toggle("allIcons-2");

  if (click % 2 !== 0) {
    mainBody.style.filter = "blur(3px)";
    mainBody.style.pointerEvents = "none";
  } else {
    mainBody.style.filter = "none";
    mainBody.style.pointerEvents = "all";
    mainCircle.style.animation = "pulse 2s infinite";
  }
});
// PDF
var doc = new jsPDF();
var specialElementHandlers = {
  "#editor": function (element, renderer) {
    return true;
  },
};

$("#download").click(function () {
  doc.fromHTML($("#pdf").html(), 15, 15, {
    width: 170,
  });
  doc.save("sample-file.pdf");
});
