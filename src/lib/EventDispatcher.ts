import Subscribable from './Subscribable';
import RunningEvent from './RunningEvent';


interface EventDispatcherProps {
	mayCancelAfterCallback?: boolean;
}


export default class EventDispatcher<PayloadType> extends Subscribable<PayloadType> {
	protected events: RunningEvent<PayloadType>[] = [];
	protected mayCancelAfterCallback: boolean;


	constructor( props: EventDispatcherProps = {} ) {
		super();

		const {
			mayCancelAfterCallback = true,
		} = props;

		this.mayCancelAfterCallback = mayCancelAfterCallback;
	}


	dispatchPassive( payload?: PayloadType ): void {
		this.listeners.forEach( s => s.observer( () => {}, payload ) );
	}


	dispatch( payload?: PayloadType ): RunningEvent<PayloadType> {
		const event = new RunningEvent( this.listeners, payload, this.mayCancelAfterCallback );

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
