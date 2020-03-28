import { SyncState } from "./sync.state";
import { SyncAction } from "./sync.action";

const SyncReducer = (state: SyncState = {}, action: SyncAction): SyncState => {
    switch (action.type) {
        default:
            return state
    }
};

export default SyncReducer
