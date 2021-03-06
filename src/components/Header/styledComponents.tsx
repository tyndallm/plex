import styled from 'styled-components';

export const Description = styled.div`
	width: 460px;
	color: #002326;
	font-family: DIN;
	font-size: 17px;
	line-height: 25px;
	margin: 30px 0;
	word-wrap: break-word;

	& b {
		font-family: DIN-Bold;
	}

	@media only screen and (max-width: 480px) {
		width: 100%;
		font-size: 14px;
	}
`;
