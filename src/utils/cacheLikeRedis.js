class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // hashmap to store key -> node mapping
    this.head = new Node(null, null); // dummy head node
    this.tail = new Node(null, null); // dummy tail node
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // Helper method to remove a node from the linked list
  _removeNode(node) {
    let prev = node.prev;
    let next = node.next;
    prev.next = next;
    next.prev = prev;
  }

  // Helper method to add a node right after the head
  _addNode(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  // Get the value of a key if it exists in the cache
  get(key) {
    if (!this.cache.has(key)) return -1;
    
    let node = this.cache.get(key);
    this._removeNode(node); // Move the accessed node to the head (most recently used)
    this._addNode(node);
    return node.value;
  }

  // Insert or update a value in the cache
  put(key, value) {
    if (this.cache.has(key)) {
      let node = this.cache.get(key);
      node.value = value; // Update the value
      this._removeNode(node); // Move to head
      this._addNode(node);
    } else {
      let newNode = new Node(key, value);
      this.cache.set(key, newNode);
      this._addNode(newNode);
      
      if (this.cache.size > this.capacity) { // Cache is over capacity
        let tailPrev = this.tail.prev;
        this._removeNode(tailPrev);
        this.cache.delete(tailPrev.key);
      }
    }
  }
}

// Example Usage
const lruCache = new LRUCache(3);
lruCache.put(1, 'A'); // Add key 1
lruCache.put(2, 'B'); // Add key 2
lruCache.put(3, 'C'); // Add key 3

console.log(lruCache.get(1)); // Returns 'A'
lruCache.put(4, 'D'); // Evicts key 2 (least recently used), adds key 4
console.log(lruCache.get(2)); // Returns -1 (key 2 was evicted)
console.log(lruCache.get(3)); // Returns 'C'
console.log(lruCache.get(4)); // Returns 'D'
