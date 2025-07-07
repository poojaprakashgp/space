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
