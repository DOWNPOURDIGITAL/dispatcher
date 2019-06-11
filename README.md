# @downpourdigital/dispatcher

Async event dispatcher.

# Installation
```
yarn add @downpourdigital/dispatcher
```
```
npm i @downpourdigital/dispatcher
```
# Usage
```typescript
import { EventDispatcher } from '@downpourdigital/dispatcher';


const trigger = new EventDispatcher<number>();

const subscription = trigger.subscribe(
	( callback, payload ) => {
		// perform async action, run callback once complete
		const t = setTimeout( () => callback(), payload );

		// return cleanup function which is called if the event is canceled
		return () => clearTimeout( t );
	},
);

// or subscribe passively
const subscription2 = trigger.subscribePassive(
	( payload ) => {
		console.log( 'Event fired!' );
	}
);


// dispatch event with payload
const event = trigger.dispatch( 2000 );

// once all callbacks have run, the promise is resolved
event.promise.then( () => console.log( 'all callbacks fired' ) );


// to cancel an event before it finished, run:
event.cancel();

// to unsubscribe, run:
subscription.unsubscribe();
// or
trigger.unsubscribe( subscription );
```
