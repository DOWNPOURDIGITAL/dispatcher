import Subscribable from './Subscribable';
import RunningEvent from './RunningEvent';

export default class EventDispatcher<PayloadType> extends Subscribable<PayloadType> {
	dispatchPassive( payload?: PayloadType ): void {
		this.listeners.forEach( s => s.observer( () => {}, payload ) );
	}


	dispatch( payload?: PayloadType ): RunningEvent<PayloadType> {
		return new RunningEvent( this.listeners, payload );
	}
}
