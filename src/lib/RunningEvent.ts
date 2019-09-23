import Subscription from './Subscription';


export default class RunningEvent<PayloadType> {
	private cancelFunctions: Function[] = [];
	private canceled: boolean = false;
	private isAccumulating: boolean = true;
	private listeners: Subscription<PayloadType>[] = [];
	private resolve?: Function;
	private reject?: Function;
	public promise: Promise<void>;


	constructor( listeners: Subscription<PayloadType>[], payload?: PayloadType ) {
		this.promise = new Promise( ( resolve, reject ) => {
			this.resolve = resolve;
			this.reject = reject;
		});

		this.listeners = listeners.slice( 0 );
		listeners.forEach( ( s ) => {
			const cancelFunc = s.observer( () => { this.completeCallback( s ); }, payload );

			if ( cancelFunc ) {
				this.cancelFunctions.push( cancelFunc );
			}
		});
		this.isAccumulating = false;

		if ( this.listeners.length === 0 && this.resolve ) this.resolve();
	}


	private completeCallback( subscription: Subscription<PayloadType> ): void {
		if ( !this.canceled ) {
			this.listeners.splice( this.listeners.findIndex( s => s === subscription ), 1 );

			if ( this.listeners.length === 0 && !this.isAccumulating && this.resolve ) this.resolve();
		}
	}


	cancel(): void {
		if ( !this.canceled ) {
			this.canceled = true;
			this.cancelFunctions.forEach( f => f() );
			if ( this.reject ) this.reject();
		}
	}
}
