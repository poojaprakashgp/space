// Create a PubSub object to manage subscriptions and notifications
class PubSub {
  constructor() {
    this.subscribers = {};
  }

  // Method to subscribe to events
  subscribe(event, callback) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(callback);
    return { event, callback }; // Return a token for unsubscribing
  }

  // Method to unsubscribe from events
  unsubscribe(token) {
    const { event, callback } = token;
    if (this.subscribers[event]) {
      this.subscribers[event] = this.subscribers[event].filter(cb => 
      {console.log( cb == callback); return cb !== callback});
    }
  }

  // Method to publish (notify) events
  publish(event, data) {
    if (this.subscribers[event]) {
      this.subscribers[event].forEach(callback => callback(data));
    }
  }
}

// Example usage:

// Create a PubSub instance
const pubsub = new PubSub();

// Subscribe to an event
const subscription1 = pubsub.subscribe('userLoggedIn', function(data) {
  console.log(`User logged in: ${data.username}`);
});

const subscription2 = pubsub.subscribe('userLoggedIn', (data) => {
  console.log(`Use hhsosr logged in: ${data.username}`);
});

// Publish an event
pubsub.publish('userLoggedIn', { username: 'Alice' }); // Output: User logged in: Alice

// Unsubscribe from an event
pubsub.unsubscribe(subscription1);

// Publishing again should not trigger the unsubscribed callback
pubsub.publish('userLoggedIn', { username: 'Bob' }); // No output because subscription1 is unsubscribed
