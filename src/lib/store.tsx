import * as React from 'react'
import * as Unstated from 'unstated'
import { detailedDiff } from 'deep-object-diff'
//

interface IStoreProps {
  children: any
  store? : any
  debugStore?: boolean
}

const isServer = typeof window === 'undefined'
const __NEXT_TOOLS_STORE__ = '__NEXT_TOOLS_STORE__'

class Provider extends React.PureComponent<IStoreProps> {
  constructor(props: IStoreProps) {
    super(props)
    this.getOrCreateStore = this.getOrCreateStore.bind(this)
  }
  initStore() {
    const { store } = this.props
    return Object.keys(store || {}).reduce((containers, container) => [
      ...containers,
      new store[container](),
    ], [])
  }
  componentDidMount() {
    if (this.props.debugStore) {
      StoreDebugger.isEnabled = true
    }
  }
  getOrCreateStore() {
    if (isServer) {
      return this.initStore()
    }

    if (!(window as any)[__NEXT_TOOLS_STORE__]) {
      (window as any)[__NEXT_TOOLS_STORE__] = this.initStore()
    }

    return (window as any)[__NEXT_TOOLS_STORE__]
  }
  render() {
    const { children } = this.props
    return (
      <Unstated.Provider inject={this.getOrCreateStore()}>
        {children}
      </Unstated.Provider>
    )
  }
}

const __NEXT_TOOLS_STORE_DEBUGGER__ = {
  isEnabled: false,
}

if (!isServer) {
	(window as any).__NEXT_TOOLS_STORE_DEBUGGER__ = __NEXT_TOOLS_STORE_DEBUGGER__;
}

const StoreDebugger = __NEXT_TOOLS_STORE_DEBUGGER__

class Container extends Unstated.Container<any> {
  state = {}
  setState = async (
    updater: object | ((prevState: object) => object),
    callback?: () => void
  ): Promise<void> => {
    const name = this.constructor.name
    const prevState = { ...this.state }
    await super.setState(updater, callback)
    const newState = { ...this.state }

    if (__NEXT_TOOLS_STORE_DEBUGGER__.isEnabled) {
      const diff: {
        added?: string,
        updated?: string,
        deleted?: string,
      } = detailedDiff(prevState, newState)
  
      console.groupCollapsed(name)
      const hasChanges = (obj: any) => !!Object.keys(obj).length
  
      if (hasChanges(diff.added)) {
        console.log('Added\n', diff.added);
      }
  
      if (hasChanges(diff.updated)) {
        console.log('Updated\n', diff.updated);
      }
  
      if (hasChanges(diff.deleted)) {
        console.log('Deleted\n', diff.deleted);
      }
      
      console.log('New state\n', newState);
      console.log('Old state\n', prevState);
      console.groupEnd()
    }
  }
}

const subscribe = (to: any) => (Component: any) => (props: any) => {
  const containers = Object.keys(to).map(key => to[key])
  return (
    <Unstated.Subscribe to={[...containers]}>
      {(...values) => {
        const mappedContainers = Object.keys(to).reduce((acc:any, key, i) => {
          acc[key] = values[i];
          return acc;
        }, {});
        return <Component {...props} {...mappedContainers} />;
      }}
    </Unstated.Subscribe>
  )
}


export {
  Provider,
  Container,
  subscribe
}