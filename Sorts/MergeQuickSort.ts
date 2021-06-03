import { QuickSort } from "./QuickSort";

export class MergeQuickSort {
  array
  
  main(array) {
    this.array = array;
    
    const sortedArray = this.sort(0, this.array.length-1);
    console.log(this.array, 'sortedArray');
    console.log(this.array[this.array.length - 1], 'last of sortedArray');
    return sortedArray;
  }
  
  sort(start, end) {
    // условие выхода - массив, состоящий лишь из одного элемента
    if (start === end) return;

    // выбираем опорный элемент    
    const pivot = Math.floor((start + end) / 2);
    // сортируем левую часть
    this.sort(start, pivot);
    // сортируем правую часть
    this.sort(pivot + 1, end);
    // объединяем две отсортированные части в одну
    this.merge(start, pivot, end);
  }
  
  merge(start, pivot, end) {
    const quickSort = new QuickSort();
    
    // временный массив для сортировки элементов от start до end
    let m = [];

    if (this.array[pivot] >= 32 && this.array[pivot] <= 1024) {
      m = quickSort.main(this.array.slice(start, end));
    }
    
    // let a = start;
    // let b = pivot + 1;
    
    // while (a <= pivot && b <= end) {
    //   if (this.array[a] < this.array[b]) {
    //     m.push(this.array[a++]);
    //   } else {
    //     m.push(this.array[b++]);
    //    }
    // }
    
    // // Добираем оставшиеся элементы из a или b
    // while (a <= pivot) {
    //   m.push(this.array[a++])
    // }
    // while (b <= end) {
    //   m.push(this.array[b++])
    // }
    
    // console.log(m, 'm')
    
    // Подменяем отсортированные кусочки в исходном массиве
    for (let i = start; i <= end; i++) {
      this.array[i] = m[i-start]; // m должен начинаться с 0 индекса и далее
    }
  }
}

// new MergeSort().main([
//     574, 50294,  7284,
//    4139, 14507, 53209,
//   42831, 38566, 61835,
//   58217
// ])