import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TabHeader from './TabHeader';

const Tab = (props) => {
  const {
    items,
    tabChange,
    activeTabKey
  } = props;

  const [sections, setSections] = useState([]);

  useEffect(() => {
    setSections(items.filter(item => !item.shouldHide).map((item, index) => ({
      index, isOpen: item.key === activeTabKey, children: item.children, title: item.title, key: item.key,
    })));
  }, [activeTabKey, items]);

  const toggleSections = (updatedIndex) => {
    tabChange(sections[updatedIndex].key);
  };

  const tabHeaders = sections.map((item, index) => (
    <TabHeader
      key={item.key}
      active={item.isOpen}
      title={item.title}
      id={item.key}
      titleClick={() => { toggleSections(item.index); }}
    >
      {item.children}
    </TabHeader>
  ));

  return (
    <div className="c-tab u-padding-small" data-testid="test-tab">
      <ul role="tablist" className="c-tab__list u-margin-none u-padding-none">
        {tabHeaders}
      </ul>
    </div>
  );
};

Tab.propTypes = {
  tabChange: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeTabKey: PropTypes.string.isRequired
};

Tab.defaultProps = {
  tabChange: () => {}
};

export default Tab;
