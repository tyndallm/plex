import * as React from 'react';
import { InvestmentEntity } from '../../../../models';
// import { formatDate } from '../../../../utils';
import { Col } from 'reactstrap';
import { InvestmentRow } from './InvestmentRow';
import {
	Wrapper,
	Title,
	TableHeaderRow
} from './styledComponents';

interface Props {
	investments: InvestmentEntity[];
}

class InvestmentHistory extends React.Component<Props, {}> {
	render() {
		const  { investments } = this.props;
		return (
			<Wrapper>
				<Title>Past debts and loan request</Title>
				<TableHeaderRow>
					<Col xs="3" md="2">
						Amount
					</Col>
					<Col xs="3" md="2">
						ID
					</Col>
					<Col xs="3" md="4">
						Status
					</Col>
					<Col xs="3" md="4">
						Terms
					</Col>
				</TableHeaderRow>
				{
					investments.map((investment) => (
						<InvestmentRow investment={investment} key={investment.issuanceHash} />
					))
				}
			</Wrapper>
		);
	}
}

export { InvestmentHistory };
