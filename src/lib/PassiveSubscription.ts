import Subscription from './Subscription';
import { Subscribable } from '..';


export type PassiveObserver<PayloadType> = ( payload?: PayloadType ) => void;


export default class PassiveSubscription<PayloadType> extends Subscription<PayloadType> {
	constructor( observer: PassiveObserver<PayloadType>, subscribable: Subscribable<PayloadType> ) {
		super(
			( cb, payload ) => {
				cb();
				observer( payload );
				return null;
			},
			subscribable,
		);
	}
}
