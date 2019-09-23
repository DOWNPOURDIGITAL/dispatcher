import Subscribable from './Subscribable';
import RunningEvent from './RunningEvent';

export default class EventDispatcher<PayloadType> extends Subscribable<PayloadType> {
	protected events: RunningEvent<PayloadType>[] = [];


	dispatchPassive( payload?: PayloadType ): void {
		this.listeners.forEach( s => s.observer( () => {}, payload ) );
	}


	dispatch( payload?: PayloadType ): RunningEvent<PayloadType> {
		const event = new RunningEvent( this.listeners, payload );

		this.events.push( event );

		event.promise.catch( () => {}).finally( () => {
			this.events.splice( this.events.findIndex( e => e === event ), 1 );
		});

		return event;
	}


	cancelAll() {
		this.events.forEach( e => e.cancel() );
	}
}
