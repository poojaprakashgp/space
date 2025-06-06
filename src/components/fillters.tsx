import React, { useEffect, useState } from 'react';
import Checkbox from '@vds/core/checkboxes/checkbox';
import TextLinkButton from '@vds/core/buttons/text-link';
import VDSButton from '@vds/core/buttons/button/';
import { AllFiltersProps, Cta, Options, Section } from '@/common/types';

const AllFilters = ({
  showAllFilters,
  ctas,
  content,
  handleSelectedAllFiltersChange,
  phoneListLen,
  handleApplyFilters,
  handleAllFiltersClearAll,
  handleApplyFiltersCheck,
  filters,
}: AllFiltersProps) => {
  const { section } = content || {};
  const [checkboxData, setCheckboxData] = useState(section);

  // Toggle body scroll class
  useEffect(() => {
    if (showAllFilters) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [showAllFilters]);

  const resetCheckboxData = () => {
    setCheckboxData(section);
    handleAllFiltersClearAll();
  };

  const handleCheckboxChange = (
    category: string,
    optionId: string,
    checked: boolean,
  ) => {
    setCheckboxData((prevData) => {
      const updatedData = prevData?.map((section) => {
        if (section.id === category) {
          const updatedOptions = (section.options ?? []).map((option) => {
            if (option.id === optionId) {
              return { ...option, selected: checked };
            }
            return option;
          });
          return { ...section, options: updatedOptions };
        }
        return section;
      });

      return updatedData;
    });
  };

  useEffect(() => {
    const selected = checkboxData?.flatMap(
      (section) => section?.options?.filter((option) => option.selected) ?? [],
    );
    handleSelectedAllFiltersChange(selected ?? []);
  }, [checkboxData]);

  useEffect(() => {
    if (!filters || !checkboxData) return;
    setCheckboxData((prevData) => {
      if (!prevData) return prevData;
      return prevData.map((section) => {
        const updatedOptions = (section.options ?? []).map((option) => {
          // Check if this option's title exists in filters array
          let isInFilters = filters.includes(option.title);
          // If option is selected but not in filters, uncheck it
          // If option is not selected but is in filters, check it
          if (
            (filters.includes('Under $300') &&
              option.attr === 'offerPrice' &&
              ['lessthan50', 'between50to100'].includes(option.id)) ||
            (filters.includes('Over $300') &&
              option.attr === 'offerPrice' &&
              ['morethan300'].includes(option.id))
          ) {
            isInFilters = true;
          }
          return {
            ...option,
            selected: isInFilters,
          };
        });
        return { ...section, options: updatedOptions };
      });
    });
  }, [filters]);

  useEffect(() => {
    setCheckboxData(section);
  }, [section]);

  const renderCategory = (category: Section) => {
    const { id: category_id = '', title, options = [] } = category;

    return (
      <div key={category_id} className="filter-list__category">
        <h3 className="filter-list__header">{title}</h3>
        <div className="filter-list__filters">
          {options.map((option: Options) => {
            const { id, title, value, selected } = option;

            return (
              <div key={id} className="filter-list__filter">
                <Checkbox
                  label={title}
                  value={value}
                  selected={selected}
                  onChange={(selected) => {
                    handleCheckboxChange(
                      category_id,
                      id,
                      selected.currentTarget.checked,
                    );
                    selected.currentTarget.checked &&
                      handleApplyFiltersCheck(title);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCTAButton = (cta: Cta) => {
    const isAnyCheckboxSelected = checkboxData?.some((section) =>
      section.options?.some((option) => option.selected),
    );
    switch (cta.id) {
    case 'clear all':
      return (
        <TextLinkButton
          key={cta.id}
          onClick={() => {
            resetCheckboxData();
          }}
        >
          {cta.text}
        </TextLinkButton>
      );

    case 'apply':
      return (
        <VDSButton
          key={cta.id}
          size="large"
          disabled={phoneListLen < 1 || !isAnyCheckboxSelected}
          onClick={() => {
            handleApplyFilters();
          }}
        >
          {cta.text.replace('<<<totalOptions>>>', `${phoneListLen} options`)}
        </VDSButton>
      );

    default:
      return null;
    }
  };

  return (
    <div className={`filters-list ${!showAllFilters ? 'collapsed' : 'expanded'}`}>
      {showAllFilters && (
        <div className="filters-list__filter-list">
          <div className="filter-list">
            {checkboxData?.map((category) => renderCategory(category))}
          </div>

          <div className="filters-list__filter-btns">
            {ctas?.map((cta) => renderCTAButton(cta))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllFilters;
.filters-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--vds-space-4x);
  width: 100%;
  border-radius: 0px 0px 16px 16px;
  border: 1px solid var(--vds-color-gray-400);
  max-height: 600px;
  overflow: hidden;
  transition:
    max-height 0.2s ease,
    border-bottom 0.1s ease,
    border-radius 0.1s ease;

  &.collapsed {
    max-height: 0;
    border-bottom: 0;
    border-radius: 0px 0px 0px 0px;
  }

  &.expanded {
    height: calc(100vh - 300px);
    overflow: auto;
  }

  &__filter-list {
    display: flex;
    flex-direction: column;
    gap: var(--vds-space-4x);
    width: 100%;
    align-items: center;
    justify-content: center;
    opacity: 1;
    padding: var(--vds-space-8x);
    background-color: #eeeef7;
    transition: opacity 0.3s ease;

    .collapsed & {
      opacity: 0;
    }
  }

  .filter-list {
    display: flex;
    flex-direction: row;
    align-items: start;
    gap: var(--vds-space-16x);
    width: 100%;

    &__category {
      display: flex;
      flex-direction: column;
      align-items: start;
      gap: var(--vds-space-8x);
    }
    &__header {
      display: flex;
      flex-direction: column;
      font-size: 1.125rem;
    }

    &__filters {
      display: flex;
      flex-direction: column;
    }

    &__filter {
      height: 44px;
      label {
        display: flex;
        align-self: center;
        justify-content: flex-start;
        flex-direction: row;
        gap: var(--vds-space-2x);
        font-size: var(--vds-typography-body-large-fontsize);

        & > span {
          font-weight: var(--vds-typography-body-large-fontweight-regular);
          font-family: var(--font-family-medium);
          font-size: var(--base-font-size);
          &:hover {
            text-decoration: underline;
          }
        }

        > div > svg {
          display: none;
        }
      }
    }
  }

  &__filter-btns {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--vds-space-4x);
    span {
      font-family: var(--font-family-medium);
      font-size: var(--base-font-size);
    }

    & > button {
      background-color: #1a1c35 !important;
      font-size: var(--vds-typography-body-large-fontsize) !important;
      color: #e6fcf4 !important;
    }
  }
}
.disabled-all-filters {
  height: 1px;
  background-color: var(--vds-color-gray-400);
  margin: 0;
  border: none;
  width: 100%;
}

.no-scroll{
  overflow: hidden;
}
