import Subscribable from './Subscribable';
import PersistentEvent from './PersistentEvent';


interface EventDispatcherProps {
	mayCancelAfterCallback?: boolean;
}


export default class EventDispatcher<PayloadType> extends Subscribable<PayloadType> {
	protected events: PersistentEvent<PayloadType>[] = [];
	protected mayCancelAfterCallback: boolean;


	constructor( props: EventDispatcherProps = {}) {
		super();

		const {
			mayCancelAfterCallback = true,
		} = props;

		this.mayCancelAfterCallback = mayCancelAfterCallback;
	}


	dispatchPassive( payload?: PayloadType ): void {
		this.listeners.forEach( s => s.observer( () => {}, payload ) );
	}


	dispatch( payload?: PayloadType ): PersistentEvent<PayloadType> {
		const event = new PersistentEvent( this.listeners, payload, this.mayCancelAfterCallback );

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
