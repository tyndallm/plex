import * as React from 'react';
import { shallow } from 'enzyme';
import { ActiveDebtOrder } from '../../../../../../src/modules/Dashboard/Debts/ActiveDebtOrder/ActiveDebtOrder';
import {
	Wrapper,
	ImageContainer,
	IdenticonImage,
	DetailContainer,
	Amount,
	Url,
	StatusActive,
	StatusPending,
	Terms,
	RepaymentScheduleContainer,
	Title,
	Schedule,
	ScheduleIconContainer,
	ScheduleIcon,
	Strikethrough,
	PaymentDate,
	ShowMore,
	DetailLink,
	Drawer,
	InfoItem,
	InfoItemTitle,
	InfoItemContent,
	MakeRepaymentButton
} from '../../../../../../src/modules/Dashboard/Debts/ActiveDebtOrder/styledComponents';
import { Collapse } from 'reactstrap';
import {
	formatDate,
	formatTime,
	getIdenticonImgSrc,
	shortenString,
	amortizationUnitToFrequency,
	debtOrderFromJSON
} from '../../../../../../src/utils';
import { BigNumber } from 'bignumber.js';
import MockDharma from '../../../../../../__mocks__/dharma.js';
const pastIcon = require('../../../../../../src/assets/img/ok_circle.png');
const futureIcon = require('../../../../../../src/assets/img/circle_outline.png');

describe('<ActiveDebtOrder />', () => {
	let dharma;
	const debtOrder = {
		json: "{\"principalToken\":\"0x9b62bd396837417ce319e2e5c8845a5a960010ea\",\"principalAmount\":\"10\",\"termsContract\":\"0x1c907384489d939400fa5c6571d8aad778213d74\",\"termsContractParameters\":\"0x0000000000000000000000000000008500000000000000000000000000000064\",\"kernelVersion\":\"0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f\",\"issuanceVersion\":\"0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de\",\"debtor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"debtorFee\":\"0\",\"creditor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"creditorFee\":\"0\",\"relayer\":\"0x0000000000000000000000000000000000000000\",\"relayerFee\":\"0\",\"underwriter\":\"0x0000000000000000000000000000000000000000\",\"underwriterFee\":\"0\",\"underwriterRiskRating\":\"0\",\"expirationTimestampInSec\":\"1524613355\",\"salt\":\"0\",\"debtorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"creditorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"underwriterSignature\":{\"r\":\"\",\"s\":\"\",\"v\":0}}",
		principalTokenSymbol: 'REP',
		description: 'Hello, Can I borrow some REP please?',
		issuanceHash: '0x89e9eac37c5f14b657c69ccd891704b3236b84b9ca1d449bd09c5fbaa24afebf',
		fillLoanShortUrl: 'http://bit.ly/2I4bahM',
		repaidAmount: new BigNumber(4),
		termLength: new BigNumber(100),
		interestRate: new BigNumber(12.3),
		amortizationUnit: 'hours',
		status: 'active'
	};

	beforeEach(() => {
		dharma = new MockDharma();
	});

	describe('#render', () => {
		let wrapper;
		let props;
		beforeEach(() => {
			props = { dharma, debtOrder };
			wrapper = shallow(<ActiveDebtOrder {... props} />);
		});

		it('should render successfully', () => {
			expect(wrapper.length).toEqual(1);
		});

		describe('<ImageContainer />', () => {
			it('should render', () => {
				expect(wrapper.find(ImageContainer).length).toEqual(1);
			});

			it('should render a <IdenticonImage />', () => {
				const identiconImgSrc = getIdenticonImgSrc(props.debtOrder.issuanceHash, 60, 0.1);
				expect(wrapper.find(ImageContainer).find(IdenticonImage).length).toEqual(1);
				expect(wrapper.find(ImageContainer).find(IdenticonImage).prop('src')).toEqual(identiconImgSrc);
			});
		});

		describe('<DetailContainer />', () => {
			let detailContainer;
			beforeEach(() => {
				detailContainer = wrapper.find(DetailContainer);
			});

			it('should render', () => {
				expect(detailContainer.length).toEqual(1);
			});

			it('should render correct <Amount />', () => {
				const debtOrderInfo = debtOrderFromJSON(props.debtOrder.json);
				const amount = [debtOrderInfo.principalAmount.toNumber(), ' ', props.debtOrder.principalTokenSymbol];
				expect(detailContainer.find(Amount).length).toEqual(1);
				expect(detailContainer.find(Amount).get(0).props.children).toEqual(amount);
			});

			it('should render correct <DetailLink />', () => {
				expect(detailContainer.find(Url).find(DetailLink).length).toEqual(1);
				expect(detailContainer.find(Url).find(DetailLink).prop('to')).toEqual('/request/success/' + props.debtOrder.issuanceHash);
				expect(detailContainer.find(Url).find(DetailLink).get(0).props.children).toEqual(shortenString(props.debtOrder.issuanceHash));
			});

			it('should render a <MakeRepaymentButton /> if status active', () => {
				expect(detailContainer.find(MakeRepaymentButton).length).toEqual(1);
			});

			it('should render <StatusActive /> if active', () => {
				expect(detailContainer.find(StatusActive).length).toEqual(1);
			});

			it('should not render a <MakeRepaymentButton /> if status not active', () => {
				props.debtOrder.status = 'pending';
				wrapper.setProps({ props });
				detailContainer = wrapper.find(DetailContainer);
				expect(detailContainer.find(MakeRepaymentButton).length).toEqual(0);
			});

			it('should render <StatusPending /> if pending', () => {
				expect(detailContainer.find(StatusPending).length).toEqual(1);
			});

			it('should render a <Terms />', () => {
				expect(detailContainer.find(Terms).length).toEqual(1);
			});
		});

		describe('<RepaymentScheduleContainer />', () => {
			it('should render', () => {
				expect(wrapper.find(RepaymentScheduleContainer).length).toEqual(1);
			});

			it('should have class .active when status is active', () => {
				props.debtOrder.status = 'active';
				wrapper.setProps({ props });
				expect(wrapper.find(RepaymentScheduleContainer).hasClass('active')).toEqual(true);
			});

			it('should not have class .active when status is pending', () => {
				props.debtOrder.status = 'pending';
				wrapper.setProps({ props });
				expect(wrapper.find(RepaymentScheduleContainer).hasClass('active')).toEqual(false);
				props.debtOrder.status = 'active';
				wrapper.setProps({ props });
			});

			it('should render a <Title />', () => {
				expect(wrapper.find(RepaymentScheduleContainer).find(Title).length).toEqual(1);
			});

			describe('<Schedule />', () => {
				it('should render', () => {
					wrapper.setState({ repaymentSchedule: [1553557371] });
					expect(wrapper.find(Schedule).length).toEqual(1);
				});

				it('should render a <ScheduleContainer />', () => {
					wrapper.setState({ repaymentSchedule: [1553557371] });
					expect(wrapper.find(Schedule).first().find(ScheduleIconContainer).length).toEqual(1);
				});

				it('should render pastIcon <ScheduleIcon />', () => {
					wrapper.setState({ repaymentSchedule: [0] });
					expect(wrapper.find(Schedule).first().find(ScheduleIconContainer).find(ScheduleIcon).length).toEqual(1);
					expect(wrapper.find(Schedule).first().find(ScheduleIconContainer).find(ScheduleIcon).prop('src')).toEqual(pastIcon);
				});

				it('should render futureIcon <ScheduleIcon />', () => {
					wrapper.setState({ repaymentSchedule: [2553557371] });
					expect(wrapper.find(Schedule).first().find(ScheduleIconContainer).find(ScheduleIcon).length).toEqual(1);
					expect(wrapper.find(Schedule).first().find(ScheduleIconContainer).find(ScheduleIcon).prop('src')).toEqual(futureIcon);
				});

				it('should render time in <PaymentDate />', () => {
					wrapper.setState({ repaymentSchedule: [2553557371] });
					debtOrder.amortizationUnit = 'hours';
					wrapper.setProps({ debtOrder });
					const expectedValue = formatTime(2553557371);
					expect(wrapper.find(Schedule).first().find(PaymentDate).length).toEqual(1);
					expect(wrapper.find(Schedule).first().find(PaymentDate).get(0).props.children).toEqual(expectedValue);
				});

				it('should render date in <PaymentDate />', () => {
					wrapper.setState({ repaymentSchedule: [2553557371] });
					debtOrder.amortizationUnit = 'days';
					wrapper.setProps({ debtOrder });
					const expectedValue = formatDate(2553557371);
					expect(wrapper.find(Schedule).first().find(PaymentDate).length).toEqual(1);
					expect(wrapper.find(Schedule).first().find(PaymentDate).get(0).props.children).toEqual(expectedValue);
				});
			});
		});

		describe('<Collapse />', () => {
			let collapse;
			let debtOrderInfo;
			beforeEach(() => {
				debtOrderInfo = debtOrderFromJSON(props.debtOrder.json);
				collapse = wrapper.find(Collapse);
			});

			it('should render', () => {
				expect(collapse.length).toEqual(1);
			});

			it('should render 6 <InfoItem />', () => {
				expect(collapse.find(InfoItem).length).toEqual(6);
			});

			it('1st <InfoItem /> should render Requested info', () => {
				const elm = collapse.find(InfoItem).at(0);
				expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Requested');
				const content = debtOrderInfo.principalAmount.toNumber() + ' ' + props.debtOrder.principalTokenSymbol;
				expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
			});

			it('2nd <InfoItem /> should render Repaid info', () => {
				const elm = collapse.find(InfoItem).at(1);
				expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Repaid');
				const content = props.debtOrder.repaidAmount.toNumber() + ' ' + props.debtOrder.principalTokenSymbol;
				expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
			});

			it('3rd <InfoItem /> should render Term Length info', () => {
				const elm = collapse.find(InfoItem).at(2);
				expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Term Length');
				const content = props.debtOrder.termLength.toNumber() + ' ' + props.debtOrder.amortizationUnit;
				expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
			});

			it('4th <InfoItem /> should render Interest Rate info', () => {
				const elm = collapse.find(InfoItem).at(3);
				expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Interest Rate');
				const content = props.debtOrder.interestRate.toNumber() + '%';
				expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
			});

			it('5th <InfoItem /> should render Installment Frequency info', () => {
				const elm = collapse.find(InfoItem).at(4);
				expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Installment Frequency');
				const content = amortizationUnitToFrequency(props.debtOrder.amortizationUnit);
				expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
			});

			it('6th <InfoItem /> should render Description info', () => {
				const elm = collapse.find(InfoItem).at(5);
				expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Description');
				const content = props.debtOrder.description;
				expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
			});
		});
	});

	describe('#componentDidMount', () => {
		it('should not call getRepaymentSchedule when there is no dharma and debtOrder', async () => {
			const props = {};
			const spy = jest.spyOn(ActiveDebtOrder.prototype, 'getRepaymentSchedule');
			const wrapper = shallow(<ActiveDebtOrder {... props} />);
			await expect(spy).not.toHaveBeenCalled();
			spy.mockRestore();
		});

		it('should call getRepaymentSchedule when there is dharma and debtOrder', async () => {
			const props = { dharma, debtOrder };
			const spy = jest.spyOn(ActiveDebtOrder.prototype, 'getRepaymentSchedule');
			const wrapper = shallow(<ActiveDebtOrder {... props} />);
			await expect(spy).toHaveBeenCalledWith(dharma, debtOrder);
			spy.mockRestore();
		});
	});

	describe('#componentWillReceiveProps', () => {
		it('should not call getRepaymentSchedule when there is no dharma and debtOrder', async () => {
			const props = {};
			const spy = jest.spyOn(ActiveDebtOrder.prototype, 'getRepaymentSchedule');
			const wrapper = shallow(<ActiveDebtOrder {... props} />);
			wrapper.setProps({ dharma: null, debtOrder: null });
			await expect(spy).not.toHaveBeenCalled();
			spy.mockRestore();
		});

		it('should not call getRepaymentSchedule when there is no dharma and debtOrder', async () => {
			const props = {};
			const spy = jest.spyOn(ActiveDebtOrder.prototype, 'getRepaymentSchedule');
			const wrapper = shallow(<ActiveDebtOrder {... props} />);
			wrapper.setProps({ dharma, debtOrder });
			await expect(spy).toHaveBeenCalledWith(dharma, debtOrder);
			spy.mockRestore();
		});
	});

	describe('#getRepaymentSchedule', () => {
		it('should call Dharma#getDebtRegistryEntry', async () => {
			const props = { dharma, debtOrder };
			const wrapper = shallow(<ActiveDebtOrder {... props} />);
			await wrapper.instance().getRepaymentSchedule(props.dharma, props.debtOrder);
			await expect(dharma.servicing.getDebtRegistryEntry).toHaveBeenCalledWith(props.debtOrder.issuanceHash);
		});

		it('should call Dharma#getRepaymentSchedule', async () => {
			const props = { dharma, debtOrder };
			const wrapper = shallow(<ActiveDebtOrder {... props} />);
			await wrapper.instance().getRepaymentSchedule(props.dharma, props.debtOrder);
			await expect(dharma.adapters.simpleInterestLoan.getRepaymentSchedule).toHaveBeenCalled();
		});

		it('should call setState', async () => {
			const props = { dharma, debtOrder };
			const spy = jest.spyOn(ActiveDebtOrder.prototype, 'setState');
			const wrapper = shallow(<ActiveDebtOrder {... props} />);
			const expectedRepaymentSchedule = await dharma.adapters.simpleInterestLoan.getRepaymentSchedule({});
			await wrapper.instance().getRepaymentSchedule(props.dharma, props.debtOrder);
			await expect(spy).toHaveBeenCalledWith({ repaymentSchedule: expectedRepaymentSchedule });
			spy.mockRestore();
		});
	});

	describe('#onClick Wrapper', () => {
		it('should call toggleDrawer on click', () => {
			const props = { dharma, debtOrder };
			const spy = jest.spyOn(ActiveDebtOrder.prototype, 'toggleDrawer');
			const wrapper = shallow(<ActiveDebtOrder {... props} />);
			wrapper.simulate('click');
			expect(spy).toHaveBeenCalled();
			spy.mockRestore();
		});

		it('toggleDrawer should call setState', () => {
			const props = { dharma, debtOrder };
			const spy = jest.spyOn(ActiveDebtOrder.prototype, 'setState');
			const wrapper = shallow(<ActiveDebtOrder {... props} />);
			const collapse = wrapper.state('collapse');
			wrapper.simulate('click');
			expect(spy).toHaveBeenCalledWith({collapse: !collapse});
			spy.mockRestore();
		});
	});

	describe('#onClick <MakeRepaymentButton />', () => {
		it('should call makeRepayment', () => {
			const props = { dharma, debtOrder };
			const spy = jest.spyOn(ActiveDebtOrder.prototype, 'makeRepayment');
			const wrapper = shallow(<ActiveDebtOrder {... props} />);
			const event = {
				stopPropagation: jest.fn()
			};
			wrapper.find(MakeRepaymentButton).simulate('click', event);
			expect(spy).toHaveBeenCalledWith(event);
			spy.mockRestore();
		});
	});
});
