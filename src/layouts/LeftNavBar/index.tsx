import * as React from 'react';
import { IndexLink } from 'react-router';
import {
	Row,
	Nav,
	NavItem
} from 'reactstrap';
import {
	Wrapper,
	LogoContainer,
	BrandLogo,
	StyledCol,
	StyledLink,
	TitleFirst,
	TitleRest
} from './styledComponents';
import { TradingPermissionsContainer } from '../../components';

interface LinkItem {
	url: string;
	display: string;
}

interface Props {
	linkItems: LinkItem[];
}

class LeftNavBar extends React.Component<Props, {}> {
	render() {
		const { linkItems } = this.props;
		const linkItemRows = linkItems.map((link) =>
			(
				<StyledCol key={link.display}>
					<NavItem>
						<StyledLink to={link.url} className="nav-link" activeClassName="active">
							<TitleFirst>
								{link.display.indexOf(' ') >= 0 ? link.display.substr(0, link.display.indexOf(' ')) : link.display}
							</TitleFirst>
							<TitleRest>
								{link.display.indexOf(' ') >= 0 ? link.display.substr(link.display.indexOf(' ')) : ''}
							</TitleRest>
						</StyledLink>
					</NavItem>
				</StyledCol>
			)
		);

		return (
			<Wrapper>
				<LogoContainer>
					<IndexLink to="/">
						<BrandLogo src={require('../../assets/img/logo_icon_white.png')} />
					</IndexLink>
				</LogoContainer>
				<Nav>
					<Row>
						{linkItemRows}
					</Row>
				</Nav>
				<TradingPermissionsContainer className="left" />
			</Wrapper>
		);
	}
}

export default LeftNavBar;
