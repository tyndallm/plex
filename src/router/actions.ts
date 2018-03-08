import { actionsEnums } from '../common/actionsEnums';
import { DebtOrderEntity, InvestmentEntity } from '../models';

export const web3Connected = (web3: any) => {
	return {
		type: actionsEnums.WEB3_CONNECTED,
		web3: web3
	};
};

export const dharmaInstantiated = (dharma: any) => {
	return {
		type: actionsEnums.DHARMA_INSTANTIATED,
		dharma: dharma
	};
};

export const setAccounts = (accounts: string[]) => {
	return {
		type: actionsEnums.SET_ACCOUNTS,
		accounts: accounts
	};
};

export const setDebtOrders = (debtOrders: DebtOrderEntity[]) => {
	return {
		type: actionsEnums.SET_DEBT_ORDERS,
		debtOrders: debtOrders
	};
};

export const setInvestments = (investments: InvestmentEntity[]) => {
	return {
		type: actionsEnums.SET_INVESTMENTS,
		investments: investments
	};
};