/* eslint-disable import/no-duplicates */
/* eslint-disable no-duplicate-imports */
import type { Observer } from './Subscription';
import Subscription from './Subscription';
import PassiveSubscription, { PassiveObserver } from './PassiveSubscription';


export default class Subscribable<PayloadType> {
	protected listeners: Subscription<PayloadType>[] = [];


	subscribe( observer: Observer<PayloadType> ): Subscription<PayloadType> {
		const subscription = new Subscription<PayloadType>(
			observer,
			this,
		);

		this.listeners.push( subscription );

		return subscription;
	}


	subscribePassive( observer: PassiveObserver<PayloadType> ): PassiveSubscription<PayloadType> {
		const subscription = new PassiveSubscription<PayloadType>(
			observer,
			this,
		);

		this.listeners.push( subscription );

		return subscription;
	}


	unsubscribe( subscription: Subscription<PayloadType> ): void {
		this.listeners.splice( this.listeners.findIndex( s => s === subscription ), 1 );
	}
}
