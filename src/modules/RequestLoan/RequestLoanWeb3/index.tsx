import * as React from 'react';
import { schema, uiSchema } from './schema';
import {
	Header,
	JSONSchemaForm,
	MainWrapper,
	Bold,
	ConfirmationModal
} from '../../../components';
import { browserHistory } from 'react-router';
import getWeb3 from '../../../utils/getWeb3';

const promisify = require('tiny-promisify');
const BigNumber = require('bignumber.js');

// Import Dharma libraries
import Dharma from '@dharmaprotocol/dharma.js';

// Import Currently Deployed Dharma contracts (should only be done in test context -- otherwise)
const DebtRegistry = require('../../../artifacts/DebtRegistry.json');
const DebtKernel = require('../../../artifacts/DebtKernel.json');
const RepaymentRouter = require('../../../artifacts/RepaymentRouter.json');
const TokenTransferProxy = require('../../../artifacts/TokenTransferProxy.json');
const TokenRegistry = require('../../../artifacts/TokenRegistry.json');
const DebtToken = require('../../../artifacts/DebtToken.json');
const TermsContractRegistry = require('../../../artifacts/TermsContractRegistry.json');

interface State {
	dharma: any;
	web3: any;
	accounts: string[];
	formData: any;
	debtOrder: string;
	confirmationModal: boolean;
}

class RequestLoanWeb3 extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleSignDebtOrder = this.handleSignDebtOrder.bind(this);
		this.confirmationModalToggle = this.confirmationModalToggle.bind(this);

		this.state = {
			dharma: null,
			web3: null,
			accounts: [],
			formData: {},
			debtOrder: '',
			confirmationModal: false
		};
	}

	componentWillMount() {
		getWeb3
			.then(results => {
				this.setState({
					web3: results.web3
				});

				// Instantiate contract once web3 provided.
				this.instantiateDharma();
			})
			.catch((e) => {
				console.log('Error instantiating Dharma contracts:' + e);
			});
	}

	async instantiateDharma() {
		const networkId = await promisify(this.state!.web3!.version.getNetwork)();
		const accounts = await promisify(this.state!.web3!.eth.getAccounts)();

		if (!(networkId in DebtKernel.networks &&
			networkId in RepaymentRouter.networks &&
			networkId in TokenTransferProxy.networks &&
			networkId in TokenRegistry.networks &&
			networkId in DebtToken.networks &&
			networkId in TermsContractRegistry.networks &&
			networkId in DebtRegistry.networks)) {
			throw new Error('Cannot find Dharma smart contracts on current Ethereum network.');
		}

		const dharmaConfig = {
			kernelAddress: DebtKernel.networks[networkId].address,
			repaymentRouterAddress: RepaymentRouter.networks[networkId].address,
			tokenTransferProxyAddress: TokenTransferProxy.networks[networkId].address,
			tokenRegistryAddress: TokenRegistry.networks[networkId].address,
			debtTokenAddress: DebtToken.networks[networkId].address,
			termsContractRegistry: TermsContractRegistry.networks[networkId].address,
			debtRegistryAddress: DebtRegistry.networks[networkId].address
		};

		const dharma = new Dharma(this.state!.web3!.currentProvider, dharmaConfig);
		this.setState({ dharma, accounts });
	}

	handleChange(formData: any) {
		this.setState({ formData });
	}

	async handleSubmit() {
		const { principalAmount, principalTokenSymbol, interestRate, amortizationUnit, termLength } = this.state.formData;
		const dharma = this.state.dharma;

		const tokenRegistry = await dharma.contracts.loadTokenRegistry();
		const principalToken = await tokenRegistry.getTokenAddress.callAsync(principalTokenSymbol);

		const simpleInterestLoan = {
			principalToken,
			principalAmount: new BigNumber(principalAmount),
			interestRate: new BigNumber(interestRate),
			amortizationUnit,
			termLength: new BigNumber(termLength)
		};

		const debtOrder = await dharma.adapters.simpleInterestLoan.toDebtOrder(simpleInterestLoan);

		this.setState({ debtOrder: JSON.stringify(debtOrder) });
		this.confirmationModalToggle();
	}

	async handleSignDebtOrder() {
		if (!this.state.debtOrder) {
			throw new Error('No Debt order has been generated yet');
		}
		const debtOrder = JSON.parse(this.state.debtOrder);

		debtOrder.principalAmount = new BigNumber(debtOrder.principalAmount);
		debtOrder.debtor = this.state.accounts[0];

		// Sign as debtor
		const debtorSignature = await this.state.dharma.sign.asDebtor(debtOrder);
		const signedDebtOrder = Object.assign({ debtorSignature }, debtOrder);

		this.setState({
			debtOrder: JSON.stringify(signedDebtOrder),
			confirmationModal: false
		});
		browserHistory.push('/request/success');
	}

	confirmationModalToggle() {
		this.setState({
			confirmationModal: !this.state.confirmationModal
		});
	}

	render() {
		const confirmationModalContent = (
			<span>
				You are requesting a loan of <Bold>{this.state.formData.principalAmount} {this.state.formData.principalTokenSymbol}</Bold> with interest rate of <Bold>{this.state.formData.interestRate}%</Bold> per the terms in the contract on the previous page. Are you sure you want to do this?
			</span>
		);
		return (
			<MainWrapper>
				<Header title={'Request a loan'} description={'Here\'s a quick description of what a debt order is and why you should request one.'} />
				<JSONSchemaForm
					schema={schema}
					uiSchema={uiSchema}
					formData={this.state.formData}
					buttonText="Generate Debt Order"
					onHandleChange={this.handleChange}
					onHandleSubmit={this.handleSubmit}
				/>
				<ConfirmationModal modal={this.state.confirmationModal} title="Please confirm" content={confirmationModalContent} onToggle={this.confirmationModalToggle} onSubmit={this.handleSignDebtOrder} closeButtonText="&#8592; Modify Request" submitButtonText="Complete Request" />
			</MainWrapper>
		);
	}
}

export {RequestLoanWeb3};
