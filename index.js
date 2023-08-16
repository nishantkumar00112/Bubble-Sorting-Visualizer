import { bubbleSort } from "./bubble-sort.js";
import {
  getCardCountFromInput,
  setCardCountInput,
  getEventDelayFromInput,
  getCardValuesFromInput,
  setCardValuesInput,
  getRandomValues,
  createCardsData,
  updateCards,
  togglePlayIcon,
  clearTimeouts,
} from "./helper.js";

import { applyEvent } from "./apply-event.js";

function init() {
  let cardCount = getCardCountFromInput();
  let eventDelay = getEventDelayFromInput();
  let isDone = false;
  let isPaused = false;
  let cardsData = [];
  let values = [];
  let sequence = [];
  let timeoutIDs = [];
  let lastTimeoutIndex = -1;
  let isInputValuesChanged = false;

  const resetButton = document.getElementById("resetBtn");
  const pausePlayButton = document.getElementById("pausePlayBtn");
  const refreshImg = document.querySelector("#resetBtn svg");
  const playIcon = document.querySelector(".play-icon");
  const pauseIcon = pausePlayButton.querySelector(".pause-icon");
  const cardValuesInput = document.getElementById("card-values");

  const setValues = (v) => (values = v);
  const setCardsData = (v) => (cardsData = v);
  const setIsDone = (v) => (isDone = v);
  const setTimeoutIDs = (v) => (timeoutIDs = v);
  const setIsPaused = (v) => (isPaused = v);
  const setIsInputValuesChanged = (v) => (isInputValuesChanged = v);

  function handleTogglePlayIcon(isPaused) {
    setIsPaused(isPaused);
    togglePlayIcon({ isPaused, playIcon, pauseIcon });
  }

  resetButton.addEventListener("click", () => {
    reset();

    // reset play icon
    if (isPaused) {
      handleTogglePlayIcon(false);
    }

    refreshImg.classList.add("spin");
    // Remove the 'spin' class after the animation is done
    const timeoutId = setTimeout(() => {
      refreshImg.classList.remove("spin");
    }, 1000);

    setTimeoutIDs([...timeoutIDs, timeoutId]);
  });

  function scheduleNextEvent() {
    sequence = sequence.slice(lastTimeoutIndex + 1);
    sequence.forEach(setSequence);
  }

  pausePlayButton.addEventListener("click", () => {
    if (isDone) {
      reset();
    } else if (!isPaused) {
      handleTogglePlayIcon(true);
      clearTimeouts({ timeoutIDs, setTimeoutIDs });
    } else {
      handleTogglePlayIcon(false);
      togglePlayIcon({ isPaused, playIcon, pauseIcon });
      scheduleNextEvent();
    }
  });

  cardValuesInput.addEventListener("change", () => {
    setIsInputValuesChanged(true);
  });

  function getValues({
    isInputValuesChanged,
    setIsInputValuesChanged,
    cardCount,
  }) {
    if (cardValuesInput.value && isInputValuesChanged) {
      const newCardValues = getCardValuesFromInput();
      cardCount = newCardValues.length;
      setCardCountInput(cardCount);
      setIsInputValuesChanged(false);
      return newCardValues;
    } else {
      cardCount = 15;
      setCardCountInput(15);
      return getRandomValues(cardCount);
    }
  }

  function setSequence(event, index) {
    const timeoutID = setTimeout(() => {
      applyEvent({
        event,
        cardsData,
        values,
        setValues,
        setCardsData,
        setIsDone,
      });
      updateCards(cardsData);
      lastTimeoutIndex = index;
    }, index * eventDelay);
    setTimeoutIDs([...timeoutIDs, timeoutID]);
  }

  function initSequence(sequence) {
    sequence.forEach(setSequence);
  }

  // Reset and start the sorting visualization
  function reset() {
    clearTimeouts({ timeoutIDs, setTimeoutIDs }); // Clear any existing timeouts
    eventDelay = getEventDelayFromInput();
    cardCount = getCardCountFromInput();
    if (!cardCount) return;
    setIsDone(false);

    values = getValues({
      isInputValuesChanged,
      setIsInputValuesChanged,
      cardCount,
    });
    setCardValuesInput(values);

    cardsData = createCardsData(values);
    updateCards(cardsData, true);

    const bubbleSortValues = bubbleSort(values);
    sequence = bubbleSortValues.sequence;
    initSequence(sequence);
  }

  reset();
}

document.addEventListener("DOMContentLoaded", init);