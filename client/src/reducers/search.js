import { SET_OPTIONS } from '../actions/types'

export default function search(state = [], action = {}) {
	switch (action.type){
		case SET_OPTIONS:
			return action.options
		default: return state
	}
}