import * as React from 'react';
import { shallow } from 'enzyme';
import { PaperLayout } from '../../../../src/layouts/PaperLayout';

describe('<PaperLayout />', () => {
	it('should render the component', () => {
		const wrapper = shallow(<PaperLayout />);
		expect(wrapper.length).toEqual(1);
	});
});
