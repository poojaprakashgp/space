import React from 'react';
import { TabsProps } from './common/types';
import { TabsWrapper, TabsButtonWrapper, TabsButton, TabsLabel, TabsContentWrapper } from './common/styledComponents';

/**
 * Tabs component that allows users to switch between multiple views.
 * 
 * @param {TabsProps} props - The properties for the Tabs component.
 * @returns {JSX.Element} The rendered Tabs component.
 */

const Tabs: React.FC<TabsProps> = ({
  children,
  onTabClick,
  selected = 0,
  setSelected,
  tabs,
}) => {
  return (
    <TabsWrapper id="tabs-wrapper">
      <TabsButtonWrapper id="tabs-button-wrapper">
        {tabs.map((tab, index) => (
          <TabsButton
            id="tabs-button"
            isSelected={index === selected}
            key={`TabButton-${tab.label}`}
            onClick={() => (
              typeof onTabClick === 'function'
                ? onTabClick(index)
                : setSelected(index)
            )}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                e.preventDefault();
                if (typeof onTabClick === 'function') {
                  onTabClick(index);
                } else {
                  setSelected(index);
                }
              }
            }}
            tabIndex={0}
          >
            <TabsLabel id="tabs-label">{tab.label}</TabsLabel>
          </TabsButton>
        ))}
      </TabsButtonWrapper>
      <TabsContentWrapper id="tabs-content-wrapper" hasChildren={!!children}>
        {children}
      </TabsContentWrapper>
    </TabsWrapper>
  );
};

export { Tabs };


import React from 'react';
import { TabsProps } from './common/types';
import './Tabs.scss';

/**
 * Tabs component that allows users to switch between multiple views.
 * 
 * @param {TabsProps} props - The properties for the Tabs component.
 * @returns {JSX.Element} The rendered Tabs component.
 */

const Tabs: React.FC<TabsProps> = ({
  children,
  onTabClick,
  selected = 0,
  setSelected,
  tabs,
}) => {
  return (
    <div className="tabs-wrapper" id="tabs-wrapper">
      <div className="tabs-button-wrapper" id="tabs-button-wrapper">
        {tabs.map((tab, index) => (
          <button
            className={`tabs-button ${index === selected ? 'selected' : ''}`}
            id="tabs-button"
            key={`TabButton-${tab.label}`}
            onClick={() => (
              typeof onTabClick === 'function'
                ? onTabClick(index)
                : setSelected(index)
            )}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                e.preventDefault();
                if (typeof onTabClick === 'function') {
                  onTabClick(index);
                } else {
                  setSelected(index);
                }
              }
            }}
            tabIndex={0}
          >
            <span className="tabs-label" id="tabs-label">{tab.label}</span>
          </button>
        ))}
      </div>
      <div
        className={`tabs-content-wrapper ${children ? 'has-children' : ''}`}
        id="tabs-content-wrapper"
      >
        {children}
      </div>
    </div>
  );
};

export { Tabs };

.tabs-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.tabs-button-wrapper {
  display: flex;
  gap: 8px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 8px;
  margin-bottom: 16px;
}

.tabs-button {
  background: transparent;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
  }

  &.selected {
    color: #000;
    border-color: #000;
  }
}

.tabs-label {
  pointer-events: none;
}

.tabs-content-wrapper {
  &.has-children {
    padding-top: 12px;
  }
}

