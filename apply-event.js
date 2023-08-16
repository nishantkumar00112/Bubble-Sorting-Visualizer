const swapCards = ({ indexes, cardsData, values }) => {
    const newValues = [...values];
    const [a, b] = indexes;
  
    const temp = values[a];
    newValues[a] = newValues[b];
    newValues[b] = temp;
  
    // tell each card what its new order is
    const newCardsData = cardsData.map((card) => ({
      ...card,
      sortIndex: newValues.indexOf(card.value),
    }));
  
    return { newCardsData, newValues };
  };
  
  const activeCards = (indexes, cardsData) => {
    const newCardsData = cardsData.map((card) => {
      if (indexes.includes(card.sortIndex)) {
        return {
          ...card,
          isActive: true,
        };
      }
      return card;
    });
  
    return { newCardsData };
  };
  
  const deActiveCards = (indexes, cardsData) => {
    const newCardsData = cardsData.map((card) => {
      if (indexes.includes(card.sortIndex)) {
        return {
          ...card,
          isActive: false,
        };
      }
      return card;
    });
  
    return { newCardsData };
  };
  
  const lockCards = (indexes, cardsData) => {
    const newCardsData = cardsData.map((card) => {
      if (indexes.includes(card.sortIndex)) {
        return {
          ...card,
          isLocked: true,
        };
      }
      return card;
    });
  
    return { newCardsData };
  };
  
  // Apply the event from the sorting sequence to the cards data
  export function applyEvent({
    event,
    cardsData,
    values,
    setValues,
    setCardsData,
    setIsDone,
  }) {
    const indexes = event.indexes;
    const type = event.type;
  
    switch (type) {
      case "swap":
        const swapCardsRes = swapCards({
          indexes,
          cardsData,
          values,
        });
        setCardsData(swapCardsRes.newCardsData);
        setValues(swapCardsRes.newValues);
        break;
      case "activate":
        const activeCardsRes = activeCards(indexes, cardsData);
        setCardsData(activeCardsRes.newCardsData);
        break;
      case "deactivate":
        const deActiveCardsRes = deActiveCards(indexes, cardsData);
        setCardsData(deActiveCardsRes.newCardsData);
        break;
      case "lock":
        const lockCardsRes = lockCards(indexes, cardsData);
        setCardsData(lockCardsRes.newCardsData);
        break;
      case "done":
        setIsDone(true);
        break;
      default:
        console.error(`Unknown event type: ${type}`);
    }
  }