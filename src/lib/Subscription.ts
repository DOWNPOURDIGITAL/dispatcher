import Subscribable from './Subscribable';


type CleanupFunction = () => void;


export type Observer<PayloadType> =
	( callback: Function, payload?: PayloadType ) => CleanupFunction | null;


export default class Subscription<PayloadType> {
	private subscribable: Subscribable<PayloadType>;
	public observer: Observer<PayloadType>;


	constructor( observer: Observer<PayloadType>, subscribable: Subscribable<PayloadType> ) {
		this.observer = observer;
		this.subscribable = subscribable;
	}


	unsubscribe(): void {
		this.subscribable.unsubscribe( this );
	}
}