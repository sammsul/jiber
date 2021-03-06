import { Action, Reducer, RoomState, createRoom } from 'jiber-core'
import { pendingActions } from './pending-actions'
import { createOptimistic } from './optimistic'

/**
 * Clients have a few additional fields to handle optimistic state
 * @hidden
 */
export interface ClientRoomState extends RoomState {
  optimistic: any,
  pendingActions: Action[]
}

/**
 * @hidden
 */
const defaultState: ClientRoomState = {
  lastUpdatedAt: 0,
  members: {},
  confirmed: undefined,
  optimistic: undefined,
  pendingActions: []
}

/**
 * Calculates a confirmed state,
 * then uses the confirmed state to calculate an optimistic state
 * @hidden
 */
export const createClientRoom = (subReducer: Reducer): Reducer => {
  const roomReducer = createRoom(subReducer)
  const optimistic = createOptimistic(subReducer)

  return (
    state: ClientRoomState = defaultState,
    action: Action
  ): ClientRoomState => {
    const newState = roomReducer(state, action)
    newState.pendingActions = pendingActions(newState.pendingActions, action)
    newState.optimistic = optimistic(newState, action)
    return newState
  }
}
