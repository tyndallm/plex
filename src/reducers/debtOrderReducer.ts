import { actionsEnums } from "../common/actionsEnums";
import { DebtOrderEntity } from "../models";

class DebtOrderReducerState {
    filledDebtOrders: DebtOrderEntity[];
    pendingDebtOrders: DebtOrderEntity[];
    singleDebtOrder: DebtOrderEntity;

    constructor() {
        this.filledDebtOrders = [];
        this.pendingDebtOrders = [];
        this.singleDebtOrder = new DebtOrderEntity();
    }
}

const handleRequestDebtOrder = (state: DebtOrderReducerState, payload: DebtOrderEntity[]) => {
    return {
        ...state,
        pendingDebtOrders: [...state.pendingDebtOrders, payload],
    };
};

const handleGetPendingDebtOrder = (state: DebtOrderReducerState, payload: string) => {
    const pendingDebtOrder = state.pendingDebtOrders.find(
        (_pendingDebtOrder) => _pendingDebtOrder.issuanceHash === payload,
    );
    return {
        ...state,
        singleDebtOrder: pendingDebtOrder,
    };
};

const handleRemovePendingDebtOrder = (state: DebtOrderReducerState, payload: string) => {
    return {
        ...state,
        pendingDebtOrders: state.pendingDebtOrders.filter(
            (_pendingDebtOrder) => _pendingDebtOrder.issuanceHash !== payload,
        ),
    };
};

const handleSetFilledDebtOrders = (state: DebtOrderReducerState, action: any) => {
    const { filledDebtOrders } = action;

    return {
        ...state,
        filledDebtOrders,
    };
};

export const debtOrderReducer = (
    state: DebtOrderReducerState = new DebtOrderReducerState(),
    action: any,
) => {
    switch (action.type) {
        case actionsEnums.REQUEST_DEBT_ORDER:
            return handleRequestDebtOrder(state, action.payload);
        case actionsEnums.GET_PENDING_DEBT_ORDER:
            return handleGetPendingDebtOrder(state, action.payload);
        case actionsEnums.FILL_DEBT_ORDER:
            return handleRemovePendingDebtOrder(state, action.payload);
        case actionsEnums.SET_FILLED_DEBT_ORDERS:
            return handleSetFilledDebtOrders(state, action);
        default:
            return state;
    }
};
