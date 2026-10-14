/* ============================================================
   Virtual Dog Park - the interactive part

   There are only three jobs here:
     1. Greet the visitor depending on the time of day.
     2. Put a dog in the park when its button is clicked.
     3. Clear the park again.
   ============================================================ */

/* ---------- 1. Find the pieces of the page we need ---------- */

var parkStatus = document.getElementById("park-status");
var clearButton = document.getElementById("clear-button");
var takeButtons = document.querySelectorAll(".take-button");
var dogCards = document.querySelectorAll(".dog-card");

/* ---------- 2. Work out a greeting ---------- */

function buildGreeting() {
  var hour = new Date().getHours();   // the hour, from 0 to 23

  if (hour < 12) {
    return "Good morning! The park is open.";
  } else if (hour < 18) {
    return "Good afternoon! The park is open.";
  } else {
    return "Good evening! The park is open.";
  }
}

/* The message shown when no dog has been chosen yet. */
var quietMessage = buildGreeting() + " Take a dog for a walk.";

/* ---------- 3. Small helpers ---------- */

/* Remove the green highlight from every card. */
function clearSelection() {
  dogCards.forEach(function (card) {
    card.classList.remove("selected");
  });
}

/* Back to the quiet park. */
function showQuietPark() {
  clearSelection();
  parkStatus.textContent = quietMessage;
}

/* ---------- 4. React to clicks ---------- */

takeButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    var card = button.closest(".dog-card");   // the card this button sits in
    var breed = button.dataset.breed;         // reads data-breed="..."

    clearSelection();
    card.classList.add("selected");

    parkStatus.textContent = "The " + breed + " is out in the park right now.";
  });
});

clearButton.addEventListener("click", showQuietPark);

/* ---------- 5. Start the page in the quiet state ---------- */

showQuietPark();
