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
var growthBar = document.getElementById("growth-bar");
var feedButton = document.getElementById("feed-button");
var playButton = document.getElementById("play-button");
var nextDayButton = document.getElementById("next-day-button");
var startOverButton = document.getElementById("start-over-button");

/* Where each breed's picture lives. */
var DOG_IMAGES = {
  "Beagle": "assets/beagle.svg",
  "Golden Retriever": "assets/golden-retriever.svg",
  "Poodle": "assets/poodle.svg"
};

/* The name our saved dog is filed under inside the browser.
   The V1 on the end means we can change the shape of the saved
   data later without upsetting anybody's old saved dog. */
var STORAGE_KEY = "virtualDogParkPetV1";

/* The adopted dog. It stays null until a dog is adopted. */
var myDog = null;

/* ---------- 7. The growth rules ---------- */

function getGrowthStage(day) {
  if (day === 1) {
    return "Puppy";
  } else if (day <= 3) {
    return "Young Dog";
  } else {
    return "Adult Dog";
  }
}

/* How full the growth bar is. Day 4 is fully grown. */
function getGrowthPercent(day) {
  var percent = (day / 4) * 100;

  if (percent > 100) {
    percent = 100;
  }

  return percent;
}

/* ---------- 8. Show a message under the form ---------- */

function showMessage(text, kind) {
  /* textContent puts words on the page as plain text, so a name typed
     as <b>Biscuit</b> is displayed exactly as typed, never as HTML. */
  adoptMessage.textContent = text;
  adoptMessage.className = "message " + kind;
}

/* ---------- 9. Saving and loading the dog ---------- */

/* localStorage can only hold text, so the dog object is turned into a
   JSON string on the way in and back into an object on the way out.
   Both are wrapped in try/catch because a few browsers block storage
   when the page is opened straight from a file. The page still works
   in that case - it just forgets the dog when you refresh. */
function saveDog() {
  try {
    if (myDog === null) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(myDog));
    }
  } catch (error) {
    /* No storage available. Carry on without saving. */
  }
}

function loadDog() {
  var text = null;

  try {
    text = window.localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    return null;
  }

  if (text === null) {
    return null;                 /* nothing has been saved yet */
  }

  try {
    var dog = JSON.parse(text);

    /* A quick check, in case the saved text is not a dog at all. */
    if (dog === null ||
        typeof dog.name !== "string" ||
        typeof dog.breed !== "string" ||
        typeof dog.day !== "number" ||
        typeof dog.happiness !== "number") {
      return null;
    }

    return dog;

  } catch (error) {
    return null;                 /* the saved text was damaged */
  }
}

/* ---------- 10. Fill in the page from myDog ---------- */

function renderDog() {
  var hasDog = (myDog !== null);

  /* No dog yet: show the form. Dog adopted: show the dog instead. */
  adoptForm.hidden = hasDog;
  dogPanel.hidden = !hasDog;

  if (hasDog === false) {
    return;
  }

  statName.textContent = myDog.name;          /* plain text, never innerHTML */
  statBreed.textContent = myDog.breed;
  statDay.textContent = myDog.day;
  statStage.textContent = getGrowthStage(myDog.day);
  statHappiness.textContent = myDog.happiness + " / 100";
  growthBar.style.width = getGrowthPercent(myDog.day) + "%";

  dogPhoto.setAttribute("src", DOG_IMAGES[myDog.breed]);
  dogPhoto.setAttribute("alt", "Illustration of a " + myDog.breed + ".");
}

/* ---------- 11. Feed and Play ---------- */

/* Math.min keeps the total at or below 100,
   Math.max keeps it at or above 0. */
function addHappiness(points) {
  if (myDog === null) {
    return;
  }

  var wanted = myDog.happiness + points;
  myDog.happiness = Math.max(0, Math.min(100, wanted));

  saveDog();
  renderDog();
}

/* ---------- 12. Next Day ---------- */

function nextDay() {
  if (myDog === null) {
    return;
  }

  myDog.day = myDog.day + 1;                             /* one day older */
  myDog.happiness = Math.max(0, myDog.happiness - 5);    /* and a bit less happy */

  saveDog();
  renderDog();
}

/* ---------- 13. Start Over ---------- */

function startOver() {
  var sure = window.confirm("Start over? This deletes your saved dog.");

  if (sure === false) {
    return;                  /* the visitor changed their mind: keep the dog */
  }

  window.localStorage.removeItem(STORAGE_KEY);
  myDog = null;
  nameInput.value = "";

  renderDog();
  showMessage("Your dog is gone. Adopt a new one whenever you like.", "ok");
}

/* ---------- 14. The Adopt button ---------- */

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

  saveDog();
  renderDog();
  showMessage("Welcome home, " + name + " the " + myDog.breed + "!", "ok");
});

feedButton.addEventListener("click", function () {
  addHappiness(10);
});

playButton.addEventListener("click", function () {
  addHappiness(10);
});

nextDayButton.addEventListener("click", nextDay);
startOverButton.addEventListener("click", startOver);

/* ---------- 15. Pick up where we left off ---------- */

myDog = loadDog();
renderDog();

if (myDog !== null) {
  showMessage("Welcome back, " + myDog.name + "!", "ok");
}

