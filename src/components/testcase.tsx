/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import React, { useEffect, useRef, useState } from 'react';
import BackButton from '@/common/molecules/BackButton/BackButton';
import CustomNextImage from '@/components/common/components/CustomNextImage';
import PhoneRecImg from '../../../../../../public/assets/tbv/phone_rec.svg';
import StarImg from '../../../../../../public/assets/tbv/star.svg';
import Button from '@/common/molecules/Button/Button';
import { PlanDetailsProps, PlanSummaryProps } from './common/types';
import SkeletonLoader from '@/common/molecules/SkeletonLoader/SkeletonLoader';

const PlanDetails = ({
  details: {
    content: { section = [{ id: '' }] },
  },
  setLoading,
  setAgenticPageLoader,
  ...args
}: PlanDetailsProps) => {
  const referrerPath =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('pdpReferPath') || ''
      : '';
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const img = imageRef.current;

    if (img?.complete && img?.naturalWidth !== 0) {
      // Image already loaded (from cache)
      setIsLoading(false); ///cover this under test cases
    }
  }, []);

  return (
    <div>
      <div>
        <BackButton
          ariaLabel="Current Plan"
          destination={referrerPath as string}
          onClick={() => {///cover this under test cases
            setLoading(true);
            setAgenticPageLoader('PDP');
          }}
        />
      </div>
      <div className="plan-recommendation">
        {section.map(
          ({ id: sectionId = '', ...sectionArgs }, index: number) => (
            <div key={`${sectionId}-${index}`}>
              {sectionId === 'plan_gallery' && (
                <div className="plan-recommendation__image plan-recommendation__image-wrapper">
                  {isLoading && (
                    <SkeletonLoader
                      variant="vertical"
                      width={300}
                      height={400}
                      marginTop={'50px'}
                    />
                  )}
                  {!hasError ? (
                    <CustomNextImage
                      ref={imageRef}
                      src={PhoneRecImg}
                      alt="plan_icon"
                      width={100}
                      height={100}
                      style={{ display: isLoading ? 'none' : 'block' }}
                      priority
                      onLoad={() => { ///cover this under test cases
                        setIsLoading(false);
                      }}
                      onError={() => {///cover this under test cases
                        setHasError(true);
                        setIsLoading(false);
                        console.error('PhoneRecImg failed to load');
                      }}
                    />
                  ) : (
                    !isLoading && (
                      <div className="plan-recommendation__no-image">
                        Image not available
                      </div>
                    )
                  )}
                </div>
              )}
              {sectionId === 'plan_details' && (
                <PlanSummary
                  content={sectionArgs.content || { section: [] }}
                  cta={sectionArgs.cta || { text: '' }}
                  selectedPlan={
                    sectionArgs.selectedPlan || {
                      recommendedPlans: {},
                      planTitlePrice: {},
                      planSummary: {},
                    }
                  }
                  {...args}
                />
              )}
            </div>
          ),
        )}
      </div>
    </div>
  );
};

const PlanSummary = ({
  content: { section = [] },
  cta: { text = '' },
  selectedPlan: {
    recommendedPlans = {
      title: '',
    },
    planTitlePrice = {
      title: '',
      price: {
        fullPrice: '',
        postText: '',
      },
    },
    planSummary = {
      title: '',
      content: {
        section: [],
      },
    },
  },
  handleChooseClick,
}: PlanSummaryProps) => {
  return (
    <div className="plan-recommendation__description">
      <div className="plan-desc">
        {section.map(({ id = '' }) => (
          <>
            {id === 'best_phone_for_you' && recommendedPlans.title && (
              <div className="plan-desc__best-plan">
                <CustomNextImage
                  src={StarImg}
                  alt="star"
                  width={15.78}
                  height={19.86}
                  className="mr-2"
                />
                <span className="plan-desc__best-plan-text">
                  {recommendedPlans.title}
                </span>
              </div>
            )}
            {id === 'plan_title_price' && planTitlePrice.title && (
              <>
                <h1 className="plan-desc__title">{planTitlePrice.title}</h1>
                <div className="plan-desc__plan">
                  <p className="plan-desc__postPrice">
                    {planTitlePrice.price.fullPrice}
                    {planTitlePrice.price.postText}
                  </p>
                </div>
              </>
            )}
            {id === 'main_summary' && (
              <div className="plan-desc__match">
                <h2 className="plan-desc__match-title">{'Details'}</h2>
                <ol className="plan-options__card-list">
                  {planSummary.content.section.map(
                    ({ title = '', body = '' }, index: number) => (
                      <li
                        key={`${title}-${index}`}
                        className="other-options__body"
                      >
                        {`${title} ${body}`}
                      </li>
                    ),
                  )}
                </ol>
              </div>
            )}
          </>
        ))}
        <Button
          className="plan-desc__button"
          primary={true}
          size="large"
          onClick={() =>
            handleChooseClick(
              planTitlePrice.price.fullPrice,
              planTitlePrice.title,
            )
          }
          label={text}
          dataGtmCta="add_to_cart"
          ariaLabel={`Choose ${planTitlePrice.title} plan`}
        />
      </div>
    </div>
  );
};

export default PlanDetails;
