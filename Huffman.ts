/**
 * Узел в дереве Хаффмана
 */
class HNode {
  private charCode: null | number | string;
  private weight: number = 0;
  private subNodes: [HNode, HNode] | null;

  constructor(charCode: number | null | string, weight: number, subNodes: [HNode, HNode] | null) {
    this.charCode = charCode;
    this.weight = weight;
    this.subNodes = subNodes;
  }

  // public setSubNode(order: 0 | 1, node: HNode) {
  //   this.subNodes[order] = node;
  // }

  public getWeight() {
    return this.weight;
  }

  public getSubNodes() {
    return this.subNodes;
  }

  public getCharCode() {
    return this.charCode;
  }
}

/**
 * Код Хаффмана
 */
class HCode {
  private charTable: Map<string, number>;
  private hTreeRoot: HNode;
  private hCode: Map<string, number[]> = new Map();

  constructor(charTable: Map<string, number>) {
    this.charTable = charTable;
  }

  main() {
    // Создать дерево
    this.createHTree();

    // Пройтись по дереву и создать код Хаффмана
    this.createHCode();
  }

  createHCode(): void {
    const charCodesUTF: string[] = Array.from(this.charTable.keys());
    console.log(charCodesUTF[0], 'charCodesUTF[0]');
    
    for (let charCodeUTF of charCodesUTF) {
      const result = this.createBinaryCharCode(charCodeUTF);
      this.hCode.set(charCodeUTF, result);
    }

    console.log(this.hCode, 'this.hCode');
  }

  createBinaryCharCode(charCodeUTF: string): number[] {
    let indexes: Array<0|1> = [];
    const found = {
      isFound: false
    };

    const visited: WeakMap<HNode, boolean> = new Map();


    this.deepNodeSearch(this.hTreeRoot.getSubNodes()[0], charCodeUTF, 0, visited, found, indexes);
    this.deepNodeSearch(this.hTreeRoot.getSubNodes()[1], charCodeUTF, 1, visited, found, indexes);

    console.log(indexes, 'indexes');
    console.log(visited, 'visited');
    return indexes;
  }

  deepNodeSearch(node: HNode, charCodeUTF: string, nodeIndex: 0|1, visited: WeakMap<HNode, boolean>, found: { isFound: boolean }, indexes: Array<0|1>) {
    console.log(node, 'node');

    if (found.isFound) return;
    
    const subNodes = node.getSubNodes();

    if (subNodes === null) {
      if (node.getCharCode() === charCodeUTF) {
        found.isFound = true;
        visited.set(node, true);
        indexes.unshift(nodeIndex);
      } 
      return;
    } else {
      this.deepNodeSearch(subNodes[0], charCodeUTF, 0, visited, found, indexes);
      this.deepNodeSearch(subNodes[1], charCodeUTF, 1, visited, found, indexes);

      if (visited.get(subNodes[0]) === true || visited.get(subNodes[1]) === true) {
        visited.set(node, true);
        indexes.unshift(nodeIndex);
      }
    }
  }

  createHTree(): void {
    const sortedChars: Array<[string, number]> = this.sortCharTable();
    
    const hNodes: HNode[] = [];

    while (sortedChars.length > 1 || hNodes.length > 1) {      
      // Достаём последний и предпоследний по значению count элементы      
      const hNode1 = this.getMinEl(sortedChars, hNodes);
      const hNode2 = this.getMinEl(sortedChars, hNodes);

      // Создаём новый узел дерева Хаффмана
      const sumCount = hNode1.getWeight() + hNode2.getWeight();
      const hTreeNode = new HNode(null, sumCount, [hNode1, hNode2]);      

      // Кладем его в очередь созданных узлов
      this.enqueueEl(hNodes, hTreeNode);
    }

    this.hTreeRoot = this.setRoot(sortedChars, hNodes);
  }

  private setRoot(sortedChars: [string, number][], hNodes: HNode[]): HNode {
    if (sortedChars.length === 0) {
      return hNodes.pop()
    } else {
      const lastChar = sortedChars.pop();
      const hNode1 = new HNode(lastChar[0], lastChar[1], null);
      const hNode2 = hNodes.pop();

      const sumCount = hNode1.getWeight() + hNode2.getWeight();
      const hTreeRoot = new HNode(null, sumCount, [hNode1, hNode2]);
      
      return hTreeRoot;
    }
  }

  private sortCharTable(): Array<[string, number]> {
    return [...this.charTable.entries()].sort(([charCode1, count1], [charCode2, count2]) => {
      return count2 > count1 ? 1 : -1;
    });
  }

  private enqueueEl<T>(arr: Array<any>, newEl: T): void {
    if (!arr.length) {
      arr[0] = newEl;
    } else {
      // Ставим в начало списка элемент с бОльшим весом
      arr.unshift(newEl);
    }
  }

  private getMinEl(sortedChars: Array<[string, number]>, hNodes: HNode[]) {
    let minNode: HNode;

    if (hNodes.length === 0) {
      const lastChar = sortedChars.pop();
      minNode = new HNode(lastChar[0], lastChar[1], null);
      return minNode;
    }

    if (sortedChars.length === 0) {
      minNode = hNodes.pop();
      return minNode;
    }

    if (hNodes[hNodes.length-1].getWeight() < sortedChars[sortedChars.length-1][1]) {
      minNode = hNodes.pop();
    } else {
      const lastChar = sortedChars.pop();      
      minNode = new HNode(lastChar[0], lastChar[1], null);
    }

    return minNode;
  }
}

function createCharTable(text: string): Map<string, number> {
  const charMap = new Map();

  // text.split('').forEach(char => {
  //   const charCode = char.charCodeAt(0);

  //   if (!charMap.has(charCode)) {
  //     charMap.set(charCode, 1);
  //   } else {
  //     const count = charMap.get(charCode);
  //     charMap.set(charCode, count + 1);
  //   }
  // });

  text.split('').forEach(char => {
    if (!charMap.has(char)) {
      charMap.set(char, 1);
    } else {
      const count = charMap.get(char);
      charMap.set(char, count + 1);
    }
  });

  return charMap;
}


/** TEST */
const text = 'ABRAKADABRA';
// A - 5
// B - 2
// R - 2
// K - 1
// D - 1
const charTable = createCharTable(text);

// console.log(charTable, 'charTable');

const algo = new HCode(charTable);
console.log('###################################################################################################');


algo.main();

const text2 = 'бородавка';
// б - 1
// о - 2
// р - 1
// д - 1
// в - 1
// к - 1
// а - 2
const charTable2 = createCharTable(text2);
const algo2 = new HCode(charTable2);

algo2.main();