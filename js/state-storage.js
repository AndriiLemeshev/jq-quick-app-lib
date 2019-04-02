export default class StateStorage {
    constructor(initalState = {}, reducers = []) {
        this.state = initalState;
        this.reducers = reducers;
        this.subscribers = [];
    }

    dispatcher() {
        return (action) => {
            const delta = Object
                .keys(this.reducers)
                .map(key => this.reducers[key](this.state[key], action));
            const next = Object.assign({}, this.state, delta);

            if (JSON.stringify(this.state) !== JSON.stringify(next)) {
                this.state = next;
                return new Promise((resolve, reject) => {
                    this.subscribers.forEach(subscriber => subscriber(this.state));
                    resolve();
                })
            }

            return Promise.resolve();
        }
    }

    subscribe(subscriber) {
        this.subscribers.push(subscriber);
    }

    unsubscribe(subscriber) {
        this.subscribers = this.subscribers.filter(item => item !== subscriber)
    }
}