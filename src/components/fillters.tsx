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
  filters,
}: AllFiltersProps) => {
  const { section } = content || {};
  const [checkboxData, setCheckboxData] = useState(section);
  const filtersRef = useRef<HTMLDivElement>(null);

  // Lock background scroll when dropdown is open
  useEffect(() => {
    if (showAllFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showAllFilters]);

  // Dynamically calculate height
  const [maxHeight, setMaxHeight] = useState<number>(600); // fallback
  useEffect(() => {
    const updateMaxHeight = () => {
      if (filtersRef.current) {
        const rect = filtersRef.current.getBoundingClientRect();
        const availableSpace = window.innerHeight - rect.top - 20; // 20px padding
        setMaxHeight(Math.min(600, availableSpace));
      }
    };

    if (showAllFilters) {
      updateMaxHeight();
      window.addEventListener('resize', updateMaxHeight);
    }

    return () => {
      window.removeEventListener('resize', updateMaxHeight);
    };
  }, [showAllFilters]);

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
    []
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
          let isInFilters = filters.includes(option.title);

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

          return { ...option, selected: isInFilters };
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
      style={{
        position: 'fixed',
        top: '64px',
        right: 0,
        left: 0,
        zIndex: 1000,
        background: '#fff',
        maxHeight: showAllFilters ? `${maxHeight}px` : '0',
        overflowY: 'auto',
        transition: 'max-height 0.3s ease',
      }}
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
  filters,
}: AllFiltersProps) => {
  const { section } = content || {};
  const [checkboxData, setCheckboxData] = useState(section);
  const [maxHeight, setMaxHeight] = useState(600);
  const filtersRef = useRef<HTMLDivElement>(null);

  // Disable/Enable body scroll based on dropdown visibility
  useEffect(() => {
    if (showAllFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showAllFilters]);

  // Throttled max-height update
  useEffect(() => {
    let timeout: number;

    const updateMaxHeight = () => {
      if (filtersRef.current) {
        const rect = filtersRef.current.getBoundingClientRect();
        const availableSpace = window.innerHeight - rect.top - 20;
        const newHeight = Math.min(600, availableSpace);
        setMaxHeight((prev) => (prev !== newHeight ? newHeight : prev));
      }
    };

    const throttledResize = () => {
      clearTimeout(timeout);
      timeout = window.setTimeout(updateMaxHeight, 100);
    };

    if (showAllFilters) {
      updateMaxHeight();
      window.addEventListener('resize', throttledResize);
    }

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', throttledResize);
    };
  }, [showAllFilters]);

  const resetCheckboxData = useCallback(() => {
    setCheckboxData(section);
    handleAllFiltersClearAll();
  }, [section, handleAllFiltersClearAll]);

  const handleCheckboxChange = useCallback(
    (category: string, optionId: string, checked: boolean) => {
      setCheckboxData((prevData) =>
        prevData?.map((section) => {
          if (section.id === category) {
            const updatedOptions = (section.options ?? []).map((option) =>
              option.id === optionId ? { ...option, selected: checked } : option
            );
            return { ...section, options: updatedOptions };
          }
          return section;
        })
      );
    },
    []
  );

  useEffect(() => {
    const selected = checkboxData?.flatMap((section) =>
      section?.options?.filter((option) => option.selected) ?? []
    );
    handleSelectedAllFiltersChange(selected ?? []);
  }, [checkboxData, handleSelectedAllFiltersChange]);

  useEffect(() => {
    if (!filters || !checkboxData) return;
    setCheckboxData((prevData) =>
      prevData?.map((section) => {
        const updatedOptions = (section.options ?? []).map((option) => {
          let isInFilters = filters.includes(option.title);
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
      })
    );
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
          <TextLinkButton key={cta.id} onClick={resetCheckboxData}>
            {cta.text}
          </TextLinkButton>
        );

      case 'apply':
        return (
          <VDSButton
            key={cta.id}
            size='large'
            disabled={phoneListLen < 1 || !isAnyCheckboxSelected}
            onClick={handleApplyFilters}
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
      style={{
        maxHeight: showAllFilters ? `${maxHeight}px` : undefined,
        overflowY: showAllFilters ? 'auto' : undefined,
      }}
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


.filters-list {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
  background: white;
  z-index: 1000;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}

.filters-list.collapsed {
  display: none;
}

