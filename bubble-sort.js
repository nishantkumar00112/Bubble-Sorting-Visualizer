function swap(arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  
  // Perform bubble sort and generate a sequence of events for visualization
  export function bubbleSort(inputValues) {
    const arr = inputValues.slice();
    const sequence = [];
    let j;
    for (let i = arr.length; i > 0; i--) {
      let noSwap = true;
      for (j = 0; j < i - 1; j++) {
        sequence.push({ type: "activate", indexes: [j, j + 1] });
        if (arr[j] > arr[j + 1]) {
          swap(arr, j, j + 1);
          noSwap = false;
          sequence.push({ type: "swap", indexes: [j, j + 1] });
        }
        sequence.push({ type: "deactivate", indexes: [j, j + 1] });
      }
      sequence.push({ type: "lock", indexes: [j] });
  
      if (noSwap) {
        const skipped = Array.from(Array(j).keys());
        sequence.push({ type: "lock", indexes: skipped });
        sequence.push({ type: "done" });
        break;
      }
    }
  
    return { sortedValues: arr, sequence };
  }