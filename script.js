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


/* ============================================================
   MY VIRTUAL DOG
   A separate feature that lives beside the park code above.
   ============================================================ */

/* ---------- 6. Find the new pieces of the page ---------- */

var adoptForm = document.getElementById("adopt-form");
var breedChoice = document.getElementById("breed-choice");
var nameInput = document.getElementById("dog-name");
var adoptMessage = document.getElementById("adopt-message");
var dogPanel = document.getElementById("dog-panel");
var dogPhoto = document.getElementById("dog-photo");
var statName = document.getElementById("stat-name");
var statBreed = document.getElementById("stat-breed");
var statDay = document.getElementById("stat-day");
var statStage = document.getElementById("stat-stage");
var statHappiness = document.getElementById("stat-happiness");
var feedButton = document.getElementById("feed-button");
var playButton = document.getElementById("play-button");

/* Where each breed's picture lives. */
var DOG_IMAGES = {
  "Beagle": "assets/beagle.svg",
  "Golden Retriever": "assets/golden-retriever.svg",
  "Poodle": "assets/poodle.svg"
};

/* The adopted dog. It stays null until the visitor adopts one. */
var myDog = null;

/* ---------- 7. Turn the day number into a growth stage ---------- */

function getGrowthStage(day) {
  if (day <= 2) {
    return "Puppy";
  } else if (day <= 5) {
    return "Young Dog";
  } else {
    return "Adult";
  }
}

/* ---------- 8. Show a message under the form ---------- */

function showMessage(text, kind) {
  /* textContent puts words on the page as plain text, so a name typed
     as <b>Biscuit</b> is displayed exactly as typed, never as HTML. */
  adoptMessage.textContent = text;
  adoptMessage.className = "message " + kind;
}

/* ---------- 9. Fill in the dog panel from myDog ---------- */

function renderDog() {
  if (myDog === null) {
    dogPanel.hidden = true;
    return;
  }

  dogPanel.hidden = false;

  statName.textContent = myDog.name;          /* plain text, never innerHTML */
  statBreed.textContent = myDog.breed;
  statDay.textContent = myDog.day;
  statStage.textContent = getGrowthStage(myDog.day);
  statHappiness.textContent = myDog.happiness + " / 100";

  dogPhoto.setAttribute("src", DOG_IMAGES[myDog.breed]);
  dogPhoto.setAttribute("alt", "Illustration of a " + myDog.breed + ".");
}

/* ---------- 10. Feed or play: +10 happiness, never above 100 ---------- */

function addHappiness(points) {
  if (myDog === null) {
    return;
  }

  /* Math.min returns the smaller of the two numbers, so the total
     stops at 100 even when it is already 95. */
  myDog.happiness = Math.min(100, myDog.happiness + points);
  renderDog();
}

/* ---------- 11. The Adopt button ---------- */

adoptForm.addEventListener("submit", function (event) {
  event.preventDefault();               /* stop the browser reloading the page */

  var name = nameInput.value.trim();    /* trims the two ends, keeps inner spaces */

  if (name === "") {
    showMessage("Please type a name for your dog.", "error");
    return;
  }

  if (name.length > 20) {
    showMessage("That name is too long. Please use 20 characters or fewer.", "error");
    return;
  }

  myDog = {
    name: name,
    breed: breedChoice.value,
    day: 1,
    happiness: 50
  };

  renderDog();
  showMessage("Welcome home, " + name + " the " + myDog.breed + "!", "ok");
});

feedButton.addEventListener("click", function () {
  addHappiness(10);
});

playButton.addEventListener("click", function () {
  addHappiness(10);
});

/* ---------- 12. Start with no dog adopted yet ---------- */

renderDog();
