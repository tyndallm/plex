import * as React from 'react';
import { shallow } from 'enzyme';
import { RequestLoanForm } from '../../../../../src/modules/RequestLoan/RequestLoanForm/RequestLoanForm';
import { PaperLayout } from '../../../../../src/layouts';
import { browserHistory } from 'react-router';
import {
	Header,
	JSONSchemaForm,
	MainWrapper,
	Bold,
	ConfirmationModal
} from '../../../../../src/components';
import MockWeb3 from '../../../../../__mocks__/web3';
import MockDharma from '../../../../../__mocks__/dharma.js';
import { BigNumber } from 'bignumber.js';
import {
	encodeUrlParams,
	debtOrderFromJSON,
	normalizeDebtOrder
} from '../../../../../src/utils';
import MockBitlyClient from '../../../../../__mocks__/BitlyClient';

describe('<RequestLoanForm />', () => {
	let web3;
	let dharma;
	let props;
	beforeEach(() => {
		web3 = new MockWeb3();
		dharma = new MockDharma();

		props = {
			web3,
			accounts: [],
			dharma,
			handleRequestDebtOrder: jest.fn(),
			handleSetError: jest.fn()
		};
	});

	describe('#render', () => {
		let wrapper;
		beforeEach(() => {
			wrapper = shallow(<RequestLoanForm {... props} />);
		});

		it('should render', () => {
			expect(wrapper.length).toEqual(1);
		});

		it('should render a <Header />', () => {
			expect(wrapper.find(PaperLayout).find(MainWrapper).find(Header).length).toEqual(1);
		});

		it('should render a <JSONSchemaForm />', () => {
			expect(wrapper.find(PaperLayout).find(MainWrapper).find(JSONSchemaForm).length).toEqual(1);
		});

		it('should render a <ConfirmationModal />', () => {
			expect(wrapper.find(PaperLayout).find(ConfirmationModal).length).toEqual(1);
		});
	});

	describe('#handleChange', () => {
		it('should set formData', () => {
			const spy = jest.spyOn(RequestLoanForm.prototype, 'setState');
			const wrapper = shallow(<RequestLoanForm {... props} />);
			const formData = {};
			wrapper.instance().handleChange(formData);
			expect(spy).toHaveBeenCalledWith({ formData });
		});

		it('should set principalAmount', () => {
			const spy = jest.spyOn(RequestLoanForm.prototype, 'setState');
			const wrapper = shallow(<RequestLoanForm {... props} />);
			const formData = {
				loan: {
					principalAmount: new BigNumber(10)
				}
			};
			wrapper.instance().handleChange(formData);
			expect(spy).toHaveBeenCalledWith({ principalAmount: formData.loan.principalAmount });
		});

		it('should set principalTokenSymbol', () => {
			const spy = jest.spyOn(RequestLoanForm.prototype, 'setState');
			const wrapper = shallow(<RequestLoanForm {... props} />);
			const formData = {
				loan: {
					principalTokenSymbol: 'REP'
				}
			};
			wrapper.instance().handleChange(formData);
			expect(spy).toHaveBeenCalledWith({ principalTokenSymbol: formData.loan.principalTokenSymbol });
		});

		it('should set description', () => {
			const spy = jest.spyOn(RequestLoanForm.prototype, 'setState');
			const wrapper = shallow(<RequestLoanForm {... props} />);
			const formData = {
				loan: {
					description: 'Some description'
				}
			};
			wrapper.instance().handleChange(formData);
			expect(spy).toHaveBeenCalledWith({ description: formData.loan.description });
		});

		it('should set interestRate', () => {
			const spy = jest.spyOn(RequestLoanForm.prototype, 'setState');
			const wrapper = shallow(<RequestLoanForm {... props} />);
			const formData = {
				terms: {
					interestRate: new BigNumber(3.2)
				}
			};
			wrapper.instance().handleChange(formData);
			expect(spy).toHaveBeenCalledWith({ interestRate: formData.terms.interestRate });
		});
	});

	describe('#handleSubmit', () => {
		let formData;
		beforeEach(() => {
			formData = {
				loan: {
					principalAmount: 10,
					principalTokenSymbol: 'REP'
				},
				terms: {
					interestRate: 10,
					amortizationUnit: 'hours',
					termLength: 10
				}
			};
		});
		it('should clear error', async () => {
			const wrapper = shallow(<RequestLoanForm {... props} />);
			wrapper.instance().handleChange(formData);
			await wrapper.instance().handleSubmit();
			expect(props.handleSetError).toHaveBeenCalledWith('');
		});

		it('should call Dharma#toDebtOrder', async () => {
			const wrapper = shallow(<RequestLoanForm {... props} />);
			wrapper.instance().handleChange(formData);
			const expectedSimpleInterestLoan = {
				principalTokenSymbol: formData.loan.principalTokenSymbol,
				principalAmount: new BigNumber(formData.loan.principalAmount),
				interestRate: new BigNumber(formData.terms.interestRate),
				amortizationUnit: formData.terms.amortizationUnit,
				termLength: new BigNumber(formData.terms.termLength)
			};
			await wrapper.instance().handleSubmit();
			await expect(dharma.adapters.simpleInterestLoan.toDebtOrder).toHaveBeenCalledWith(expectedSimpleInterestLoan);
		});

		it('should call Dharma#getIssuanceHash', async () => {
			const wrapper = shallow(<RequestLoanForm {... props} />);
			wrapper.instance().handleChange(formData);
			const simpleInterestLoan = {
				principalTokenSymbol: formData.loan.principalTokenSymbol,
				principalAmount: new BigNumber(formData.loan.principalAmount),
				interestRate: new BigNumber(formData.terms.interestRate),
				amortizationUnit: formData.terms.amortizationUnit,
				termLength: new BigNumber(formData.terms.termLength)
			};
			const debtOrder = await dharma.adapters.simpleInterestLoan.toDebtOrder(simpleInterestLoan);
			const accounts = ['account1'];
			wrapper.setProps({ accounts });
			await wrapper.instance().handleSubmit();
			debtOrder.debtor = accounts[0];
			await expect(dharma.order.getIssuanceHash).toHaveBeenCalledWith(debtOrder);
		});

		it('should call set debtOrder and issuanceHash', async () => {
			const spy = jest.spyOn(RequestLoanForm.prototype, 'setState');
			const wrapper = shallow(<RequestLoanForm {... props} />);
			wrapper.instance().handleChange(formData);
			const simpleInterestLoan = {
				principalTokenSymbol: formData.loan.principalTokenSymbol,
				principalAmount: new BigNumber(formData.loan.principalAmount),
				interestRate: new BigNumber(formData.terms.interestRate),
				amortizationUnit: formData.terms.amortizationUnit,
				termLength: new BigNumber(formData.terms.termLength)
			};
			const debtOrder = await dharma.adapters.simpleInterestLoan.toDebtOrder(simpleInterestLoan);
			const accounts = ['account1'];
			wrapper.setProps({ accounts });
			await wrapper.instance().handleSubmit();
			debtOrder.debtor = accounts[0];
			const issuanceHash = await dharma.order.getIssuanceHash(debtOrder);
			expect(spy).toHaveBeenCalledWith({ debtOrder: JSON.stringify(debtOrder), issuanceHash});
		});

		it('should call confirmationModalToggle', async () => {
			const spy = jest.spyOn(RequestLoanForm.prototype, 'confirmationModalToggle');
			const wrapper = shallow(<RequestLoanForm {... props} />);
			wrapper.instance().handleChange(formData);
			await wrapper.instance().handleSubmit();
			expect(spy).toHaveBeenCalled();
		});

		it('should call handleSetError when there is an error', async () => {
			dharma.adapters.simpleInterestLoan.toDebtOrder = jest.fn(async (simpleInterestLoan) => throw new Error());
			const wrapper = shallow(<RequestLoanForm {... props} />);
			wrapper.instance().handleChange(formData);
			await wrapper.instance().handleSubmit();
			expect(props.handleSetError).toHaveBeenCalledWith('Unable to generate Debt Order');
			dharma.adapters.simpleInterestLoan.toDebtOrder = jest.fn(async (simpleInterestLoan) => return {});
		});
	});

	describe('#handleSignDebtOrder', () => {
		let debtOrder;
		beforeEach(() => {
			debtOrder = "{\"principalToken\":\"0x9b62bd396837417ce319e2e5c8845a5a960010ea\",\"principalAmount\":\"10\",\"termsContract\":\"0x1c907384489d939400fa5c6571d8aad778213d74\",\"termsContractParameters\":\"0x0000000000000000000000000000008500000000000000000000000000000064\",\"kernelVersion\":\"0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f\",\"issuanceVersion\":\"0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de\",\"debtor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"debtorFee\":\"0\",\"creditor\":\"0x0000000000000000000000000000000000000000\",\"creditorFee\":\"0\",\"relayer\":\"0x0000000000000000000000000000000000000000\",\"relayerFee\":\"0\",\"underwriter\":\"0x0000000000000000000000000000000000000000\",\"underwriterFee\":\"0\",\"underwriterRiskRating\":\"0\",\"expirationTimestampInSec\":\"1524613355\",\"salt\":\"0\",\"debtorSignature\":{\"v\":1,\"r\":\"sometext\",\"s\":\"sometext\"},\"creditorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"underwriterSignature\":{\"r\":\"\",\"s\":\"\",\"v\":0}}";
		});

		it('should clear error', async () => {
			const wrapper = shallow(<RequestLoanForm {... props} />);
			await wrapper.instance().handleSignDebtOrder();
			expect(props.handleSetError).toHaveBeenCalledWith('');
		});

		it('should set error when there is no debtOrder', async () => {
			const wrapper = shallow(<RequestLoanForm {... props} />);
			wrapper.setState({ debtOrder: null });
			await wrapper.instance().handleSignDebtOrder();
			expect(props.handleSetError).toHaveBeenCalledWith('No Debt Order has been generated yet');
		});

		it('should call Dharma#asDebtor', async () => {
			const wrapper = shallow(<RequestLoanForm {... props} />);
			wrapper.setState({ debtOrder });
			const expectedDebtOrder = debtOrderFromJSON(debtOrder);
			await wrapper.instance().handleSignDebtOrder();
			await expect(dharma.sign.asDebtor).toHaveBeenCalledWith(expectedDebtOrder, true);
		});

		it('should call bitly.shorten', async () => {
			const wrapper = shallow(<RequestLoanForm {... props} />);
			const bitly = new MockBitlyClient('accesstoken');
			wrapper.setState({ debtOrder, bitly });
			await wrapper.instance().handleSignDebtOrder();
			await expect(bitly.shorten).toHaveBeenCalled();
		});

		it('should set error when bitly fails', async () => {
			const wrapper = shallow(<RequestLoanForm {... props} />);
			const bitly = new MockBitlyClient('accesstoken');
			bitly.shorten = jest.fn(async (value) => {
				return { status_code: 400 };
			});
			wrapper.setState({ debtOrder, bitly });
			await wrapper.instance().handleSignDebtOrder();
			await expect(props.handleSetError).toHaveBeenCalledWith('Unable to shorten the url');
		});
	});

	describe('#confirmationModalToggle', () => {
		it('should set confirmationModal state', () => {
			const spy = jest.spyOn(RequestLoanForm.prototype, 'setState');
			const wrapper = shallow(<RequestLoanForm {... props} />);
			const confirmationModal = wrapper.state('confirmationModal');
			wrapper.instance().confirmationModalToggle();
			expect(spy).toHaveBeenCalledWith({ confirmationModal: !confirmationModal });
		});
	});

	describe('#validateForm', () => {
		it('should call addError if there is error', () => {
			const errors = {
				terms: {
					termLength: {
						addError: jest.fn()
					}
				}
			};
			const formData = {
				terms: {
					termLength: 10.2
				}
			};
			const wrapper = shallow(<RequestLoanForm {... props} />);
			wrapper.instance().validateForm(formData, errors);
			expect(errors.terms.termLength.addError).toHaveBeenCalledWith('Term length can not have decimals.');
		});

		it('should not call addError if there is no error', () => {
			const errors = {
				terms: {
					termLength: {
						addError: jest.fn()
					}
				}
			};
			const formData = {
				terms: {
					termLength: 10
				}
			};
			const wrapper = shallow(<RequestLoanForm {... props} />);
			wrapper.instance().validateForm(formData, errors);
			expect(errors.terms.termLength.addError).not.toHaveBeenCalled();
		});
	});
});
