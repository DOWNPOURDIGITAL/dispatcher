import Subscription from './Subscription';


interface Listener<T> {
	subscription: Subscription<T>;
	cancel?: Function;
}


export default class RunningEvent<PayloadType> {
	private canceled: boolean = false;
	private isAccumulating: boolean = true;
	private listeners: Listener<PayloadType>[] = [];
	private completedListeners: Listener<PayloadType>[] = [];
	private resolve?: Function;
	private reject?: Function;
	private mayCancelAfterCallback: boolean;
	public promise: Promise<void>;


	constructor(
		listeners: Subscription<PayloadType>[],
		payload?: PayloadType,
		mayCancelAfterCallback?: boolean,
	) {
		this.mayCancelAfterCallback = !!mayCancelAfterCallback;

		this.promise = new Promise( ( resolve, reject ) => {
			this.resolve = resolve;
			this.reject = reject;
		});

		listeners.forEach( ( s ) => {
			const cancel = s.observer( () => { this.completeCallback( s ); }, payload ) || undefined;
			this.listeners.push({
				cancel,
				subscription: s,
			});
		});
		this.isAccumulating = false;

		if ( this.listeners.length === 0 && this.resolve ) this.resolve();
	}


	private completeCallback( subscription: Subscription<PayloadType> ): void {
		if ( !this.canceled ) {
			const [listener] = this.listeners.splice(
				this.listeners.findIndex( l => l.subscription === subscription ),
				1,
			);

			if ( this.mayCancelAfterCallback && listener ) {
				this.completedListeners.push( listener );
			}

			if ( this.listeners.length === 0 && !this.isAccumulating && this.resolve ) this.resolve();
		}
	}


	cancel(): void {
		if ( !this.canceled ) {
			this.canceled = true;

			this.listeners.forEach( ( listener ) => {
				if ( listener.cancel ) listener.cancel();
			});

			if ( this.mayCancelAfterCallback ) {
				this.completedListeners.forEach( ( listener ) => {
					if ( listener.cancel ) listener.cancel();
				});
			}

			if ( this.reject ) this.reject();
		}
	}
}
