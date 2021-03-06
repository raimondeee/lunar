import React from 'react';
import { shallow } from 'enzyme';
import IconAdd from '../../../icons/src/interface/IconAdd';
import SideBar, { Item } from '../../src/components/SideBar';

describe('<SideBar />', () => {
  it('errors for invalid children', () => {
    expect(() => {
      shallow(
        <SideBar accessibilityLabel="Test">
          <div />
        </SideBar>,
      );
    }).toThrowError();
  });

  it('renders a nav with accessibility', () => {
    const wrapper = shallow(
      <SideBar accessibilityLabel="Test">
        <Item icon={<IconAdd />} />
      </SideBar>,
    ).dive();

    expect(wrapper.is('nav')).toBe(true);
    expect(wrapper.find('ul').prop('role')).toBe('menubar');
    expect(wrapper.find('ul').prop('aria-label')).toBe('Test');
  });

  it('renders items', () => {
    const wrapper = shallow(
      <SideBar accessibilityLabel="Test">
        <Item icon={<IconAdd />} />
        <Item icon={<IconAdd />} />
        <Item icon={<IconAdd />} />
      </SideBar>,
    ).dive();

    expect(wrapper.find(Item)).toHaveLength(3);
  });
});
