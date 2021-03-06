import { connect } from "react-redux";
import { FillLoanEntered } from "./FillLoanEntered";
import { setError } from "../../../components/Toast/actions";
import { setTokenBalance } from "../../../components/TradingPermissions/actions";
import { fillDebtOrder } from "./actions";
import { BigNumber } from "bignumber.js";

const mapStateToProps = (state: any) => {
    return {
        web3: state.web3Reducer.web3,
        accounts: state.web3Reducer.accounts,
        dharma: state.dharmaReducer.dharma,
        tokens: state.tokenReducer.tokens,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        handleSetError: (errorMessage: string) => dispatch(setError(errorMessage)),
        handleFillDebtOrder: (issuanceHash: string) => dispatch(fillDebtOrder(issuanceHash)),
        updateTokenBalance: (tokenAddress: string, balance: BigNumber) =>
            dispatch(setTokenBalance(tokenAddress, balance)),
    };
};

export const FillLoanEnteredContainer = connect(mapStateToProps, mapDispatchToProps)(
    FillLoanEntered,
);
