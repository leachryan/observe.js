/**
 * observe.js - Observer pattern implementation for Javascript.
 * Observe both DOM and custom events using Observers, Observables, ObservableEvent, and ObservablesDispatcher objects.
 *  
 * 
 * @author Ryan Leach
 * @version 1.0.0
 */

/**
 * Extends the base Event class to work with the Observer class.
 * ObservableEvent is able to be listened to by eventListeners as well as Observer objects.
 * 
 */
class ObservableEvent extends Event
{
    /**
     * Extend the base Event class with custom data usable in Observers.
     * 
     * @param {string} type 
     * @param {object} details 
     * @param {*} data 
     */
	constructor(type, details, data)
    {
        // Event constructor
        super(type, details);

        /** @private */
        this.observers = [];
        
        /** @private */
		this.data = data;
    }

    /**
     * Attach an Observer to the ObservableEvent that will listen for notify().
     * 
     * @param {*} key
     * @param {Observer} observer 
     */
    attach(key, observer)
    {
        if(key && observer)
        {
            if(observer instanceof Observer)
            {
                this.observers[key] = observer;
            }
            else
            {
                throw new TypeError('observer must be an instance of Observer')
            }
        }
        else
        {
            throw new TypeError('key and observer must not be undefined');
        }
    }

    /**
     * Detach an Observer from listening to the ObservableEvent notify().
     * 
     * @param {*} key 
     */
    detach(key)
    {
        delete this.observers[key];
    }

    /**
     * Detach all Observers from the ObservableEvent.
     */
    detachAll()
    {
        this.observers = [];
    }

    /**
     * Set the custom data for the ObservableEvent.
     * 
     * @param {*} data 
     */
    setData(data)
    {
        this.data = data;
    }

    /**
     * Notify all attached Observers that the event has fired.
     * Pass the ObservableEvent object to the Observer, where the object will be used in the Observer's observe() logic.
     */
    notify()
    {
        Object.keys(this.observers).forEach( (key, index) => 
        {
            this.observers[key].observe(this);
        });
    }

    /**
     * Convert the ObservableEvent object to an instance of Observable and returns.
     * Observable objects cannot be listened to by eventListeners.
     * 
     * @return {Observable}
     */
	toObservable()
	{
		let observable = new Observable(this.data);
		observable.observers = this.observers;
		
		return observable;
	}
}

/**
 * Subscribes to Observable and ObservableEvent objects.
 * Observer's observer method act as a callback for when its subscribed event notifies that it has fired.
 * 
 * Acts as a base class that is meant to be extended, but may function by itself, as long as a function is passed in upon construction.
 * 
 */
class Observer
{
    /**
     * Set the observe logic upon construction, or throw an error.
     * @param {function (params) {}} fn 
     */
    constructor(fn = null)
    {
        if(fn !== null)
        {
            this.setObserve(fn);
        }
    }

    /**
     * Set the logic of the observe method.
     * 
     * @param {function (params) {}} fn 
     */
    setObserve(fn)
    {
        if(fn !== null)
        {
            if(typeof(fn) == 'function')
            {
                if(fn.length == 1)
                {
                    this.observe = fn;
                }
                else
                {
                    throw new Error(`The constructor's fn argument can only accept one parameter, which is the event to be passed to the Observer`);
                }
            }
            else
            {
                throw new TypeError('Observer must only be instantiated with a function as the arguement');
            }
        }
        else
        {
            throw new Error('The observe method must be a valid function that accepts only one parameter');
        }
    }

    /**
     * Logic to be executed each time the Observer is notified of an event firing.
     * @param {Observable || ObservableEvent} event 
     */
    observe(event)
    {
        // Unique observe logic
    }
}

/**
 * Custom event that is able to be observed by an Observer.
 * Acts as a container for data to be passed to the Observer when fired.
 * 
 */
class Observable
{
    /**
     * Sets the custom data upon construction.
     * 
     * @param {*} data 
     */
    constructor(data)
    {
        /** @private */
        this.observers = [];

        /** @private */
        this.data = data;
    }

    /**
     * Attach an Observer to the Observable that will listen for notify().
     * 
     * @param {*} key
     * @param {Observer} observer 
     */
    attach(key, observer)
    {
        if(key && observer)
        {
            if(observer instanceof Observer)
            {
                this.observers[key] = observer;
            }
            else
            {
                throw new TypeError('observer must be an instance of Observer')
            }
        }
        else
        {
            throw new TypeError('key and observer must not be undefined');
        }
    }

    /**
     * Detach an Observer from listening to the Observable notify().
     * 
     * @param {*} key 
     */
    detach(key)
    {
        delete this.observers[key];
    }

    /**
     * Detach all Observers from the Observable.
     */
    detachAll()
    {
        this.observers = [];
    }
    
    /**
     * Set the custom data for the Observable.
     * 
     * @param {*} data 
     */
    setData(data)
    {
        this.data = data;
    }

    /**
     * Notify all attached Observers that the event has fired.
     * Pass the Observable object to the Observer, where the object will be used in the Observer's observe() logic.
     */
    notify()
    {
        Object.keys(this.observers).forEach( (key, index) => 
        {
            this.observers[key].observe(this);
        })
    }
    
    /**
     * Convert the Observable object to an instance of ObservableEvent and returns.
     * ObservableEvent objects can be listened to by eventListeners.
     * 
     * @param {string} type
     * @param {object} details
     * @return {ObservableEvent} observableEvent
     */
	toObservableEvent(type, details)
	{
		let observableEvent = new ObservableEvent(type, details, this.data);
		observableEvent.observers = this.observers;
		
		return observableEvent;
	}
}

/**
 * Container and director for Observable and ObservableEvent objects.
 * Can dispatch a single event or all events.
 * Observable events are set using a key.
 * 
 */
class ObservablesDispatcher
{
    /**
     * Sets the observables to an empty array.
     */
    constructor()
    {
        this.observables = [];
    }

    /**
     * Dispatch an event linked using a given key.
     * 
     * @param {string} key 
     */
    dispatch(key)
    {
        Object.keys(this.observables).indexOf(key) !== -1 ? this.observables[key].notify() : false;
    }

    /**
     * Dispatch all events.
     */
    dispatchAll()
    {
        Object.keys(this.observables).forEach( (key) => 
        {
            this.observables[key].notify();
        });
    }

    /**
     * Register an Observable or ObservableEvent to the Dispatcher.
     * 
     * @param {string} key 
     * @param {Observable || ObservableEvent} observable 
     */
    register(key, observable)
    {
        if(key && observable)
        {
            if(observable instanceof Observable || observable instanceof ObservableEvent)
            {
                this.observables[key] = observable;
            }
            else
            {
                throw new TypeError('The Dispatcher can only accept objects of class Observable or ObservableEvent');
            }
        }
        else
        {
            throw new TypeError('key and observable cannot be undefined');
        }
    }

    /**
     * Unregister an Observable or ObservableEvent from the Dispatcher.
     * 
     * @param {string} key 
     */
    unregister(key)
    {
        delete this.observables[key];
    }

    /**
     * Unregister all objects from the Dispatcher.
     */
    removeAll()
    {
        this.observables = [];
    }
}

/**
 * Helper function to create an Observable and Observer from a data object and function.
 * 
 * @function observe
 * 
 * @param {Observable || ObservableEvent} observable
 * @param {*} fn
 * @return {Object}
 */
observe = (observable, fn) => 
{   
    if(observable instanceof Observable == false)
    {
        observable = new Observable(observable);
    }

    if(fn instanceof Observer == false)
    {
        fn = new Observer(fn);
    }

    observable.attach(fn);

    return {observer : fn, observable : observable};
}

/**
 * Helper function to dispatch an Observable or ObservableEvent.
 * 
 * @function dispatch
 * 
 * @param {*} observable
 */
dispatch = (observable) =>
{
    if(observable instanceof ObservableEvent || observable instanceof Observable)
    {
        observable.notify();
    }
}
