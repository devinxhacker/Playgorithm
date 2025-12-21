// Sorting Algorithms for Visualization

export function bubbleSort(arr) {
  const pairs = [];
  let n = arr.length;
  const prevRect = arr.slice();
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (prevRect[j].width > prevRect[j + 1].width) {
        const recti = { ...prevRect[j] };
        const rectj = { ...prevRect[j + 1] };
        prevRect[j + 1] = recti;
        prevRect[j] = rectj;
        pairs.push({ xx: j, yy: j + 1, changed: true });
      } else {
        pairs.push({ xx: j, yy: j + 1, changed: false });
      }
      if (j === n - i - 2) {
        pairs.push({ xx: n - i - 1, yy: n - i - 1, changed: false });
      }
    }
  }
  pairs.push({ xx: 0, yy: 0, changed: false });
  return pairs;
}

export function selectionSort(arr) {
  const pairs = [];
  let n = arr.length;
  const prevRect = arr.slice();
  
  for (let i = 0; i < n - 1; i++) {
    let min_idx = i;
    for (let j = i + 1; j < n; j++) {
      pairs.push({ xx: min_idx, yy: j, changed: false });
      if (prevRect[j].width < prevRect[min_idx].width) {
        min_idx = j;
      }
    }
    const recti = { ...prevRect[i] };
    const rectj = { ...prevRect[min_idx] };
    prevRect[min_idx] = recti;
    prevRect[i] = rectj;
    pairs.push({ xx: min_idx, yy: i, changed: true });
    pairs.push({ xx: i, yy: i, changed: false });
  }
  pairs.push({ xx: n - 1, yy: n - 1, changed: false });
  return pairs;
}

export function insertionSort(arr) {
  const pairs = [];
  let n = arr.length;
  const prevRect = arr.slice();
  
  for (let i = 1; i < n; ++i) {
    let key = prevRect[i].width;
    let j = i - 1;
    
    while (j >= 0 && prevRect[j].width > key) {
      const recti = { ...prevRect[j] };
      const rectj = { ...prevRect[j + 1] };
      prevRect[j + 1] = recti;
      prevRect[j] = rectj;
      pairs.push({ xx: j, yy: j + 1, changed: true });
      j = j - 1;
    }
  }
  for (let i = 0; i < n; i++) {
    pairs.push({ xx: i, yy: i, changed: true });
  }
  return pairs;
}

let values = [];

export function quickSort(rects2) {
  let rects = rects2.slice();
  values = [];
  let sz = rects2.length - 1;
  quick(rects, 0, sz);
  for (let i = 0; i <= sz; i++) {
    values.push({ xx: i, yy: i, changed: true });
  }
  return values;
}

function getPartition(rects, left, right) {
  let pivot = rects[right].width;
  let it = left - 1;
  for (let j = left; j <= right - 1; j++) {
    if (rects[j].width < pivot) {
      it++;
      if (it !== j) {
        const rect1 = { ...rects[it] };
        const rect2 = { ...rects[j] };
        rects[it] = rect2;
        rects[j] = rect1;
        values.push({ xx: it, yy: j, changed: true });
      }
    }
  }
  if (it + 1 !== right) {
    const rect1 = { ...rects[it + 1] };
    const rect2 = { ...rects[right] };
    rects[it + 1] = rect2;
    rects[right] = rect1;
    values.push({ xx: it + 1, yy: right, changed: true });
  }
  return it + 1;
}

function quick(rects, left, right) {
  if (left >= right) return;
  const partition = getPartition(rects, left, right);
  quick(rects, left, partition - 1);
  quick(rects, partition + 1, right);
}

// Merge Sort
export function mergeSort(arr) {
  const animations = [];
  if (arr.length <= 1) return animations;
  const auxiliaryArray = arr.slice();
  mergeSortHelper(arr, 0, arr.length - 1, auxiliaryArray, animations);
  
  // Mark all as sorted
  for (let i = 0; i < arr.length; i++) {
    animations.push({ xx: i, yy: i, changed: true });
  }
  return animations;
}

function mergeSortHelper(mainArray, startIdx, endIdx, auxiliaryArray, animations) {
  if (startIdx === endIdx) return;
  const middleIdx = Math.floor((startIdx + endIdx) / 2);
  mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
  mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
  doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
}

function doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations) {
  let k = startIdx;
  let i = startIdx;
  let j = middleIdx + 1;
  
  while (i <= middleIdx && j <= endIdx) {
    animations.push({ xx: i, yy: j, changed: false });
    if (auxiliaryArray[i].width <= auxiliaryArray[j].width) {
      mainArray[k] = auxiliaryArray[i];
      animations.push({ xx: k, yy: i, changed: true });
      i++;
    } else {
      mainArray[k] = auxiliaryArray[j];
      animations.push({ xx: k, yy: j, changed: true });
      j++;
    }
    k++;
  }
  
  while (i <= middleIdx) {
    animations.push({ xx: i, yy: i, changed: false });
    mainArray[k] = auxiliaryArray[i];
    animations.push({ xx: k, yy: i, changed: true });
    i++;
    k++;
  }
  
  while (j <= endIdx) {
    animations.push({ xx: j, yy: j, changed: false });
    mainArray[k] = auxiliaryArray[j];
    animations.push({ xx: k, yy: j, changed: true });
    j++;
    k++;
  }
}

// Heap Sort
export function heapSort(arr) {
  const animations = [];
  const n = arr.length;
  const array = arr.slice();
  
  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(array, n, i, animations);
  }
  
  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    // Swap
    const temp = array[0];
    array[0] = array[i];
    array[i] = temp;
    animations.push({ xx: 0, yy: i, changed: true });
    animations.push({ xx: i, yy: i, changed: false }); // Mark as sorted
    
    heapify(array, i, 0, animations);
  }
  
  animations.push({ xx: 0, yy: 0, changed: false });
  return animations;
}

function heapify(arr, n, i, animations) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  if (left < n) {
    animations.push({ xx: largest, yy: left, changed: false });
    if (arr[left].width > arr[largest].width) {
      largest = left;
    }
  }
  
  if (right < n) {
    animations.push({ xx: largest, yy: right, changed: false });
    if (arr[right].width > arr[largest].width) {
      largest = right;
    }
  }
  
  if (largest !== i) {
    const temp = arr[i];
    arr[i] = arr[largest];
    arr[largest] = temp;
    animations.push({ xx: i, yy: largest, changed: true });
    
    heapify(arr, n, largest, animations);
  }
}
