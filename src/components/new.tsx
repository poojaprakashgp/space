.order-confirmation {
  // New wrapper for right-aligned block
  &__price-footer-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
    max-width: 200px; // adjust as needed for 3–4 line wrap
    word-break: break-word;
    gap: 8px;
  }

  &__price {
    font-size: 16px;
    font-weight: 700;
    color: var(--order-summary-text-primary);
  }

  &__footer {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
    font-size: 14px;
    font-weight: 500;
    font-family: 'GalanoGrotesque-medium', sans-serif;

    img {
      margin-top: 4px;
      width: 16px;
      height: 16px;
    }
  }

  &__footer-text {
    max-width: 100%;
    line-height: 1.3;
    white-space: normal;
  }
}


<div className='order-confirmation__price-footer-wrapper'>
  <div className='order-confirmation__price'>
    {section?.price?.fullPrice}
    {quantity > 1 && (
      <span className='order-confirmation__phoneDetail__quantity'>
        &nbsp;{`(x${quantity})`}
      </span>
    )}
  </div>
  {section?.footer && (
    <div className='order-confirmation__footer'>
      <div className='order-confirmation__footer-text'>
        {section?.footer.title}
      </div>
      {section?.footer.image && (
        <img
          src={section.footer.image.src}
          alt={section.footer.image.alt}
          width={16}
          height={16}
        />
      )}
    </div>
  )}
</div>
