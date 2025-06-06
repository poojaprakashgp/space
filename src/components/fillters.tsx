import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  filters, // Add filters to the destructured props
}: AllFiltersProps) => {
  const { section } = content || {};
  const [checkboxData, setCheckboxData] = useState(section);

  const filtersRef = useRef<HTMLDivElement>(null);

  const resetCheckboxData = useCallback(() => {
    setCheckboxData(section);
    handleAllFiltersClearAll();
  }, [section, handleAllFiltersClearAll]);

  const handleCheckboxChange = useCallback(
    (category: string, optionId: string, checked: boolean) => {
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
    },
    [setCheckboxData]
  );

  useEffect(() => {
    const selected = checkboxData?.flatMap(
      (section) => section?.options?.filter((option) => option.selected) ?? []
    );
    handleSelectedAllFiltersChange(selected ?? []);
  }, [checkboxData, handleSelectedAllFiltersChange]);

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
      <div key={category_id} className='filter-list__category'>
        <h3 className='filter-list__header'>{title}</h3>
        <div className='filter-list__filters'>
          {options.map((option: Options) => {
            const { id, title, value, selected } = option;

            return (
              <div key={id} className='filter-list__filter'>
                <Checkbox
                  label={title}
                  value={value}
                  selected={selected}
                  onChange={(selected) => {
                    handleCheckboxChange(
                      category_id,
                      id,
                      selected.currentTarget.checked
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
      section.options?.some((option) => option.selected)
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
          size='large'
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
    <div
      ref={filtersRef}
      className={`filters-list ${!showAllFilters ? 'collapsed' : ''}`}
    >
      <div className='filters-list__filter-list'>
        <div className='filter-list'>
          {checkboxData?.map((category) => renderCategory(category))}
        </div>

        <div className='filters-list__filter-btns'>
          {ctas?.map((cta) => renderCTAButton(cta))}
        </div>
      </div>
    </div>
  );
};

export default AllFilters;
