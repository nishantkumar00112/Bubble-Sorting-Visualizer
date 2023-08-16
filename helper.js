export function getCardCountFromInput() {
    const cardCountInput = document.getElementById("card-count");
    const value = +cardCountInput.value;
    if (isNaN(value) || value < 1) {
      cardCountInput.value = 2;
      return 2;
    } else if (value > 15) {
      cardCountInput.value = 15;
      return 15;
    }
    return value;
  }
  
  export function setCardCountInput(cardCount) {
    document.getElementById("card-count").value = cardCount;
  }
  
  export function getEventDelayFromInput() {
    const eventDelayInput = document.getElementById("event-delay");
    const value = +eventDelayInput.value;
    if (isNaN(value) || value < 0) {
      eventDelayInput.value = 0;
      return 0;
    }
  
    return value;
  }
  
  export function getCardValuesFromInput() {
    const cardValuesInput = document.getElementById("card-values");
    if (!cardValuesInput.value.includes(",")) return [];
    const values = cardValuesInput.value.split(",");
    if (Array.isArray(values) && values.length) {
      return values.map((v) => {
        const number = parseFloat(v.trim());
        if (isNaN(number)) throw "Invalid input";
  
        return number;
      });
    }
  
    return [];
  }
  
  export function setCardValuesInput(values) {
    const valuesStr = values.join(",");
  
    document.getElementById("card-values").value = valuesStr;
  }
  
  // Generate an array of random values
  export function getRandomValues(cardCount) {
    const pool = Array.from(Array(cardCount).keys());
    const values = [];
  
    while (pool.length > 0) {
      const index = Math.floor(Math.random() * pool.length);
      values.push(pool[index] + 1);
      pool.splice(index, 1);
    }
  
    return values;
  }
  
  function getCardsHeight(values) {
    const cardsHeight = {};
  
    // Sort values in ascending order
    const sortedValues = [...values].sort((a, b) => a - b);
  
    // Calculate height step
    const heightRange = 140; // Max height - min height
    const heightStep = heightRange / (sortedValues.length - 1);
  
    // Calculate card height for each value
    for (let i = 0; i < sortedValues.length; i++) {
      const value = sortedValues[i];
      const height = Math.round(40 + i * heightStep); // Calculate height for the value
      cardsHeight[value] = height;
    }
  
    return cardsHeight;
  }
  
  // Create cards data based on the input values
  export function createCardsData(values) {
    const cardsData = [];
  
    const cardsHeight = getCardsHeight(values);
  
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      cardsData.push({
        value,
        sortIndex: values.indexOf(value),
        isActive: false,
        isLocked: false,
        height: cardsHeight[value],
      });
    }
  
    return cardsData;
  }
  
  // Generates card HTML using the card object
  const createCard = ({ sortIndex, height, isActive, isLocked, value }) => `
  <div class="card-wrapper" data-sort-index="${sortIndex}" style="height: ${height}px;">
    <div class="card${isActive ? " card-active" : ""}${
    isLocked ? " card-locked" : ""
  }">
      <div class="value">${value}</div>
    </div>
  </div>
  `;
  
  // Updates the cards container with the new cards data
  export function updateCards(cardsData, isReset = false) {
    const cardsContainer = document.getElementById("cards-container");
    if (cardsContainer) {
      const cardWrappers = cardsContainer.querySelectorAll(".card-wrapper");
  
      if (
        cardWrappers.length === 0 ||
        cardWrappers.length !== cardsData.length ||
        isReset
      ) {
        // Initial rendering
        cardsContainer.innerHTML = cardsData.map(createCard).join("");
      } else {
        // Update existing elements
        cardWrappers.forEach((wrapper, index) => {
          const cardData = cardsData[index];
          wrapper.dataset.sortIndex = cardData.sortIndex;
  
          const card = wrapper.querySelector(".card");
          card.classList.toggle("card-active", cardData.isActive);
          card.classList.toggle("card-locked", cardData.isLocked);
  
          const value = wrapper.querySelector(".value");
          value.textContent = cardData.value;
        });
      }
    }
  }
  
  export function togglePlayIcon({ isPaused, playIcon, pauseIcon }) {
    if (isPaused) {
      pauseIcon.classList.add("hidden");
      playIcon.classList.remove("hidden");
      playIcon.classList.add("fade-in");
    } else {
      pauseIcon.classList.remove("hidden");
      pauseIcon.classList.add("fade-in");
      playIcon.classList.add("hidden");
    }
  }
  
  export function clearTimeouts({ timeoutIDs, setTimeoutIDs }) {
    timeoutIDs.forEach((timeoutID) => {
      clearTimeout(timeoutID);
    });
    setTimeoutIDs([]);
  }